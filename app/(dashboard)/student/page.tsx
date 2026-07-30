"use client";

import { useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  FileText,
  BarChart2,
  Check,
  CalendarDays,
  Calendar,
  Trophy,
  Wallet,
  LogOut,
  Search,
  Bell,
  Wifi,
  Upload,
  Menu,
  X,
} from "lucide-react";
import SubmitAssignmentModal from "@/components/SubmitAssignmentModal";

export default function StudentDashboard() {
  const [selectedAssignment, setSelectedAssignment] = useState<{
    id: string;
    title: string;
    subject: string;
    dueDate: string;
  } | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="flex h-screen bg-white font-sans text-[#1a2332] overflow-hidden">
      {/* ── Mobile Sidebar Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-[#1a2332] rounded flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold leading-none">
                  C
                </span>
              </div>
              <span className="font-bold text-base tracking-tight">CASPAA</span>
            </div>
            <p className="text-[11px] text-gray-500">Student</p>
          </div>
          {/* Mobile-only close icon */}
          <button
            className="md:hidden text-gray-400 hover:text-[#1a2332] p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          <SidebarItem icon={<LayoutGrid size={16} />} label="Dashboard" />
          <SidebarItem icon={<BookOpen size={16} />} label="Learning" />
          <SidebarItem
            icon={<FileText size={16} />}
            label="Assessments"
            isActive
          />
          <SidebarItem icon={<BarChart2 size={16} />} label="My Results" />
          <SidebarItem icon={<Check size={16} />} label="Behaviour" />
          <SidebarItem icon={<CalendarDays size={16} />} label="Timetable" />
          <SidebarItem icon={<Calendar size={16} />} label="Calendar" />
          <SidebarItem icon={<Trophy size={16} />} label="Inter House Points" />
          <SidebarItem icon={<Wallet size={16} />} label="My Wallet" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 md:px-8 md:h-[60px] shrink-0 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-[#1a2332] p-1 -ml-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-[15px] font-bold">Assessments</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search students, staff, classes..."
                className="w-full sm:w-[280px] h-9 bg-gray-50 border-none rounded-lg pl-9 pr-8 text-[12px] focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-5 h-5 bg-white border border-gray-200 rounded text-[10px] text-gray-400 font-medium shadow-sm">
                /
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-4 text-gray-400">
              <div className="flex items-center gap-4">
                <Bell
                  size={18}
                  className="cursor-pointer hover:text-[#1a2332] transition-colors"
                />
                <Wifi size={18} className="text-green-500" />
              </div>
              <div className="flex items-center gap-3 sm:border-l border-gray-200 sm:pl-6">
                <div className="w-8 h-8 rounded-full bg-[#1a2332] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  TO
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] font-semibold text-[#1a2332] whitespace-nowrap">
                    Tobi Okafor
                  </p>
                  <p className="text-[11px] text-gray-500">Student</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Toast Notification */}
          {showToast && (
            <div className="absolute top-4 md:top-0 right-4 md:right-8 bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 z-40 border-l-4 border-l-green-500 w-[calc(100%-2rem)] md:w-auto">
              <Check
                size={16}
                className="text-green-500 shrink-0"
                strokeWidth={3}
              />
              <p className="text-[12px] text-[#1a2332]">
                Assignment submitted &middot;{" "}
                <span className="text-gray-500">
                  your teacher has been notified
                </span>
              </p>
            </div>
          )}

          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-[22px] font-bold mb-1">My Assessments</h2>
            <p className="text-[13px] text-gray-500 mb-6">
              Assignments, exams, and quick tests
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
              <div className="flex items-center gap-2 bg-[#1a2332] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg cursor-pointer">
                <span className="text-[11px] md:text-[12px] font-semibold">
                  Assignments
                </span>
                <span className="bg-white text-[#1a2332] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  1
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[11px] md:text-[12px] font-semibold">
                  CBT Exams
                </span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  2
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[11px] md:text-[12px] font-semibold">
                  Quick Tests
                </span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  1
                </span>
              </div>
            </div>

            {/* Assignment List */}
            <div className="space-y-4">
              {/* Submitted Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-start justify-between shadow-sm gap-3 sm:gap-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                      English Language
                    </span>
                    <span className="bg-[#e2e8f0] text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-full">
                      Submitted
                    </span>
                  </div>
                  <h3 className="text-[14px] md:text-[15px] font-bold text-[#1a2332] mb-1">
                    Essay: My Future Career
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-gray-500 mb-2.5">
                    Write a 300-word essay on what you want to become and why.
                  </p>
                  <p className="text-[10px] md:text-[11px] text-gray-400 font-medium">
                    Due 1 August 2026 &middot; Miss Chioma Okeke
                  </p>
                </div>
                <div className="sm:pt-2">
                  <span className="text-[11px] md:text-[12px] text-gray-400 font-medium">
                    Awaiting grade
                  </span>
                </div>
              </div>

              {/* To Do Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-start justify-between shadow-sm gap-4 sm:gap-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                      Mathematics
                    </span>
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-semibold px-2 py-1 rounded-full">
                      To do
                    </span>
                  </div>
                  <h3 className="text-[14px] md:text-[15px] font-bold text-[#1a2332] mb-1">
                    Algebra Practice - Set 3
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-gray-500 mb-2.5">
                    Solve exercises 1-15 from page 42 of your textbook. Show all
                    working steps.
                  </p>
                  <p className="text-[10px] md:text-[11px] text-gray-400 font-medium">
                    Due 30 July 2026 &middot; Mr. Adamu Ibrahim
                  </p>
                </div>
                <div className="sm:pt-2 flex w-full sm:w-auto">
                  <button
                    onClick={() =>
                      setSelectedAssignment({
                        id: "7b02b51a-2473-489d-a78b-fe33fdc7edfe",
                        title: "Algebra Practice - Set 3",
                        subject: "Mathematics",
                        dueDate: "30 July 2026",
                      })
                    }
                    className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 bg-[#1a2332] text-white px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-[#243047] transition-colors shadow-sm"
                  >
                    <Upload size={14} strokeWidth={2.5} />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Modal */}
      {selectedAssignment && (
        <SubmitAssignmentModal
          isOpen={true}
          onClose={() => setSelectedAssignment(null)}
          assignment={selectedAssignment}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────

function SidebarItem({
  icon,
  label,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) {
  return (
    <button
      className={`flex flex-none items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        isActive
          ? "bg-[#f1f5f9] text-[#1a2332] font-semibold"
          : "text-gray-500 hover:bg-gray-50 hover:text-[#1a2332] font-medium"
      }`}
    >
      <div className={`${isActive ? "text-[#1a2332]" : "text-gray-400"}`}>
        {icon}
      </div>
      <span className="text-[13px] whitespace-nowrap">{label}</span>
    </button>
  );
}
