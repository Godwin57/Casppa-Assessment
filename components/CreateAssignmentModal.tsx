"use client";

import { useState, useEffect, useTransition } from "react";
import {
  X,
  ChevronDown,
  Calendar,
  Paperclip,
  Plus,
  Loader2,
} from "lucide-react";
import { createAssignment } from "@/actions/assignment";

// ── Types ───────────────────────────────────────────────────────────────

export interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Replace with the real authenticated teacher ID from your session */
  teacherId?: string;
}

interface RubricCriterion {
  id: string;
  label: string;
  points: number;
}

// ── Static options ──────────────────────────────────────────────────────

const CLASS_OPTIONS = [
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "SS 1",
  "SS 2",
  "SS 3",
];

const SUBJECT_OPTIONS = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Social Studies",
  "Yoruba",
  "French",
  "Civic Education",
  "Agricultural Science",
];

// ── Component ───────────────────────────────────────────────────────────

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  teacherId = "206101b5-fafb-469c-9617-055f562c82b8",
}: CreateAssignmentModalProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [criteria, setCriteria] = useState<RubricCriterion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset form every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedClass("");
      setSelectedSubject("");
      setDueDate("");
      setCriteria([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ─── Rubric handlers ─────────────────────────────────────────────────

  function addCriterion() {
    setCriteria((prev) => [
      ...prev,
      { id: `crit-${Date.now()}`, label: "", points: 10 },
    ]);
  }

  function removeCriterion(id: string) {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCriterion(
    id: string,
    field: keyof Omit<RubricCriterion, "id">,
    value: string | number,
  ) {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[92vh] flex flex-col shadow-2xl">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <h2 className="text-[17px] font-bold text-[#1a2332]">
            Create Assignment
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-[#1a2332] transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form
          id="create-assignment-form"
          className="overflow-y-auto px-6 pb-4 flex-1 space-y-5"
          action={async (formData) => {
            setError(null);
            startTransition(async () => {
              const result = await createAssignment({
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                type: "FILE_UPLOAD",
                dueDate: formData.get("dueDate") as string,
              });
              if (result.success) {
                onClose();
              } else {
                setError(result.error);
              }
            });
          }}
        >
          {/* Hidden fields */}
          <input type="hidden" name="teacherId" value={teacherId} />
          <input type="hidden" name="type" value="FILE_UPLOAD" />

          {/* Error banner */}
          {error && (
            <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="ca-title"
              className="block text-[12px] font-semibold text-[#1a2332] mb-1.5"
            >
              Title
            </label>
            <input
              id="ca-title"
              name="title"
              type="text"
              placeholder="e.g. Algebra Practice Set 4"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1a2332] transition"
            />
          </div>

          {/* Class + Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ca-class"
                className="block text-[12px] font-semibold text-[#1a2332] mb-1.5"
              >
                Class
              </label>
              <div className="relative">
                <select
                  id="ca-class"
                  name="classTag"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                  className="w-full appearance-none border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2332] cursor-pointer transition"
                >
                  <option value="" disabled />
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ca-subject"
                className="block text-[12px] font-semibold text-[#1a2332] mb-1.5"
              >
                Subject
              </label>
              <div className="relative">
                <select
                  id="ca-subject"
                  name="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                  className="w-full appearance-none border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2332] cursor-pointer transition"
                >
                  <option value="" disabled />
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Description / Instructions */}
          <div>
            <label
              htmlFor="ca-description"
              className="block text-[12px] font-semibold text-[#1a2332] mb-1.5"
            >
              Description / Instructions
            </label>
            <textarea
              id="ca-description"
              name="description"
              placeholder="What students need to do..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1a2332] resize-none transition"
            />
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="ca-due-date"
              className="block text-[12px] font-semibold text-[#1a2332] mb-1.5"
            >
              Due Date
            </label>
            <div className="relative w-fit">
              <label
                htmlFor="ca-due-date"
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Calendar
                  size={20}
                  strokeWidth={1.75}
                  className="text-gray-500 group-hover:text-[#1a2332] transition-colors"
                />
                {dueDate && (
                  <span className="text-[12px] text-[#1a2332] font-medium">
                    {new Date(dueDate + "T00:00:00").toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                )}
              </label>
              <input
                id="ca-due-date"
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* ── Rubric Criteria ─────────────────────────────────────────── */}
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-semibold text-[#1a2332]">
                Rubric Criteria{" "}
                <span className="font-normal text-gray-400 text-[11px]">
                  (optional)
                </span>
              </label>
              <button
                type="button"
                id="add-criterion-btn"
                onClick={addCriterion}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#1a2332] border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus size={12} strokeWidth={2.5} />
                Add Criterion
              </button>
            </div>

            <p className="text-[10px] text-gray-400 mb-2.5">
              Leave empty to grade on a 0–100 score
            </p>

            {/* Expanded state: flat inline rows */}
            {criteria.length > 0 && (
              <div className="space-y-2">
                {criteria.map((c, idx) => (
                  <div key={c.id} className="flex items-center gap-2">
                    {/* Criterion label — named for FormData */}
                    <input
                      type="text"
                      name={`criterion_label_${idx}`}
                      placeholder="Criterion (e.g. Accuracy, Presentation)"
                      value={c.label}
                      onChange={(e) =>
                        updateCriterion(c.id, "label", e.target.value)
                      }
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[11px] text-[#1a2332] placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
                    />

                    {/* Points */}
                    <input
                      type="number"
                      name={`criterion_points_${idx}`}
                      min={1}
                      max={100}
                      value={c.points}
                      onChange={(e) =>
                        updateCriterion(c.id, "points", Number(e.target.value))
                      }
                      className="w-14 border border-gray-200 rounded-lg px-2 py-2 text-[11px] text-center text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
                    />

                    {/* "pts" label */}
                    <span className="text-[11px] text-gray-400 shrink-0">
                      pts
                    </span>

                    {/* Remove — red X */}
                    <button
                      type="button"
                      onClick={() => removeCriterion(c.id)}
                      aria-label="Remove criterion"
                      className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File attachment */}
          <div>
            <label className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3.5 cursor-pointer hover:bg-gray-50 transition-colors group">
              <Paperclip
                size={14}
                className="text-gray-400 group-hover:text-[#1a2332] transition-colors"
              />
              <span className="text-[12px] text-gray-400 group-hover:text-[#1a2332] transition-colors">
                Attach files (simulated)
              </span>
              <input type="file" name="file" multiple className="hidden" />
            </label>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-[12px] font-semibold text-gray-500 hover:text-[#1a2332] transition-colors px-2 py-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-assignment-form"
            disabled={isPending}
            className="flex items-center gap-1.5 bg-[#1a2332] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#243047] active:bg-[#111b2a] transition-colors disabled:opacity-70"
          >
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {isPending ? "Posting…" : "Post Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
