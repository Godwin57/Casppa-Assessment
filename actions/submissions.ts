"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client if env vars are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function submitAssignment(formData: FormData) {
  try {
    // 1. Programmatically look up our mock student
    const student = await prisma.user.findUnique({
      where: { email: "jeremiah@caspaa.test" },
    });

    if (!student) {
      return { error: "Mock student not found. Please run the prisma seed." };
    }

    const assignmentId = formData.get("assignmentId") as string;
    const notes = formData.get("notes") as string;
    const file = formData.get("file") as File | null;

    if (!assignmentId) {
      return { error: "Assignment ID is missing." };
    }

    let fileUrl: string | null = null;

    // Optional: Handle file upload if a file was attached and Supabase is configured
    if (file && file.size > 0) {
      if (supabase) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${student.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("assignments")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // If upload fails, we can either return an error or proceed without fileUrl
          // For a seamless UX in this mock stage, we'll just log it.
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("assignments")
            .getPublicUrl(fileName);
          fileUrl = publicUrlData.publicUrl;
        }
      } else {
        // Fallback for mock environments without Supabase
        fileUrl = `https://mock-storage.caspaa.test/assignments/${file.name}`;
      }
    }

    // 2. Database Operation: Create or update the Submission record in Prisma
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        studentId: student.id,
        assignmentId: assignmentId,
      },
    });

    if (existingSubmission) {
      // Update existing submission (resubmission)
      await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          content: notes || "",
          // Only overwrite fileUrl if a new file was uploaded
          ...(fileUrl && { fileUrl }),
          status: "PENDING",
          version: existingSubmission.version + 1,
        },
      });
    } else {
      // Create new submission
      await prisma.submission.create({
        data: {
          studentId: student.id,
          assignmentId: assignmentId,
          content: notes || "",
          fileUrl: fileUrl,
          status: "PENDING",
          version: 1,
        },
      });
    }

    // 3. Refresh the view upon a successful save
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Submission error:", error);
    return { error: "An unexpected error occurred while saving the submission." };
  }
}
