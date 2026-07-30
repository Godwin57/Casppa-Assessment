"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare, RefreshCw, Loader2 } from "lucide-react";
import { getInlineComments } from "@/actions/grade";

// ── Types ────────────────────────────────────────────────────────────────

interface Pin {
  id: string;
  xCoordinate: number;
  yCoordinate: number;
  content: string;
}

export interface FeedbackReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    submissionId: string | null;
    generalFeedback: string | null;
    studentNote: string | null;
    fileUrl: string | null;
  };
  onProceedToResubmit: () => void;
}

// ── Component ────────────────────────────────────────────────────────────

export default function FeedbackReviewModal({
  isOpen,
  onClose,
  assignment,
  onProceedToResubmit,
}: FeedbackReviewModalProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoadingPins, setIsLoadingPins] = useState(false);

  useEffect(() => {
    if (!isOpen || !assignment.submissionId) return;

    setIsLoadingPins(true);
    setPins([]);

    getInlineComments(assignment.submissionId).then((res) => {
      if (res.data) {
        // Server returns { id, xCoordinate, yCoordinate, content }
        setPins(
          res.data.map((p: any) => ({
            id: p.id,
            xCoordinate: p.xCoordinate,
            yCoordinate: p.yCoordinate,
            content: p.content,
          }))
        );
      }
      setIsLoadingPins(false);
    });
  }, [isOpen, assignment.submissionId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Returned for Revision
              </span>
            </div>
            <h2 className="text-[15px] font-bold text-[#1a2332] leading-snug">
              {assignment.title}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {assignment.subject} · Due {assignment.dueDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-[#1a2332] transition-colors p-1 ml-3 shrink-0"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          {/* Teacher's General Feedback */}
          {assignment.generalFeedback ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare size={14} className="text-blue-600 shrink-0" />
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  Teacher's Feedback
                </p>
              </div>
              <p className="text-[13px] text-blue-900 leading-relaxed">
                {assignment.generalFeedback}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] text-gray-400 italic">
              No general feedback provided.
            </div>
          )}

          {/* Previous Submission + Inline Pins */}
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
              Your Previous Work
            </p>

            {/* Student's written notes */}
            {assignment.studentNote && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 mb-4 text-[12px] text-gray-700 leading-relaxed">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Answer
                </p>
                {assignment.studentNote}
              </div>
            )}

            {/* Pinned image */}
            {assignment.fileUrl ? (
              <div>
                {isLoadingPins ? (
                  <div className="flex items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                    <span className="text-[12px] text-gray-400 ml-2">Loading feedback pins…</span>
                  </div>
                ) : (
                  <>
                    {/* Image with pins overlaid */}
                    <div className="relative inline-block w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={assignment.fileUrl}
                        alt="Your previous submission"
                        className="w-full h-auto object-contain max-h-[360px] block"
                      />

                      {/* Pins — positioned using exact percentage coords from DB */}
                      {pins.map((pin, index) => (
                        <div
                          key={pin.id}
                          className="absolute w-6 h-6 bg-yellow-400 text-[#1a2332] rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-2 ring-white pointer-events-none"
                          style={{
                            left: `${pin.xCoordinate}%`,
                            top: `${pin.yCoordinate}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          title={pin.content}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* Pin legend */}
                    {pins.length > 0 && (
                      <div className="mt-3 space-y-2 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider mb-2">
                          Pin Comments
                        </p>
                        {pins.map((pin, index) => (
                          <div key={pin.id} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 bg-yellow-400 text-[#1a2332] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ring-1 ring-yellow-300">
                              {index + 1}
                            </span>
                            <p className="text-[12px] text-gray-700 leading-relaxed">
                              {pin.content || (
                                <span className="text-gray-400 italic">No text for this pin.</span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-6 text-center text-[12px] text-gray-400">
                No file was attached to this submission.
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto text-[12px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-[#1a2332] transition-colors px-4 py-2.5 rounded-lg"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToResubmit();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1a2332] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#243047] transition-colors"
          >
            <RefreshCw size={13} strokeWidth={2.5} />
            Revise &amp; Resubmit
          </button>
        </div>
      </div>
    </div>
  );
}
