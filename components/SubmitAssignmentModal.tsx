"use client";

import { useState, useTransition, useEffect } from "react";
import { X, UploadCloud, Paperclip, Check, Loader2 } from "lucide-react";
import { submitAssignment } from "@/actions/submissions";

// ── Types ───────────────────────────────────────────────────────────────

export interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
  };
  onSuccess: () => void;
}

// ── Component ───────────────────────────────────────────────────────────

export default function SubmitAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSuccess,
}: SubmitAssignmentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError(null);
    setSelectedFile(file);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-4 shrink-0">
          <h2 className="text-[16px] sm:text-[17px] font-bold text-[#1a2332]">
            Submit Assignment
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-[#1a2332] transition-colors p-1"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── Form wraps both Body and Footer now ── */}
        <form
          className="flex flex-col flex-1 overflow-hidden"
          action={async (formData) => {
            setError(null);
            startTransition(async () => {
              const result = await submitAssignment(formData);
              if (result.success) {
                onSuccess();
                onClose();
              } else {
                setError(result.error || "Submission failed");
              }
            });
          }}
        >
          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto px-4 sm:px-6 pb-4 flex-1 space-y-4 sm:space-y-5">
            {/* Assignment info pill */}
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#1a2332] leading-snug">
                {assignment.title}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {assignment.subject} &middot; Due {assignment.dueDate}
              </p>
            </div>

            {/* Hidden assignment id */}
            <input type="hidden" name="assignmentId" value={assignment.id} />

            {/* Error banner */}
            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Answer / notes */}
            <div>
              <label
                htmlFor="sa-text"
                className="block text-[11px] sm:text-[12px] font-semibold text-[#1a2332] mb-1.5 sm:mb-2"
              >
                Your answer / notes
              </label>
              <textarea
                id="sa-text"
                name="notes"
                rows={4}
                required
                placeholder="Type your answer, or describe the work you are attaching..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-[12px] text-[#1a2332] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1a2332] resize-none transition"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-[11px] sm:text-[12px] font-semibold text-[#1a2332] mb-1.5 sm:mb-2">
                Attach file or photo{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <label
                htmlFor="sa-file"
                className="flex flex-col items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-xl py-5 sm:py-6 px-4 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <UploadCloud
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-400 group-hover:text-[#1a2332] transition-colors"
                />
                <span className="text-[11px] text-gray-400 text-center leading-relaxed group-hover:text-[#1a2332] transition-colors">
                  Click to attach — photo,{" "}
                  <span className="font-semibold">PDF</span>, or document{" "}
                  <br className="sm:hidden" />
                  <span className="text-gray-400">(max 5MB)</span>
                </span>
                <input
                  id="sa-file"
                  name="file"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* File preview chip */}
              {selectedFile && (
                <div className="mt-2.5 flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-lg px-3.5 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip size={13} className="text-green-600 shrink-0" />
                    <span className="text-[11px] font-medium text-green-700 truncate">
                      {selectedFile.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-green-600 shrink-0">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-auto text-[12px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-[#1a2332] transition-colors px-3 py-2.5 rounded-lg disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1a2332] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#243047] active:bg-[#111b2a] transition-colors disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} strokeWidth={2.5} />
              )}
              {isPending ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
