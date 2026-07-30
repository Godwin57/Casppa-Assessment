"use server";

import { prisma } from "@/lib/prisma";

export async function getAcademicOversightData() {
  try {
    const now = new Date();

    // 1. Fetch Summary Card Metrics in parallel
    const [activeAssessmentsCount, pendingSubmissionsCount, overdueCbtCount] =
      await Promise.all([
        // Total Active Assessments (DueDate is in the future)
        prisma.assignment.count({
          where: { dueDate: { gt: now } },
        }),

        // Submissions Pending Review (Status is strictly PENDING)
        prisma.submission.count({
          where: { status: "PENDING" },
        }),

        // Overdue CBTs
        prisma.cbtExam.count({
          where: { dueDate: { lt: now } },
        }),
      ]);

    // 2. Fetch Table Data: Recent Assessments and CBTs
    const recentAssignments = await prisma.assignment.findMany({
      take: 10,
      orderBy: { dueDate: "desc" },
      include: {
        teacher: { select: { name: true } },
        _count: { select: { submissions: true } },
      },
    });

    const recentCbts = await prisma.cbtExam.findMany({
      take: 10,
      orderBy: { dueDate: "desc" },
      include: {
        teacher: { select: { name: true } },
        _count: { select: { results: true } },
      },
    });

    // 3. Merge, sort, and map the data for the frontend table
    const combined = [
      ...recentAssignments.map((a) => ({
        id: a.id,
        title: a.title,
        dueDate: a.dueDate,
        teacher: a.teacher?.name || "Unknown",
        type: a.type === "CBT" ? "CBT Exam" : "Assignment",
        completionRate: `${a._count.submissions} Submitted`,
      })),
      ...recentCbts.map((c) => ({
        id: c.id,
        title: c.title,
        dueDate: c.dueDate,
        teacher: c.teacher?.name || "Unknown",
        type: "CBT Exam",
        completionRate: `${c._count.results} Submitted`,
      })),
    ].sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime()).slice(0, 10);

    const formattedTableData = combined.map((item) => {
      const isOverdue = new Date(item.dueDate) < now;
      return {
        id: item.id,
        title: item.title,
        teacher: item.teacher,
        type: item.type,
        status: isOverdue ? "Overdue" : "Active",
        completionRate: item.completionRate,
      };
    });

    return {
      metrics: {
        activeAssessments: activeAssessmentsCount,
        pendingSubmissions: pendingSubmissionsCount,
        overdueCbts: overdueCbtCount,
      },
      tableData: formattedTableData,
    };
  } catch (error) {
    console.error("Failed to fetch oversight data:", error);
    return { error: "Failed to load dashboard data." };
  }
}

export async function getAssessmentDetail(assignmentId: string) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        teacher: { select: { name: true } },
        submissions: {
          include: {
            student: { select: { name: true } },
            inlineComments: {
              select: { id: true, xCoordinate: true, yCoordinate: true, text: true },
            },
          },
          orderBy: { student: { name: "asc" } },
        },
      },
    });

    if (assignment) {
      return {
        assignment: {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          type: assignment.type,
          dueDate: assignment.dueDate,
          teacherName: assignment.teacher.name,
          submissions: assignment.submissions.map((sub) => {
            const nameParts = (sub.student?.name || "Unknown").split(" ");
            const initials =
              nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0][0].toUpperCase();
            return {
              id: sub.id,
              studentName: sub.student?.name || "Unknown",
              initials,
              status: sub.status,
              evaluation: sub.evaluation ?? null,
              score: sub.score ?? null,
              content: sub.content ?? null,
              fileUrl: sub.fileUrl ?? null,
              generalFeedback: sub.generalFeedback ?? null,
              inlineComments: sub.inlineComments.map((c) => ({
                id: c.id,
                xCoordinate: c.xCoordinate,
                yCoordinate: c.yCoordinate,
                text: c.text,
              })),
            };
          }),
        },
      };
    }

    // 2. If not found, try to fetch as a CBT Exam
    const cbt = await prisma.cbtExam.findUnique({
      where: { id: assignmentId },
      include: {
        teacher: { select: { name: true } },
        results: {
          include: { student: { select: { name: true } } },
          orderBy: { student: { name: "asc" } },
        },
      },
    });

    if (cbt) {
      return {
        assignment: {
          id: cbt.id,
          title: cbt.title,
          description: cbt.description || "",
          type: "CBT Exam",
          dueDate: cbt.dueDate,
          teacherName: cbt.teacher.name,
          submissions: cbt.results.map((res) => {
            const nameParts = (res.student?.name || "Unknown").split(" ");
            const initials =
              nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0][0].toUpperCase();
            return {
              id: res.id,
              studentName: res.student?.name || "Unknown",
              initials,
              status: res.status,
              evaluation: null,
              score: res.score,
              content: null,
              fileUrl: null,
              generalFeedback: res.status === "PENDING" ? "Pending manual review." : "Auto-graded via CBT",
              inlineComments: [],
            };
          }),
        },
      };
    }

    return { error: "Assessment not found." };
  } catch (error) {
    console.error("Failed to fetch assessment detail:", error);
    return { error: "Failed to load assessment details." };
  }
}
