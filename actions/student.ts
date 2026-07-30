"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentAssignments() {
  try {
    // 1. Find our specific mock student
    const student = await prisma.user.findUnique({
      where: { email: "jeremiah@caspaa.test" },
    });

    if (!student) {
      return {
        assignments: [],
        error: "Mock student not found. Please run the prisma seed.",
      };
    }

    // 2. Fetch all assignments and include the student's submission if it exists
    const assignments = await prisma.assignment.findMany({
      orderBy: { dueDate: "asc" },
      include: {
        teacher: {
          select: { name: true },
        },
        submissions: {
          where: { studentId: student.id },
        },
      },
    });

    // 3. Format data for the frontend
    const formattedAssignments = assignments.map((assignment) => {
      const submission = assignment.submissions[0] || null;
      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        type: assignment.type,
        dueDate: assignment.dueDate,
        teacherName: assignment.teacher.name,
        hasSubmitted: !!submission,
        submissionId: submission ? submission.id : null,
        submissionStatus: submission ? submission.status : "TODO",
        score: submission?.score || null,
        evaluation: submission?.evaluation || null,
        generalFeedback: submission?.generalFeedback || null,
        studentNote: submission?.content || null,
        fileUrl: submission?.fileUrl || null,
      };
    });

    return { assignments: formattedAssignments };
  } catch (error) {
    console.error("Failed to fetch student assignments:", error);
    return { assignments: [] };
  }
}

export async function getStudentCbtExams() {
  try {
    const student = await prisma.user.findUnique({
      where: { email: "jeremiah@caspaa.test" },
    });

    if (!student) {
      return { exams: [] };
    }

    const exams = await prisma.cbtExam.findMany({
      orderBy: { dueDate: "asc" },
      include: {
        teacher: { select: { name: true } },
        questions: true,
        results: {
          where: { studentId: student.id },
        },
      },
    });

    const formattedExams = exams.map((exam) => {
      const result = exam.results[0] || null;
      return {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        type: "CBT",
        dueDate: exam.dueDate,
        duration: exam.duration,
        teacherName: exam.teacher.name,
        hasSubmitted: !!result,
        score: result ? result.score : null,
        submittedAt: result ? result.submittedAt : null,
        // Calculate max score
        maxScore: exam.questions.reduce((sum, q) => sum + q.points, 0),
        questions: exam.questions,
      };
    });

    return { exams: formattedExams };
  } catch (error) {
    console.error("Failed to fetch student CBT exams:", error);
    return { exams: [] };
  }
}
