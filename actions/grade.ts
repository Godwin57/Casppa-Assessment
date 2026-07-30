"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function submitGrade(data: {
  submissionId: string;
  score: number;
  evaluation: string;
  feedback: string;
  pins: { x: number; y: number; text: string }[];
}) {
  try {
    // 1. Programmatically lookup mock teacher
    const teacher = await prisma.user.findUnique({
      where: { email: "teacher@caspaa.test" },
    });

    if (!teacher) {
      return { success: false, error: "Teacher not found. Please run seed." };
    }

    // 2. Perform the update and inserts in a Prisma transaction
    await prisma.$transaction(async (tx) => {
      // Update Submission
      await tx.submission.update({
        where: { id: data.submissionId },
        data: {
          score: data.score,
          evaluation: data.evaluation as any, // "NEEDS_REVISION", "SATISFACTORY", "EXCELLENT"
          generalFeedback: data.feedback,
          status: "MARKED", // PENDING, MARKED, RETURNED
        },
      });

      // Clear existing pins to avoid duplicates on re-grading (optional, but safe)
      await tx.inlineComment.deleteMany({
        where: { submissionId: data.submissionId },
      });

      // Insert new inline comments
      if (data.pins && data.pins.length > 0) {
        const pinPayload = data.pins.map((pin) => ({
          submissionId: data.submissionId,
          teacherId: teacher.id,
          xCoordinate: pin.x,
          yCoordinate: pin.y,
          text: pin.text,
        }));

        await tx.inlineComment.createMany({
          data: pinPayload,
        });
      }
    });

    revalidatePath("/teacher");
    return { success: true };
  } catch (error) {
    console.error("Grading error:", error);
    return { success: false, error: "Failed to save grade and comments." };
  }
}

export async function returnSubmission(data: {
  submissionId: string;
  feedback: string;
  pins: { x: number; y: number; text: string }[];
}) {
  try {
    const teacher = await prisma.user.findUnique({
      where: { email: "teacher@caspaa.test" },
    });

    if (!teacher) {
      return { success: false, error: "Teacher not found. Please run seed." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.submission.update({
        where: { id: data.submissionId },
        data: {
          evaluation: "NEEDS_REVISION",
          generalFeedback: data.feedback,
          status: "RETURNED",
        },
      });

      await tx.inlineComment.deleteMany({
        where: { submissionId: data.submissionId },
      });

      if (data.pins && data.pins.length > 0) {
        const pinPayload = data.pins.map((pin) => ({
          submissionId: data.submissionId,
          teacherId: teacher.id,
          xCoordinate: pin.x,
          yCoordinate: pin.y,
          text: pin.text,
        }));

        await tx.inlineComment.createMany({
          data: pinPayload,
        });
      }
    });

    revalidatePath("/teacher");
    return { success: true };
  } catch (error) {
    console.error("Return to student error:", error);
    return { success: false, error: "Failed to return submission." };
  }
}

export async function getInlineComments(submissionId: string) {
  try {
    const comments = await prisma.inlineComment.findMany({
      where: { submissionId },
      select: {
        id: true,
        xCoordinate: true,
        yCoordinate: true,
        text: true,
      }
    });

    // Map Prisma schema `text` back to frontend `content` expected by the pin component
    const formattedPins = comments.map(c => ({
      id: c.id,
      xCoordinate: c.xCoordinate,
      yCoordinate: c.yCoordinate,
      content: c.text,
    }));

    return { data: formattedPins };
  } catch (error) {
    console.error("Failed to fetch pins:", error);
    return { error: "Failed to load existing pins." };
  }
}

