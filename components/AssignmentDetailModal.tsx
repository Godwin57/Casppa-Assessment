"use client";

import { useState } from "react";
import { X, Paperclip, SquarePen, Trash2, BarChart2 } from "lucide-react";
import { FullMarkingView } from "@/components/FullMarkingView";

// ── Types ──────────────────────────────────────────────────────────────────

type EvaluationStatus = "NEEDS_REVISION" | "SATISFACTORY" | "EXCELLENT";

export interface SubmissionItem {
  id: string;
  initials: string;
  name: string;
  submittedAt: string;
  isPending: boolean;
  studentNote: string;
  fileName: string;
  fileUrl?: string; // <-- ADDED THIS so the interface accepts the image link
  score?: number;
  maxScore?: number;
  evaluation?: EvaluationStatus;
  awaitingResubmission?: boolean;
  teacherFeedback?: string;
}

export interface AssignmentDetail {
  id: string;
  title: string;
  classTag: string;
  subject: string;
  dueDate: string;
  instructions: string;
  submissionCount: number;
  totalStudents: number;
  submissions: SubmissionItem[];
}

interface Props {
  assignment: AssignmentDetail;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPushToResults: (id: string) => void;
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const mockAssignment: AssignmentDetail = {
  id: "asgn-001",
  title: "Algebra Practice - Set 3",
  classTag: "JSS 1",
  subject: "Mathematics",
  dueDate: "30 July 2026",
  instructions:
    "Solve exercises 1-15 from page 42 of your textbook. Show all working steps.",
  submissionCount: 2,
  totalStudents: 2,
  submissions: [
    {
      id: "sub-001",
      initials: "TO",
      name: "Tobi Okafor",
      submittedAt: "2h ago",
      isPending: true,
      studentNote: "the work is done",
      fileName: "My Assignment.pdf",
      // Added test image so you can test the pinning logic immediately
      fileUrl:
        "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1471&auto=format&fit=crop",
    },
    {
      id: "sub-002",
      initials: "AL",
      name: "Ade Lawal",
      submittedAt: "2d ago",
      isPending: false,
      studentNote: "Please see my working in the attached image.",
      fileName: "algebra_working.svg",
      fileUrl:
        "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1471&auto=format&fit=crop",
      score: 68,
      maxScore: 100,
      evaluation: "NEEDS_REVISION",
      awaitingResubmission: true,
      teacherFeedback:
        "Good attempt Ade! You made a sign error in question 7 — when you move a term across the equals sign the sign must flip. Also, you need to show all working steps for questions 11 and 12 — answers alone will not get full marks. Please revise and resubmit.",
    },
  ],
};

// ── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
      <span className="text-white text-[11px] font-bold">{initials}</span>
    </div>
  );
}

function SubmissionCard({
  sub,
  onMark,
}: {
  sub: SubmissionItem;
  onMark?: () => void;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        sub.isPending ? "border-green-400" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials={sub.initials} />
          <div>
            <p className="text-[13px] font-semibold text-[#1a2332]">
              {sub.name}
            </p>
            <p className="text-[10px] text-gray-400">
              Submitted {sub.submittedAt}
            </p>
          </div>
        </div>
        {sub.isPending ? (
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
            To grade
          </span>
        ) : (
          <span className="text-[12px] font-bold text-[#1a2332] shrink-0">
            {sub.score}/{sub.maxScore}
          </span>
        )}
      </div>

      {/* Student note */}
      <div className="border border-gray-200 rounded-lg px-3 py-2.5 mb-2.5 text-[11px] text-gray-500">
        {sub.studentNote}
      </div>

      {/* File */}
      {sub.fileName && (
        <div className="flex items-center gap-1.5 mb-3">
          <Paperclip size={12} className="text-gray-400" />
          <span className="text-[11px] text-gray-500 underline underline-offset-2 cursor-pointer hover:text-[#1a2332] transition-colors">
            {sub.fileName}
          </span>
        </div>
      )}

      {/* CTA */}
      {sub.isPending ? (
        <button
          onClick={onMark}
          className="w-full flex items-center justify-center gap-2 bg-[#1a2332] text-white text-[11px] font-semibold py-2.5 rounded-lg hover:bg-[#243047] transition-colors"
        >
          <SquarePen size={13} strokeWidth={2} />
          Open Full Marking View
        </button>
      ) : (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {sub.evaluation === "NEEDS_REVISION" && (
              <span className="text-[10px] font-semibold text-red-500 border border-red-200 bg-red-50 px-2 py-0.5 rounded">
                Needs Revision
              </span>
            )}
            {sub.awaitingResubmission && (
              <span className="text-[10px] font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded">
                Awaiting resubmission
              </span>
            )}
            <button className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-[#1a2332] transition-colors">
              <SquarePen size={11} strokeWidth={1.75} />
              View / Re-mark
            </button>
          </div>
          {sub.teacherFeedback && (
            <p className="text-[10px] text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-500">
                Teacher comments:{" "}
              </span>
              {sub.teacherFeedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────

export function AssignmentDetailModal({
  assignment,
  onClose,
  onDelete,
  onEdit,
  onPushToResults,
}: Props) {
  const [markingSub, setMarkingSub] = useState<SubmissionItem | null>(null);
  const pendingCount = assignment.submissions.filter((s) => s.isPending).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[580px] max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-0 shrink-0">
          <h2 className="text-[17px] font-bold text-[#1a2332] leading-snug">
            {assignment.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-[#1a2332] transition-colors mt-0.5 ml-4 shrink-0"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-4 flex-1 space-y-5">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold text-[#1a2332] bg-[#eef0f5] px-2.5 py-1 rounded">
              {assignment.classTag}
            </span>
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
              {assignment.subject}
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
              Due {assignment.dueDate}
            </span>
          </div>

          {/* Instructions */}
          <div>
            <p className="text-[9px] font-bold text-gray-400 tracking-[0.12em] uppercase mb-2">
              Instructions
            </p>
            <div className="border border-gray-200 rounded-lg px-4 py-3 text-[12px] text-gray-600 leading-relaxed">
              {assignment.instructions}
            </div>
          </div>

          {/* Submissions */}
          <div>
            <p className="text-[9px] font-bold text-gray-400 tracking-[0.12em] uppercase mb-3">
              Submissions ({assignment.submissionCount}/
              {assignment.totalStudents})
            </p>
            {assignment.submissions && assignment.submissions.length > 0 ? (
              <div className="space-y-3">
                {assignment.submissions.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    onMark={sub.isPending ? () => setMarkingSub(sub) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-6 text-center">
                No submissions have been graded or received yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 shrink-0 flex-wrap">
          <button
            onClick={() => onDelete(assignment.id)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <Trash2 size={13} strokeWidth={2} />
            Delete
          </button>
          <button
            onClick={onClose}
            className="text-[11px] font-semibold text-gray-600 border border-gray-300 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onPushToResults(assignment.id)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1a2332] border border-[#1a2332] px-3.5 py-2 rounded-lg hover:bg-[#1a2332] hover:text-white transition-colors"
          >
            <BarChart2 size={13} strokeWidth={2} />
            Push to Results
          </button>
          <button
            onClick={() => onEdit(assignment.id)}
            className="flex items-center gap-1.5 bg-[#1a2332] text-white text-[11px] font-semibold px-3.5 py-2 rounded-lg hover:bg-[#243047] transition-colors"
          >
            <SquarePen size={13} strokeWidth={2} />
            Edit
          </button>
        </div>
      </div>

      {/* ── Full Marking View (stacks on top) ── */}
      <FullMarkingView
        submissionId={markingSub?.id ?? ""}
        isOpen={!!markingSub}
        onClose={() => setMarkingSub(null)}
        studentName={markingSub?.name ?? ""}
        studentInitials={markingSub?.initials ?? ""}
        submittedAt={markingSub?.submittedAt ?? ""}
        assignmentTitle={assignment.title}
        fileUrl={markingSub?.fileUrl} // <-- PASSED THE PROP HERE
        totalSubmissions={assignment.totalStudents}
        currentIndex={
          markingSub
            ? assignment.submissions.findIndex((s) => s.id === markingSub.id) +
              1
            : 1
        }
      />
    </div>
  );
}

// ── Demo wrapper ────────────────────────────────────────────────────────────

export default function AssignmentDetailModalDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#1a2332] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
        >
          Open Modal
        </button>
      )}
      {open && (
        <AssignmentDetailModal
          assignment={mockAssignment}
          onClose={() => setOpen(false)}
          onDelete={(id) => console.log("Delete", id)}
          onEdit={(id) => console.log("Edit", id)}
          onPushToResults={(id) => console.log("Push to Results", id)}
        />
      )}
    </div>
  );
}
