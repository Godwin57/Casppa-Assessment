import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, FileText, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      submissions: {
        include: {
          student: { select: { name: true } },
        },
        orderBy: {
          student: { name: "asc" },
        },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  // Format date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(assignment.dueDate));

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 pb-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Button */}
        <Link
          href="/proprietor"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a2332] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2332]">
                  {assignment.title}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    assignment.type === "CBT"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {assignment.type === "CBT" ? "CBT" : "Assignment"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
                <div className="flex items-center gap-1.5">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {assignment.teacher.name}
                  </span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Due: {formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 flex flex-col items-center min-w-[120px]">
                <span className="text-3xl font-bold text-[#1a2332] leading-none mb-1">
                  {assignment.submissions.length}
                </span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Submissions Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1a2332]">Student Submissions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 border-b border-gray-100">Student Name</th>
                      <th className="px-6 py-4 border-b border-gray-100">Status</th>
                      <th className="px-6 py-4 border-b border-gray-100">Evaluation</th>
                      <th className="px-6 py-4 border-b border-gray-100">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {assignment.submissions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No submissions yet.
                        </td>
                      </tr>
                    ) : (
                      assignment.submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1a2332]">
                            {submission.student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                submission.status === "RETURNED"
                                  ? "bg-green-100 text-green-700"
                                  : submission.status === "MARKED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                            {submission.evaluation ? (
                              <span
                                className={`text-xs font-bold ${
                                  submission.evaluation === "EXCELLENT"
                                    ? "text-green-600"
                                    : submission.evaluation === "SATISFACTORY"
                                    ? "text-blue-600"
                                    : "text-amber-600"
                                }`}
                              >
                                {submission.evaluation.replace("_", " ")}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-[#1a2332]">
                            {submission.score !== null ? `${submission.score}%` : <span className="text-gray-400 font-normal">-</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            {/* Description Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-gray-400" />
                <h3 className="text-lg font-bold text-[#1a2332]">Description</h3>
              </div>
              <div className="prose prose-sm text-gray-600 max-w-none">
                {assignment.description ? (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {assignment.description}
                  </p>
                ) : (
                  <p className="italic text-gray-400">No description provided.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
