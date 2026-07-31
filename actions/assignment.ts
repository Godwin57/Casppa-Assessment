"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AssignmentType } from "@prisma/client";

// ── Input type ─────────────────────────────────────────────────────────────

interface CreateAssignmentInput {
  title: string;
  description: string;
  type: AssignmentType;
  /** ISO-8601 date string, e.g. "2026-07-30" from <input type="date"> */
  dueDate: string;
}

// ── Return type ────────────────────────────────────────────────────────────

type ActionResult =
  | { success: true; assignmentId: string }
  | { success: false; error: string };

// ── Server Action ──────────────────────────────────────────────────────────

export async function createAssignment(
  data: CreateAssignmentInput,
): Promise<ActionResult> {
  // ── Validation ───────────────────────────────────────────────────────────
  if (!data.title.trim()) {
    return { success: false, error: "Title is required." };
  }

  const parsedDate = new Date(data.dueDate);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: "Invalid due date." };
  }

  try {
    // 1. Fetch our fixed mock teacher
    const teacher = await prisma.user.findUnique({
      where: { email: "teacher@caspaa.test" },
    });

    if (!teacher) {
      return {
        success: false,
        error: "Mock teacher not found. Please run the prisma seed.",
      };
    }

    // 2. Create the assignment linked to the mock teacher
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        dueDate: parsedDate,
        teacherId: teacher.id,
      },
    });

    // Invalidate the teacher dashboard so the new card appears immediately
    revalidatePath("/teacher");
    revalidatePath("/student");
    revalidatePath("/proprietor");

    return { success: true, assignmentId: assignment.id };
  } catch (err) {
    console.error("[createAssignment]", err);

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
