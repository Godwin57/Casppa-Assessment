"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function submitGrade(data: {
  submissionId: string;
  score: number;
  evaluation: string;
  feedback: string;
  pins: { x: number; y: number; text: string }[];
}) {
  try {
    // 1. Update the Submission with the grade and feedback
    const { error: subError } = await supabase
      .from("Submission")
      .update({
        score: data.score,
        evaluation: data.evaluation,
        teacherFeedback: data.feedback,
        status: "GRADED", // or 'RETURNED'
      })
      .eq("id", data.submissionId);

    if (subError) throw subError;

    // 2. Save all the inline pins (if any)
    if (data.pins.length > 0) {
      const pinPayload = data.pins.map((pin) => ({
        id: crypto.randomUUID(),
        submissionId: data.submissionId,

        teacherId: "teacher-123",

        xCoordinate: pin.x,
        yCoordinate: pin.y,
        content: pin.text,
      }));

      const { error: pinError } = await supabase
        .from("InlineComment")
        .insert(pinPayload);

      if (pinError) throw pinError;
    }

    revalidatePath("/teacher");
    return { success: true };
  } catch (error) {
    console.error("Grading error:", error);
    return { error: "Failed to save grade and comments." };
  }
}

export async function getInlineComments(submissionId: string) {
  try {
    const { data, error } = await supabase
      .from("InlineComment")
      .select('id, "xCoordinate", "yCoordinate", content')
      .eq("submissionId", submissionId);

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Failed to fetch pins:", error);
    return { error: "Failed to load existing pins." };
  }
}
