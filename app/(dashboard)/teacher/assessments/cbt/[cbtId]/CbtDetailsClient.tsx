"use client";

import { useState, useTransition } from "react";
import {
  ChevronLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { gradeCbtSubmission } from "@/actions/cbt";

// ── Types ────────────────────────────────────────────────────────────────
interface CbtQuestion {
  id: string;
  type: string;
  prompt: string;
  options: any;
  correctAnswer: string;
  points: number;
}

interface CbtExam {
  id: string;
  title: string;
  dueDate: Date;
  questions: CbtQuestion[];
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  initials: string;
  status: string;
  score: number | null;
  answers: any;
  submittedAt: Date;
}

interface Props {
  exam: CbtExam;
  submissions: Submission[];
}

// ── Status Badge Component ───────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === "PENDING") {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        Needs Grading
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
      Graded
    </span>
  );
}

// ── Main Client ──────────────────────────────────────────────────────────
export default function CbtDetailsClient({ exam, submissions }: Props) {
  const router = useRouter();
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const totalStudents = 30; // Fallback based on your mock
  const completionRate = submissions.length;
  const progress = Math.round((completionRate / totalStudents) * 100);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(exam.dueDate));

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-gray-900 overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/teacher")}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-[#1a2332] transition-colors mb-4"
            >
              <ChevronLeft size={16} strokeWidth={2} />
              Back to Dashboard
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1a2332]">
                  {exam.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    Due {formattedDate}
                  </span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex flex-col min-w-[200px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Completion
                  </span>
                  <span className="text-[12px] font-bold text-[#1a2332]">
                    {completionRate}/{totalStudents}
                  </span>
                </div>
                <div className="h-[6px] bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1a2332]">
                Student Submissions
              </h3>
            </div>
            <div className="overflow-x-auto">
              {submissions.length === 0 ? (
                <div className="py-16 text-center text-[13px] text-gray-400">
                  No submissions yet.
                </div>
              ) : (
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 border-b border-gray-100">
                        Student
                      </th>
                      <th className="px-6 py-4 border-b border-gray-100">
                        Submitted At
                      </th>
                      <th className="px-6 py-4 border-b border-gray-100">
                        Status
                      </th>
                      <th className="px-6 py-4 border-b border-gray-100">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        onClick={() => setSelectedSub(sub)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
                              <span className="text-white text-[10px] font-bold">
                                {sub.initials}
                              </span>
                            </div>
                            <span className="font-bold text-[#1a2332] group-hover:underline">
                              {sub.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                          {new Date(sub.submittedAt).toLocaleDateString()}{" "}
                          {new Date(sub.submittedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[#1a2332]">
                          {sub.score !== null ? (
                            <span className="text-green-700">
                              {sub.score}{" "}
                              <span className="text-gray-400 font-normal text-[11px]">
                                pts
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Grading Modal */}
      {selectedSub && (
        <GradingModal
          exam={exam}
          submission={selectedSub}
          onClose={() => setSelectedSub(null)}
        />
      )}
    </div>
  );
}

// ── Grading Modal ────────────────────────────────────────────────────────
function GradingModal({
  exam,
  submission,
  onClose,
}: {
  exam: CbtExam;
  submission: Submission;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [manualScores, setManualScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  // Auto-calculated max score for the whole exam
  const totalMaxScore = exam.questions.reduce((sum, q) => sum + q.points, 0);

  function handleSaveAndGrade() {
    startTransition(async () => {
      const result = await gradeCbtSubmission(submission.id, manualScores);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || "An unexpected error occurred");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-[#1a2332]">
              Grading Submission
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] font-bold text-gray-500">
                {submission.studentName}
              </span>
              <span className="text-gray-300">|</span>
              <StatusBadge status={submission.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1a2332] transition-colors p-1"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 bg-gray-50">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-[13px]">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {exam.questions.map((q, idx) => {
              const studentAnswer = submission.answers[q.id];
              const isShortAnswer = q.type === "SHORT_ANSWER";
              const isCorrect =
                !isShortAnswer && studentAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="text-[14px] font-bold text-[#1a2332] leading-relaxed">
                      <span className="text-gray-400 mr-2">Q{idx + 1}.</span>
                      {q.prompt}
                    </p>
                    <span className="shrink-0 text-[11px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded">
                      {q.points} pts
                    </span>
                  </div>

                  {isShortAnswer ? (
                    <div className="bg-[#f8fafc] border border-gray-100 rounded-lg p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Student's Response
                      </p>
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {studentAnswer || (
                          <span className="italic text-gray-400">
                            No response provided.
                          </span>
                        )}
                      </p>

                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-[12px] font-bold text-amber-600 flex items-center gap-1.5">
                          <AlertCircle size={14} /> Needs Grading
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-gray-500">
                            Award Points:
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={q.points}
                            value={manualScores[q.id] ?? ""}
                            onChange={(e) =>
                              setManualScores((prev) => ({
                                ...prev,
                                [q.id]: Number(e.target.value),
                              }))
                            }
                            className="w-16 border border-gray-200 rounded px-2 py-1 text-[12px] text-center font-bold text-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#1a2332]"
                          />
                          <span className="text-[11px] font-bold text-gray-400">
                            / {q.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg p-4 border ${isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Student's Selection
                        </p>
                        {isCorrect ? (
                          <span className="text-[11px] font-bold text-green-700 flex items-center gap-1">
                            <CheckCircle2 size={13} /> Correct
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                            <X size={13} /> Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-semibold text-[#1a2332] mb-1">
                        {q.type === "MCQ"
                          ? studentAnswer
                            ? q.options[parseInt(studentAnswer)]
                            : "No selection"
                          : studentAnswer || "No selection"}
                      </p>
                      {!isCorrect && (
                        <p className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-red-100">
                          Correct Answer:{" "}
                          <span className="font-bold text-[#1a2332]">
                            {q.type === "MCQ"
                              ? q.options[parseInt(q.correctAnswer)]
                              : q.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0 bg-white">
          <div className="text-[12px] text-gray-500 font-medium">
            Auto-graded Score:{" "}
            <span className="font-bold text-[#1a2332]">{submission.score}</span>{" "}
            / {totalMaxScore}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-[12px] font-semibold text-gray-500 hover:text-[#1a2332] px-2 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndGrade}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-[#1a2332] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#243047] disabled:opacity-70 transition-colors"
            >
              {isPending && <Loader2 size={13} className="animate-spin" />}
              {isPending ? "Saving..." : "Save & Grade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
