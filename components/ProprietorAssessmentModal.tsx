"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Calendar,
  FileText,
  ChevronLeft,
  Loader2,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { getAssessmentDetail } from "@/actions/admin";

// ── Types ────────────────────────────────────────────────────────────────

interface InlineComment {
  id: string;
  xCoordinate: number;
  yCoordinate: number;
  text: string;
}

interface Submission {
  id: string;
  studentName: string;
  initials: string;
  status: string;
  evaluation: string | null;
  score: number | null;
  content: string | null;
  fileUrl: string | null;
  generalFeedback: string | null;
  inlineComments: InlineComment[];
}

interface AssessmentDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: Date;
  teacherName: string;
  submissions: Submission[];
}

interface Props {
  assessmentId: string | null;
  onClose: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    MARKED: "bg-blue-100 text-blue-700",
    RETURNED: "bg-orange-100 text-orange-700",
  };
  const label: Record<string, string> = {
    PENDING: "Pending",
    MARKED: "Graded",
    RETURNED: "Returned",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {label[status] ?? status}
    </span>
  );
}

function EvalBadge({ evaluation }: { evaluation: string | null }) {
  if (!evaluation) return <span className="text-gray-400 text-[12px]">—</span>;
  const map: Record<string, string> = {
    EXCELLENT: "text-green-700 bg-green-50 border-green-200",
    SATISFACTORY: "text-blue-700 bg-blue-50 border-blue-200",
    NEEDS_REVISION: "text-orange-700 bg-orange-50 border-orange-200",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${map[evaluation] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {evaluation.replace("_", " ")}
    </span>
  );
}

// ── Submission Inspector Pane ─────────────────────────────────────────────

function SubmissionInspector({
  sub,
  onBack,
}: {
  sub: Submission;
  onBack: () => void;
}) {
  return (
    <div>
      {/* Sticky back-nav — stays visible while scrolling */}
      <div className="sticky top-0 z-10 bg-white flex flex-wrap items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-[#1a2332] transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          All Submissions
        </button>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">{sub.initials}</span>
          </div>
          <span className="text-[13px] font-bold text-[#1a2332]">{sub.studentName}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={sub.status} />
          <EvalBadge evaluation={sub.evaluation} />
          {sub.score !== null && (
            <span className="text-[12px] font-bold text-green-700">
              {sub.score}<span className="text-gray-400 font-medium">/100</span>
            </span>
          )}
        </div>
      </div>

      {/* Scrollable content — plain block flow, no flex height tricks */}
      <div className="px-5 py-5 space-y-5">
        {/* Teacher Feedback */}
        {sub.generalFeedback && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare size={13} className="text-blue-600 shrink-0" />
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                Teacher's Feedback
              </p>
            </div>
            <p className="text-[12px] text-blue-900 leading-relaxed">{sub.generalFeedback}</p>
          </div>
        )}

        {/* Student's Written Answer */}
        {sub.content && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Student's Answer
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-3 text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {sub.content}
            </div>
          </div>
        )}

        {/* File with inline pins */}
        {sub.fileUrl && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Attached Work {sub.inlineComments.length > 0 && `· ${sub.inlineComments.length} pin${sub.inlineComments.length !== 1 ? "s" : ""}`}
            </p>
            {/* inline-block wrapper collapses to the image's rendered size so
                percentage-based pin coordinates resolve correctly */}
            <div className="relative inline-block max-w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sub.fileUrl}
                alt="Student submission"
                className="max-w-full h-auto block"
                style={{ maxHeight: "420px", width: "auto" }}
              />
              {sub.inlineComments.map((pin, idx) => (
                <div
                  key={pin.id}
                  className="absolute w-6 h-6 bg-yellow-400 text-[#1a2332] rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-2 ring-white pointer-events-none"
                  style={{
                    left: `${pin.xCoordinate}%`,
                    top: `${pin.yCoordinate}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  title={pin.text}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Pin legend */}
            {sub.inlineComments.length > 0 && (
              <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider">
                  Pin Comments
                </p>
                {sub.inlineComments.map((pin, idx) => (
                  <div key={pin.id} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-yellow-400 text-[#1a2332] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ring-1 ring-yellow-300">
                      {idx + 1}
                    </span>
                    <p className="text-[12px] text-gray-700 leading-relaxed">
                      {pin.text || <span className="italic text-gray-400">No text.</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!sub.fileUrl && !sub.content && (
          <div className="py-8 text-center text-[12px] text-gray-400">
            No answer or attachment recorded for this submission.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────

export default function ProprietorAssessmentModal({ assessmentId, onClose }: Props) {
  const [detail, setDetail] = useState<AssessmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [inspectedSub, setInspectedSub] = useState<Submission | null>(null);

  useEffect(() => {
    if (!assessmentId) return;
    setDetail(null);
    setFetchError(null);
    setInspectedSub(null);
    setIsLoading(true);

    getAssessmentDetail(assessmentId).then((res) => {
      if ("error" in res) {
        setFetchError(res.error ?? "Unknown error");
      } else {
        setDetail(res.assignment as unknown as AssessmentDetail);
      }
      setIsLoading(false);
    });
  }, [assessmentId]);

  if (!assessmentId) return null;

  const formattedDate = detail
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(detail.dueDate))
    : "";

  const pendingCount = detail?.submissions.filter((s) => s.status === "PENDING").length ?? 0;
  const gradedCount = detail?.submissions.filter((s) => s.status === "MARKED").length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* max-h + min-h-0 on the flex body is the correct pattern for scrollable flex modals.
          h-[92vh] (fixed) was causing clipping on mobile; max-h lets the shell shrink on
          short screens while the overflow-y-auto body handles scrolling. */}
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          {detail ? (
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    detail.type === "CBT Exam"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {detail.type}
                </span>
                {pendingCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                    {pendingCount} Pending
                  </span>
                )}
                {gradedCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                    {gradedCount} Graded
                  </span>
                )}
              </div>
              <h2 className="text-[17px] font-bold text-[#1a2332] leading-snug truncate">
                {detail.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={12} className="text-gray-400" />
                  {detail.teacherName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-gray-400" />
                  Due {formattedDate}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-[#1a2332] transition-colors p-1 shrink-0"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── Modal Body — single overflow-y-auto; no nested flex height chains ── */}
        <div className="flex-1 min-h-0 overflow-y-auto pb-24 sm:pb-6">
          {isLoading && (
            <div className="flex items-center justify-center h-full py-20">
              <Loader2 size={24} className="animate-spin text-gray-400" />
              <span className="ml-2 text-[13px] text-gray-400">Loading details…</span>
            </div>
          )}

          {fetchError && (
            <div className="p-8 text-center text-red-500 text-[13px]">{fetchError}</div>
          )}

          {detail && !inspectedSub && (
            <div>
              {/* Description strip */}
              {detail.description && (
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 text-[12px] text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-700">Instructions: </span>
                  {detail.description}
                </div>
              )}

              {/* Submissions label row */}
              <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Submissions ({detail.submissions.length})
                </p>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <FileText size={13} className="text-gray-400" />
                  Click a row to inspect
                </div>
              </div>

              {detail.submissions.length === 0 ? (
                <div className="py-16 text-center text-[13px] text-gray-400">
                  No submissions yet.
                </div>
              ) : (
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-100">Student</th>
                      <th className="px-6 py-3 border-b border-gray-100">Status</th>
                      <th className="px-6 py-3 border-b border-gray-100">Evaluation</th>
                      <th className="px-6 py-3 border-b border-gray-100">Score</th>
                      <th className="px-6 py-3 border-b border-gray-100">Pins</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detail.submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        onClick={() => setInspectedSub(sub)}
                        className="hover:bg-[#f8fafc] cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
                              <span className="text-white text-[10px] font-bold">{sub.initials}</span>
                            </div>
                            <span className="font-semibold text-[#1a2332] group-hover:underline">
                              {sub.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <EvalBadge evaluation={sub.evaluation} />
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap font-bold text-[#1a2332]">
                          {sub.score !== null ? (
                            <span className="text-green-700">{sub.score}<span className="text-gray-400 font-normal text-[11px]">/100</span></span>
                          ) : (
                            <span className="text-gray-400 font-normal">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          {sub.inlineComments.length > 0 ? (
                            <span className="flex items-center gap-1 text-[11px] text-amber-700">
                              <Paperclip size={11} />
                              {sub.inlineComments.length}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Inline Submission Inspector */}
          {detail && inspectedSub && (
            <SubmissionInspector
              sub={inspectedSub}
              onBack={() => setInspectedSub(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
