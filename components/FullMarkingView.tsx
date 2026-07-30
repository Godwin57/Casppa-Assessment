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

import { useState, useEffect } from "react";
import { submitGrade, returnSubmission, getInlineComments } from "@/actions/grade";
import { X, Star, Check, RefreshCw, Send, Loader2 } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────

type MarkStatus = "EXCELLENT" | "SATISFACTORY" | "NEEDS_REVISION" | null;

interface InlineComment {
  id: string;
  x: number;
  y: number;
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
  submissionId: string;
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
  submissionId,
  currentIndex,
}: FullMarkingViewProps) {
  const [score, setScore] = useState("");
  const [markStatus, setMarkStatus] = useState<MarkStatus>(null);
  const [feedback, setFeedback] = useState("");
  const [inlineComments, setInlineComments] = useState<InlineComment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    // Only attempt to fetch if the modal is open and we have a valid ID
    if (isOpen && submissionId) {
      // 1. Clear any stale pins from a previously viewed student
      setInlineComments([]);

      // 2. Fetch the saved pins from the database
      getInlineComments(submissionId).then((result) => {
        if (result.data) {
          // 3. Map the database columns (xCoordinate) back to the UI state (x)
          const loadedPins = result.data.map((pin: any) => ({
            id: pin.id,
            x: pin.xCoordinate,
            y: pin.yCoordinate,
            text: pin.content,
          }));

          setInlineComments(loadedPins);
        } else if (result.error) {
          console.error(result.error);
        }
      });
    }
  }, [isOpen, submissionId]);

  if (!isOpen) return null;

  function appendQuickComment(text: string) {
    setFeedback((prev) => (prev ? `${prev}\n${text}` : text));
  }

  // Calculate percentages to ensure pins scale across devices
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setInlineComments((prev) => [
      ...prev,
      { id: `ic-${Date.now()}`, x, y, text: "" },
    ]);
  };

  async function handleSave() {
    if (!score) {
      setErrorMessage("Please enter a score before saving.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitGrade({
        submissionId: submissionId,
        score: Number(score),
        evaluation: markStatus || "SATISFACTORY",
        feedback: feedback,
        pins: inlineComments.map((ic) => ({ x: ic.x, y: ic.y, text: ic.text })),
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        onClose();
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReturn() {
    setIsReturning(true);
    setErrorMessage(null);

    try {
      const result = await returnSubmission({
        submissionId: submissionId,
        feedback: feedback,
        pins: inlineComments.map((ic) => ({ x: ic.x, y: ic.y, text: ic.text })),
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        onClose();
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred while returning to student.");
    } finally {
      setIsReturning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[880px] h-[95vh] flex-col md:h-auto md:max-h-[92vh] md:flex-row flex overflow-hidden shadow-2xl">
        {/* ── Left: Submission Viewer ── */}
        <div className="h-[45%] md:h-auto md:flex-1 flex flex-col min-w-0 bg-gray-50">
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

          {/* Submission content (Interactive Pin Canvas) */}
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            {fileUrl ? (
              <div
                className="relative inline-block cursor-crosshair bg-white shadow-sm rounded-lg"
                onClick={handleImageClick}
              >
                <img
                  src={fileUrl}
                  alt="Student submission"
                  className="max-w-full rounded-lg object-contain"
                />

                {/* Render the visual pins */}
                {inlineComments.map((pin, index) => (
                  <div
                    key={pin.id}
                    className="absolute w-6 h-6 bg-yellow-400 text-[#1a2332] rounded-full flex items-center justify-center text-[11px] font-bold shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-2 ring-white"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-300">No file submitted</p>
            )}
          </div>
        </div>

        {/* ── Right: Grading Panel ── */}
        <div className="h-[55%] w-full border-t border-gray-100 md:h-auto md:w-[300px] md:border-t-0 md:border-l shrink-0 flex flex-col bg-white">
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
              <label className="block text-[11px] font-semibold text-[#1a2332] mb-1.5">
                Inline Comments
              </label>

              {inlineComments.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic">
                  Click anywhere on the image to add a pin.
                </p>
              ) : (
                <div className="space-y-3 mt-2">
                  {inlineComments.map((ic, index) => (
                    <div key={ic.id} className="flex gap-2 items-start">
                      <span className="w-6 h-6 bg-yellow-400 text-[#1a2332] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <textarea
                        value={ic.text}
                        onChange={(e) => {
                          const newComments = [...inlineComments];
                          newComments[index].text = e.target.value;
                          setInlineComments(newComments);
                        }}
                        placeholder={`Comment for pin ${index + 1}...`}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332] resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
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

          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-5 mb-2 bg-red-50 border border-red-200 text-red-600 text-[11px] px-3 py-2 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Action buttons */}
          <div className="px-5 pb-5 pt-3 space-y-2 shrink-0 border-t border-gray-100">
            <button
              type="button"
              disabled={isSubmitting || isReturning}
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-[#1a2332] text-white text-[12px] font-semibold py-3 rounded-xl hover:bg-[#243047] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={14} strokeWidth={2.5} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
              {isSubmitting ? "Saving Grade..." : "Save & Grade"}
            </button>
            <button
              type="button"
              disabled={isSubmitting || isReturning}
              onClick={handleReturn}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-[12px] font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isReturning ? <Loader2 size={13} strokeWidth={2} className="animate-spin" /> : <Send size={13} strokeWidth={2} />}
              {isReturning ? "Returning..." : "Return to Student"}
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
        submissionId="test-id-123"
        onClose={() => setOpen(false)}
        studentName="Chiamaka Okafor"
        studentInitials="CO"
        submittedAt="3h ago"
        assignmentTitle="Multiplication Tables"
        // Demo placeholder image to immediately test pinning
        fileUrl="https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1471&auto=format&fit=crop"
        totalSubmissions={1}
        currentIndex={1}
      />
    </div>
  );
}
