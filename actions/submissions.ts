"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function submitAssignment(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (user.role !== "STUDENT") {
      return { error: "Only students can submit assignments." };
    }

    const assignmentId = formData.get("assignmentId") as string;
    const notes = formData.get("notes") as string;
    const file = formData.get("file") as File | null;

    let fileUrl = null;

    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("assignments")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { error: "Failed to upload file." };
      }

      const { data: publicUrlData } = supabase.storage
        .from("assignments")
        .getPublicUrl(fileName);

      fileUrl = publicUrlData.publicUrl;
    }

    // FIREWALL BYPASS: Using Supabase client (HTTPS) instead of Prisma (TCP)
    const { error: dbError } = await supabase.from("Submission").insert({
      id: crypto.randomUUID(), // Supabase needs an ID if Prisma isn't auto-generating it
      studentId: user.id,
      assignmentId: assignmentId,
      content: notes || "",
      fileUrl: fileUrl,
    });

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      return { error: "Failed to save submission." };
    }

    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Submission error:", error);
    return { error: "An unexpected error occurred." };
  }
}
