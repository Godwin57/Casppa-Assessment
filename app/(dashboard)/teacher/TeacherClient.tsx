"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  ClipboardList,
  BarChart2,
  BookOpen,
  BookMarked,
  Receipt,
  Calendar,
  Clock,
  Check,
  NotebookPen,
  MessageCircle,
  TrendingUp,
  LogOut,
  Bell,
  Wifi,
  Search,
  Plus,
  SquarePen,
} from "lucide-react";
import {
  AssignmentDetailModal,
  type AssignmentDetail,
  type SubmissionItem,
} from "@/components/AssignmentDetailModal";
import CreateAssignmentModal from "@/components/CreateAssignmentModal";
import CreateCbtModal from "@/components/CreateCbtModal";
import { getAssignmentSubmissions } from "@/actions/teacher";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: Date;
  submissionCount: number;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Classes", icon: Users },
  { label: "Attendance", icon: ClipboardList },
  { label: "Enter Results", icon: BarChart2 },
  { label: "Assessments", icon: BookOpen, active: true },
  { label: "Lessons & Content", icon: BookMarked },
  { label: "My Payslip", icon: Receipt },
  { label: "Calendar", icon: Calendar },
  { label: "My Schedule", icon: Clock },
  { label: "Inter House Points", icon: Check },
  { label: "Diary", icon: NotebookPen },
  { label: "Messages", icon: MessageCircle },
  { label: "My Appraisal", icon: TrendingUp },
];

const tabs = ["Assignments", "CBT Exams", "Quick Tests"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AssignmentCard({
  assignment,
  onClick,
}: {
  assignment: Assignment;
  onClick: () => void;
}) {
  const totalStudents = 30; // Fallback for now until we have class enrollments
  const progress = Math.round(
    (assignment.submissionCount / totalStudents) * 100,
  );

  const formattedDueDate = new Date(assignment.dueDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  
  const isOverdue = new Date(assignment.dueDate) < new Date();
  const status = isOverdue ? "Closed" : "Active";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#1a2332]/20 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1a2332]"
    >
      {/* Tags + Edit */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[#1a2332] bg-[#eef0f5] px-2 py-0.5 rounded">
            General Class
          </span>
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            General Subject
          </span>
        </div>
        <button
          aria-label="Edit assignment"
          className="text-gray-400 hover:text-[#1a2332] transition-colors"
        >
          <SquarePen size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-bold text-sm text-[#1a2332] mb-1 leading-snug">
        {assignment.title}
      </h3>

      {/* Description */}
      <p className="text-[11px] text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {assignment.description || "No description provided."}
      </p>

      {/* Submissions Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-400">Submissions</span>
          <span className="text-[10px] font-semibold text-[#1a2332]">
            {assignment.submissionCount}/{totalStudents}
          </span>
        </div>
        <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1a2332] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-gray-400">
          Due {formattedDueDate}
        </span>
        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
            status === "Active"
              ? "text-green-600 bg-green-50"
              : "text-gray-500 bg-gray-100"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherClient({
  initialAssignments,
  initialCbtExams,
  error,
}: {
  initialAssignments: any[];
  initialCbtExams: any[];
  error?: string;
}) {
  const [activeTab, setActiveTab] = useState("Assignments");
  const router = useRouter();
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentDetail | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateCbtOpen, setIsCreateCbtOpen] = useState(false);

  async function handleCardClick(a: Assignment) {
    const { submissions } = await getAssignmentSubmissions(a.id);

    setSelectedAssignment({
      id: a.id,
      title: a.title,
      classTag: "General Class",
      subject: "General Subject",
      dueDate: new Date(a.dueDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      instructions: a.description || "No description provided.",
      submissionCount: a.submissionCount,
      totalStudents: 30, // Fallback
      submissions: submissions as SubmissionItem[] || [],
    });
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="hidden md:flex flex-col w-44 bg-white border-r border-gray-100 shrink-0">
          {/* Logo */}
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center gap-2">
              {/* Logo mark */}
              <div className="w-6 h-6 bg-[#1a2332] rounded-md flex items-center justify-center shrink-0">
                <span className="text-white text-[8px] font-black tracking-tighter">
                  C
                </span>
              </div>
              <span className="font-extrabold text-[#1a2332] text-sm tracking-widest uppercase">
                Caspaa
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 ml-8">Teacher</p>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-2 py-1 space-y-px overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-left transition-colors duration-150 ${
                  item.active
                    ? "bg-[#1a2332] text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1a2332]"
                }`}
              >
                <item.icon size={15} strokeWidth={1.75} className="shrink-0" />
                <span className="text-[11px] font-medium leading-none">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="px-2 pb-5 pt-2 border-t border-gray-100">
            <button className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-150">
              <LogOut size={15} strokeWidth={1.75} className="shrink-0" />
              <span className="text-[11px] font-medium">Sign out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-[60px] bg-white border-b border-gray-100 flex items-center px-5 gap-3 shrink-0">
            {/* Left label (desktop) */}
            <p className="font-semibold text-[#1a2332] text-sm hidden lg:block shrink-0">
              Assessments
            </p>

            {/* Search */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[360px]">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search students, staff, classes..."
                  className="w-full pl-8 pr-8 py-[7px] text-[11px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a2332] placeholder:text-gray-400 text-[#1a2332]"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 bg-gray-200 px-1 py-0.5 rounded font-mono">
                  /
                </kbd>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                aria-label="Notifications"
                className="relative text-gray-500 hover:text-[#1a2332] transition-colors"
              >
                <Bell size={17} strokeWidth={1.75} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>

              <Wifi size={17} strokeWidth={1.75} className="text-green-500" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
                  <span className="text-white text-[11px] font-bold">MA</span>
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-[11px] font-semibold text-[#1a2332]">
                    Mr. Adamu
                  </p>
                  <p className="text-[10px] text-gray-400">Teacher</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
            {/* Page Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#1a2332]">
                  Assessments
                </h1>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Assignments, CBT exams, and formative quick tests in one
                  place.
                </p>
              </div>
              <button
                id="new-assignment-btn"
                onClick={() => activeTab === "CBT Exams" ? setIsCreateCbtOpen(true) : setIsCreateOpen(true)}
                className="flex items-center gap-1.5 bg-[#1a2332] text-white text-[11px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#243047] active:bg-[#111b2a] transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={13} strokeWidth={2.5} />
                {activeTab === "CBT Exams" ? "New CBT Exam" : "New Assignment"}
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex items-center gap-1 mb-6 bg-gray-100 w-fit p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                    activeTab === tab
                      ? "bg-[#1a2332] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Assignments" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {error ? (
                  <div className="col-span-full p-4 text-red-500 bg-red-50 rounded-lg">
                    {error}
                  </div>
                ) : initialAssignments.length === 0 ? (
                  <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
                    No assignments found. Click "New Assignment" to create one.
                  </div>
                ) : (
                  initialAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onClick={() => handleCardClick(assignment)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "CBT Exams" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {initialCbtExams.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                    <BookOpen size={38} strokeWidth={1} />
                    <p className="text-sm">No CBT exams yet.</p>
                  </div>
                ) : (
                  initialCbtExams.map((exam) => (
                    <AssignmentCard
                      key={exam.id}
                      assignment={exam}
                      onClick={() => router.push(`/teacher/assessments/cbt/${exam.id}`)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "Quick Tests" && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                <ClipboardList size={38} strokeWidth={1} />
                <p className="text-sm">No quick tests yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Assignment Detail Modal ── */}
      {selectedAssignment && (
        <AssignmentDetailModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onDelete={(id) => {
            console.log("Delete", id);
            setSelectedAssignment(null);
          }}
          onEdit={(id) => console.log("Edit", id)}
          onPushToResults={(id) => console.log("Push to Results", id)}
        />
      )}

      {/* ── Create Assignment Modal ── */}
      <CreateAssignmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* ── Create CBT Modal ── */}
      <CreateCbtModal
        isOpen={isCreateCbtOpen}
        onClose={() => setIsCreateCbtOpen(false)}
      />
    </>
  );
}
