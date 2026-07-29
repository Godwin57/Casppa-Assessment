"use client";

/**
 * PARENT INTEGRATION (AssignmentDetailModal.tsx):
 *
 * 1. import { FullMarkingView } from '@/components/FullMarkingView';
 *
 * 2. Add to AssignmentDetailModal state:
 *    const [markingSub, setMarkingSub] = useState<SubmissionItem | null>(null);
 *
 * 3. Pass to SubmissionCard (pending cards only):
 *    onOpenMarking={() => setMarkingSub(sub)}
 *
 * 4. On the "Open Full Marking View" button inside SubmissionCard:
 *    onClick={() => onOpenMarking?.()}
 *
 * 5. Render inside AssignmentDetailModal (after closing </div>):
 *    <FullMarkingView
 *      isOpen={!!markingSub}
 *      onClose={() => setMarkingSub(null)}
 *      studentName={markingSub?.name ?? ''}
 *      studentInitials={markingSub?.initials ?? ''}
 *      submittedAt={markingSub?.submittedAt ?? ''}
 *      assignmentTitle={assignment.title}
 *      totalSubmissions={assignment.totalStudents}
 *      currentIndex={1}
 *    />
 */

import { useState } from "react";
import { X, Star, Check, RefreshCw, Plus, Send } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────

type MarkStatus = "EXCELLENT" | "SATISFACTORY" | "NEEDS_REVISION" | null;

interface InlineComment {
  id: string;
  text: string;
}

export interface FullMarkingViewProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentInitials: string;
  submittedAt: string;
  assignmentTitle: string;
  fileUrl?: string;
  totalSubmissions: number;
  currentIndex: number;
}

const QUICK_COMMENTS = [
  "Good work!",
  "Well done",
  "See correction above",
  "Revise and resubmit",
  "Check your working",
  "Needs more detail",
  "Excellent effort",
];

// ── Component ───────────────────────────────────────────────────────────

export function FullMarkingView({
  isOpen,
  onClose,
  studentName,
  studentInitials,
  submittedAt,
  assignmentTitle,
  fileUrl,
  totalSubmissions,
  currentIndex,
}: FullMarkingViewProps) {
  const [score, setScore] = useState("");
  const [markStatus, setMarkStatus] = useState<MarkStatus>(null);
  const [feedback, setFeedback] = useState("");
  const [inlineComments, setInlineComments] = useState<InlineComment[]>([]);
  const [addingComment, setAddingComment] = useState(false);
  const [newComment, setNewComment] = useState("");

  if (!isOpen) return null;

  function appendQuickComment(text: string) {
    setFeedback((prev) => (prev ? `${prev}\n${text}` : text));
  }

  function commitComment() {
    if (!newComment.trim()) return;
    setInlineComments((prev) => [
      ...prev,
      { id: `ic-${Date.now()}`, text: newComment.trim() },
    ]);
    setNewComment("");
    setAddingComment(false);
  }

  function handleSave() {
    console.log("Save & Grade", { score, markStatus, feedback, inlineComments });
    onClose();
  }

  function handleReturn() {
    console.log("Return to Student");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[880px] max-h-[92vh] flex overflow-hidden shadow-2xl">

        {/* ── Left: Submission Viewer ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100 shrink-0">
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-[#1a2332] transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-bold">
                  {studentInitials}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1a2332]">
                  {studentName}
                </p>
                <p className="text-[10px] text-gray-400">
                  Submitted {submittedAt}
                </p>
              </div>
            </div>

            <span className="text-[11px] text-gray-400 font-medium">
              {currentIndex} / {totalSubmissions}
            </span>
          </div>

          {/* Submission content */}
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            {fileUrl ? (
              <img
                src={fileUrl}
                alt="Student submission"
                className="max-w-full rounded-lg object-contain"
              />
            ) : (
              <p className="text-[12px] text-gray-300">No file submitted</p>
            )}
          </div>
        </div>

        {/* ── Right: Grading Panel ── */}
        <div className="w-[300px] shrink-0 flex flex-col border-l border-gray-100 bg-white">
          <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 space-y-4">

            {/* Assignment title */}
            <h3 className="text-[15px] font-bold text-[#1a2332]">
              {assignmentTitle}
            </h3>

            {/* Score */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2332] mb-1.5">
                Score / 100
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="—"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-[#1a2332] text-center placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
              />
            </div>

            {/* Mark Status */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2332] mb-2">
                Mark Status
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setMarkStatus("EXCELLENT")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[9px] font-semibold transition-all ${
                    markStatus === "EXCELLENT"
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Star
                    size={15}
                    className="text-amber-400"
                    fill={markStatus === "EXCELLENT" ? "#fbbf24" : "none"}
                  />
                  excellent
                </button>

                <button
                  type="button"
                  onClick={() => setMarkStatus("SATISFACTORY")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[9px] font-semibold transition-all ${
                    markStatus === "SATISFACTORY"
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Check
                    size={15}
                    className={
                      markStatus === "SATISFACTORY"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }
                  />
                  satisfactory
                </button>

                <button
                  type="button"
                  onClick={() => setMarkStatus("NEEDS_REVISION")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[9px] font-semibold transition-all ${
                    markStatus === "NEEDS_REVISION"
                      ? "border-orange-400 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <RefreshCw
                    size={13}
                    className={
                      markStatus === "NEEDS_REVISION"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }
                  />
                  needs revision
                </button>
              </div>
            </div>

            {/* Inline Comments */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-[#1a2332]">
                  Inline Comments
                </label>
                <button
                  type="button"
                  onClick={() => setAddingComment(true)}
                  className="flex items-center gap-0.5 text-[10px] font-semibold text-[#1a2332] border border-gray-200 px-2 py-0.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus size={11} strokeWidth={2.5} />
                  Add
                </button>
              </div>

              {inlineComments.length === 0 && !addingComment ? (
                <p className="text-[10px] text-gray-400">
                  Click &quot;Add&quot; to add a comment.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {inlineComments.map((ic) => (
                    <p
                      key={ic.id}
                      className="text-[11px] text-[#1a2332] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5"
                    >
                      {ic.text}
                    </p>
                  ))}
                  {addingComment && (
                    <div className="flex gap-1.5">
                      <input
                        autoFocus
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && commitComment()}
                        placeholder="Type comment…"
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
                      />
                      <button
                        type="button"
                        onClick={commitComment}
                        className="bg-[#1a2332] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[#243047] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* General Feedback */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2332] mb-1.5">
                General Feedback
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Overall feedback, corrections, suggestions..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[11px] text-[#1a2332] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1a2332] resize-none"
              />
            </div>

            {/* Quick Comments */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-2">
                Quick comments
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COMMENTS.map((qc) => (
                  <button
                    key={qc}
                    type="button"
                    onClick={() => appendQuickComment(qc)}
                    className="text-[10px] text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {qc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-5 pt-3 space-y-2 shrink-0 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-[#1a2332] text-white text-[12px] font-semibold py-3 rounded-xl hover:bg-[#243047] transition-colors"
            >
              <Check size={14} strokeWidth={2.5} />
              Save &amp; Grade
            </button>
            <button
              type="button"
              onClick={handleReturn}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-[12px] font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors"
            >
              <Send size={13} strokeWidth={2} />
              Return to Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Demo wrapper ────────────────────────────────────────────────────────

export default function FullMarkingViewDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#1a2332] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
        >
          Open Marking View
        </button>
      )}
      <FullMarkingView
        isOpen={open}
        onClose={() => setOpen(false)}
        studentName="Chiamaka Okafor"
        studentInitials="CO"
        submittedAt="3h ago"
        assignmentTitle="Multiplication Tables"
        totalSubmissions={1}
        currentIndex={1}
      />
    </div>
  );
}
