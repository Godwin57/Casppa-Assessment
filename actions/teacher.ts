"use server";

import { prisma } from "@/lib/prisma";

export async function getTeacherAssignments() {
  try {
    // 1. Find our specific mock teacher
    const teacher = await prisma.user.findUnique({
      where: { email: "teacher@caspaa.test" },
    });

    if (!teacher) {
      return {
        assignments: [],
        error: "Mock teacher not found. Please run the prisma seed.",
      };
    }

    // 2. Fetch assignments created exclusively by this teacher
    const assignments = await prisma.assignment.findMany({
      where: { teacherId: teacher.id },
      orderBy: { dueDate: "desc" },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    // 3. Format data for the frontend
    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      dueDate: assignment.dueDate,
      submissionCount: assignment._count.submissions,
    }));

    return { assignments: formattedAssignments };
  } catch (error) {
    console.error("Failed to fetch teacher assignments:", error);
    return { assignments: [] };
  }
}

export async function getTeacherCbtExams() {
  try {
    const teacher = await prisma.user.findUnique({
      where: { email: "teacher@caspaa.test" },
    });

    if (!teacher) {
      return { exams: [] };
    }

    const exams = await prisma.cbtExam.findMany({
      where: { teacherId: teacher.id },
      orderBy: { dueDate: "desc" },
      include: {
        _count: {
          select: { results: true },
        },
      },
    });

    const formattedExams = exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      type: "CBT",
      dueDate: exam.dueDate,
      submissionCount: exam._count.results,
    }));

    return { exams: formattedExams };
  } catch (error) {
    console.error("Failed to fetch teacher CBT exams:", error);
    return { exams: [] };
  }
}

export async function getAssignmentSubmissions(assignmentId: string) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        submissions: {
          include: {
            student: { select: { name: true } },
            inlineComments: true,
          },
          orderBy: { status: "asc" }, // Pending first maybe? Or just by student name.
        },
      },
    });

    if (!assignment) {
      return { error: "Assignment not found." };
    }

    const formattedSubmissions = assignment.submissions.map((sub) => {
      const studentName = sub.student?.name || "Unknown Student";
      const nameParts = studentName.split(" ");
      const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0]}`.toUpperCase();

      const fileName = sub.fileUrl ? sub.fileUrl.split("/").pop() || "Attached File" : "";

      return {
        id: sub.id,
        initials,
        name: studentName,
        submittedAt: "Recently", // You can format a real date if you add createdAt to Submission
        isPending: sub.status === "PENDING",
        studentNote: sub.content || "",
        fileName: fileName,
        fileUrl: sub.fileUrl || undefined,
        score: sub.score !== null ? sub.score : undefined,
        maxScore: 100, // Assuming 100 for now
        evaluation: sub.evaluation || undefined,
        awaitingResubmission: sub.status === "RETURNED" && sub.evaluation === "NEEDS_REVISION",
        teacherFeedback: sub.generalFeedback || undefined,
      };
    });

    return { submissions: formattedSubmissions };
  } catch (error) {
    console.error("Failed to fetch assignment submissions:", error);
    return { error: "Failed to load submissions." };
  }
}

