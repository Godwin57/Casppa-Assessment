"use client";

import React, { useState } from "react";
import ProprietorAssessmentModal from "@/components/ProprietorAssessmentModal";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BellRing,
  Briefcase,
  BookOpen,
  Coins,
  Store,
  BarChart2,
  Settings,
  MessageSquare,
  Calendar as CalendarIcon,
  Trophy,
  LogOut,
  Search,
  Bell,
  Wifi,
  Menu,
  X,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DashboardData {
  metrics: {
    activeAssessments: number;
    pendingSubmissions: number;
    overdueCbts: number;
  };
  tableData: any[]; // Using any[] here to accommodate both real data and the mock if needed
}

const sidebarLinks = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true,
    href: "/proprietor",
  },
  { name: "Students", icon: Users, href: "/proprietor/students" },
  { name: "Admissions", icon: UserPlus, href: "#" },
  { name: "Front Desk", icon: BellRing, href: "#" },
  { name: "Staff & HR", icon: Briefcase, href: "#" },
  { name: "Academic", icon: BookOpen, href: "#" },
  { name: "Finance", icon: Coins, href: "#" },
  { name: "School Store", icon: Store, href: "#" },
  { name: "Reports", icon: BarChart2, href: "#" },
  { name: "Operations", icon: Settings, href: "#" },
  { name: "Communications", icon: MessageSquare, href: "#" },
  { name: "Calendar", icon: CalendarIcon, href: "#" },
  { name: "Inter House Points", icon: Trophy, href: "#" },
];

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const { metrics, tableData } = data;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-gray-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- Left Sidebar --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-5 flex items-center justify-between lg:justify-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-[#1a2332] flex items-center justify-center relative overflow-hidden">
                {/* Decorative shapes for CASPAA logo */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/40 rounded-tr-full"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1a2332]">
                CASPAA
              </span>
            </div>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5 ml-7">
              School Proprietor
            </p>
          </div>
          <button
            className="lg:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 mt-2 custom-scrollbar">
          {sidebarLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                link.active
                  ? "bg-gray-100 text-[#1a2332]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <link.icon
                size={16}
                className={link.active ? "text-[#1a2332]" : "text-gray-400"}
              />
              {link.name}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </a>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-[#1a2332] hidden sm:block">
              Dashboard
            </h1>

            <div className="relative w-full max-w-md ml-0 sm:ml-8 hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search students, staff, classes..."
                className="w-full bg-gray-50 border border-transparent rounded-lg py-1.5 pl-9 pr-8 text-[13px] outline-none focus:bg-white focus:border-gray-300 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-gray-400 font-medium bg-white">
                /
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="text-green-500 transition-colors">
              <Wifi size={18} />
            </button>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 sm:pl-6 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#1a2332] flex items-center justify-center text-white text-[11px] font-bold">
                MO
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] font-bold text-[#1a2332] leading-none">
                  Mr. Olusegun
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  School Proprietor
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1a2332]">
                Dashboard - Academic Oversight
              </h2>
              <p className="text-[13px] text-gray-500 mt-1">
                Monitor school-wide active assessments, review pipelines, and
                completion rates.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-500 mb-0.5">
                    Total Active Assessments
                  </p>
                  <p className="text-2xl font-bold text-[#1a2332]">{metrics.activeAssessments}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-500 mb-0.5">
                    Submissions Pending Review
                  </p>
                  <p className="text-2xl font-bold text-[#1a2332]">{metrics.pendingSubmissions}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-500 mb-0.5">
                    Overdue CBTs
                  </p>
                  <p className="text-2xl font-bold text-[#1a2332]">{metrics.overdueCbts}</p>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#1a2332]">
                  School-Wide Assessments
                </h3>
                <button className="text-[12px] font-semibold text-gray-600 hover:text-[#1a2332]">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">
                        Assessment
                      </th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">
                        Teacher
                      </th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">
                        Type
                      </th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">
                        Status
                      </th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">
                        Completion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tableData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No recent assessments found.
                        </td>
                      </tr>
                    ) : (
                      tableData.map((assessment) => (
                        <tr
                          key={assessment.id}
                          onClick={() => setSelectedAssessmentId(assessment.id)}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-[#1a2332]">
                              {assessment.title}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {assessment.className || "All Classes"}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-[#1a2332]">
                              {assessment.teacher}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {assessment.subject || "General"}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                assessment.type === "CBT Exam"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {assessment.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                assessment.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : assessment.status === "Overdue"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {assessment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[12px] font-medium text-gray-600">
                            {assessment.completionRate}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Assessment Detail Modal */}
      <ProprietorAssessmentModal
        assessmentId={selectedAssessmentId}
        onClose={() => setSelectedAssessmentId(null)}
      />
    </div>
  );
}
