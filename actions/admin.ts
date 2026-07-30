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

        // Overdue CBTs (Type is CBT and DueDate is in the past)
        prisma.assignment.count({
          where: {
            type: "CBT",
            dueDate: { lt: now },
          },
        }),
      ]);

    // 2. Fetch Table Data: Recent Assessments with their Submission Counts
    const recentAssessments = await prisma.assignment.findMany({
      take: 10,
      orderBy: { dueDate: "desc" }, // Using dueDate since createdAt isn't in your schema
      include: {
        teacher: {
          select: { name: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    // 3. Map the data for the frontend table
    const formattedTableData = recentAssessments.map((assessment) => {
      const isOverdue = new Date(assessment.dueDate) < now;

      return {
        id: assessment.id,
        title: assessment.title,
        teacher: assessment.teacher?.name || "Unknown",
        type: assessment.type === "CBT" ? "CBT" : "Assignment",
        status: isOverdue ? "Overdue" : "Active",
        completionRate: `${assessment._count.submissions} Submitted`, // Modified to omit total count
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
