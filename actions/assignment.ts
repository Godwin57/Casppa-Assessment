"use server";

import { prisma } from "@/lib/prisma";
import { AssignmentType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ── Input type ─────────────────────────────────────────────────────────────

interface CreateAssignmentInput {
  title: string;
  description: string;
  type: AssignmentType;
  /** ISO-8601 date string, e.g. "2026-07-30" from <input type="date"> */
  dueDate: string;
  /**
   * ID of the authenticated teacher creating this assignment.
   * Replace this with your auth session ID once auth is wired up:
   *   const session = await getServerSession();
   *   const teacherId = session.user.id;
   */
  teacherId: string;
}

// ── Return type ────────────────────────────────────────────────────────────

type ActionResult =
  | { success: true; assignmentId: string }
  | { success: false; error: string };

// ── Server Action ──────────────────────────────────────────────────────────

export async function createAssignment(
  data: CreateAssignmentInput
): Promise<ActionResult> {
  // ── Validation ───────────────────────────────────────────────────────────
  if (!data.title.trim()) {
    return { success: false, error: "Title is required." };
  }
  if (!data.teacherId) {
    return { success: false, error: "Teacher ID is required." };
  }

  const parsedDate = new Date(data.dueDate);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: "Invalid due date." };
  }

  // ── Database insert ──────────────────────────────────────────────────────
  try {
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type,
        dueDate: parsedDate,
        teacherId: data.teacherId,
      },
    });

    // Invalidate the teacher dashboard so the new card appears immediately
    revalidatePath("/teacher");

    return { success: true, assignmentId: assignment.id };
  } catch (err) {
    console.error("[createAssignment]", err);

    // Surface a Prisma foreign-key violation (teacherId not found) clearly
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2003"
    ) {
      return {
        success: false,
        error: "The specified teacher does not exist.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
