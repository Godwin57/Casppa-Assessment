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
    return { assignments: [], error: "Failed to load assignments." };
  }
}
