import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CbtDetailsClient from "./CbtDetailsClient";

export default async function CbtExamPage({
  params,
}: {
  params: Promise<{ cbtId: string }>; // 1. Change type to Promise
}) {
  const { cbtId } = await params; // 2. Await the params here

  const cbtExam = await prisma.cbtExam.findUnique({
    where: { id: cbtId },
    include: {
      questions: true,
      results: {
        include: {
          student: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!cbtExam) {
    return notFound();
  }

  // Format data for the client
  const submissions = cbtExam.results.map((r) => {
    const nameParts = (r.student.name || "Unknown").split(" ");
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : nameParts[0][0].toUpperCase();

    return {
      id: r.id,
      studentId: r.student.id,
      studentName: r.student.name,
      initials,
      status: r.status,
      score: r.score,
      answers: r.answers,
      submittedAt: r.submittedAt,
    };
  });

  return (
    <CbtDetailsClient
      exam={{
        id: cbtExam.id,
        title: cbtExam.title,
        dueDate: cbtExam.dueDate,
        questions: cbtExam.questions,
      }}
      submissions={submissions}
    />
  );
}
