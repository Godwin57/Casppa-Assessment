"use client";

import React, { useState } from "react";
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
  TrendingUp,
  Download,
  Upload,
  Plus,
  ChevronDown,
  Edit,
  MoreVertical,
  Menu,
  X
} from "lucide-react";
import { AddStudentModal } from "@/components/AddStudentModal";

// --- Mock Data ---

interface Student {
  id: string;
  initials: string;
  name: string;
  details: string;
  admissionNo: string;
  className: string;
  parent: string;
  feeStatus: "Paid" | "Partial" | "Outstanding";
  activities?: number;
}

const allStudents: Student[] = [
  {
    id: "1",
    initials: "CO",
    name: "Chiamaka Okafor",
    details: "Female · 10 yrs · active",
    admissionNo: "BL/2024/001",
    className: "Primary 3",
    parent: "Mr. Tunde Okafor",
    feeStatus: "Paid",
    activities: 2,
  },
  {
    id: "2",
    initials: "TO",
    name: "Tobi Okafor",
    details: "Male · 12 yrs · active",
    admissionNo: "BL/2024/002",
    className: "JSS 1",
    parent: "Mr. Tunde Okafor",
    feeStatus: "Partial",
    activities: 2,
  },
  {
    id: "3",
    initials: "ZB",
    name: "Zainab Bello",
    details: "Female · 14 yrs · active",
    admissionNo: "BL/2024/003",
    className: "JSS 2",
    parent: "Mrs. Aisha Bello",
    feeStatus: "Outstanding",
  },
  {
    id: "4",
    initials: "YB",
    name: "Yusuf Bello",
    details: "Male · 9 yrs · active",
    admissionNo: "BL/2024/004",
    className: "Primary 2",
    parent: "Mrs. Aisha Bello",
    feeStatus: "Paid",
  },
  {
    id: "5",
    initials: "DE",
    name: "Daniel Eze",
    details: "Male · 7 yrs · active",
    admissionNo: "BL/2024/005",
    className: "Primary 1",
    parent: "Mr. Chinedu Eze",
    feeStatus: "Partial",
  },
  {
    id: "6",
    initials: "NE",
    name: "Ngozi Eze",
    details: "Female · 10 yrs · active",
    admissionNo: "BL/2024/006",
    className: "Primary 3",
    parent: "Mr. Chinedu Eze",
    feeStatus: "Outstanding",
  },
  {
    id: "7",
    initials: "IM",
    name: "Ibrahim Musa",
    details: "Male · 6 yrs · active",
    admissionNo: "BL/2024/007",
    className: "Primary 1",
    parent: "Mrs. Hauwa Musa",
    feeStatus: "Paid",
  },
  {
    id: "8",
    initials: "FM",
    name: "Fatima Musa",
    details: "Female · 17 yrs · active",
    admissionNo: "BL/2024/008",
    className: "SSS 1",
    parent: "Mrs. Hauwa Musa",
    feeStatus: "Partial",
    activities: 1,
  },
  {
    id: "9",
    initials: "AL",
    name: "Ade Lawal",
    details: "Male · 12 yrs · active",
    admissionNo: "BL/2024/009",
    className: "JSS 1",
    parent: "Mr. Kunle Lawal",
    feeStatus: "Outstanding",
    activities: 1,
  },
  {
    id: "10",
    initials: "BL",
    name: "Bisi Lawal",
    details: "Female · 8 yrs · active",
    admissionNo: "BL/2024/010",
    className: "Primary 2",
    parent: "Mr. Kunle Lawal",
    feeStatus: "Paid",
  },
];

const newEnrollments: Student[] = [
  {
    id: "1",
    initials: "JB",
    name: "Jeremiah Balogun",
    details: "Male · 16 yrs · active",
    admissionNo: "BL/2024/022",
    className: "Primary 1",
    parent: "Mr. Tunde Okafor",
    feeStatus: "Outstanding",
    activities: 3,
  }
];

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Students", icon: Users, active: true },
  { name: "Admissions", icon: UserPlus },
  { name: "Front Desk", icon: BellRing },
  { name: "Staff & HR", icon: Briefcase },
  { name: "Academic", icon: BookOpen },
  { name: "Finance", icon: Coins },
  { name: "School Store", icon: Store },
  { name: "Reports", icon: BarChart2 },
  { name: "Operations", icon: Settings },
  { name: "Communications", icon: MessageSquare },
  { name: "Calendar", icon: CalendarIcon },
  { name: "Inter House Points", icon: Trophy },
];

export default function ProprietorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('New Enrollment');

  const currentStudentsData = activeTab === 'Students' ? allStudents : activeTab === 'New Enrollment' ? newEnrollments : [];

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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-6 py-5 flex items-center justify-between lg:justify-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-[#1a2332] flex items-center justify-center relative overflow-hidden">
                 {/* Decorative shapes for CASPAA logo */}
                 <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-bl-full"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/40 rounded-tr-full"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1a2332]">CASPAA</span>
            </div>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5 ml-7">School Proprietor</p>
          </div>
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 mt-2">
          {sidebarLinks.map((link) => (
            <a
              key={link.name}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                link.active 
                  ? "bg-gray-100 text-[#1a2332]" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <link.icon size={16} className={link.active ? "text-[#1a2332]" : "text-gray-400"} />
              {link.name}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
            <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-[#1a2332] hidden sm:block">Students</h1>
            
            <div className="relative w-full max-w-md ml-0 sm:ml-8 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
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
                <p className="text-[13px] font-bold text-[#1a2332] leading-none">Mr. Olusegun</p>
                <p className="text-[10px] text-gray-400 mt-1">School Proprietor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1a2332]">Students</h2>
                <p className="text-[13px] text-gray-500 mt-1">Students, admissions, alumni, enrollment trends</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <TrendingUp size={14} />
                  Bulk Promote
                </button>
                <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download size={14} />
                  Student Report
                </button>
                <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Upload size={14} />
                  Bulk Upload
                </button>
                <button 
                  onClick={() => setAddStudentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-[#1a2332] hover:bg-[#243047] rounded-lg transition-colors shadow-sm"
                >
                  <Plus size={14} />
                  Add Student
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 flex overflow-x-auto hide-scrollbar">
              <nav className="flex space-x-6 px-1">
                <button 
                  onClick={() => setActiveTab('Students')}
                  className={`pb-3 text-[13px] whitespace-nowrap ${
                    activeTab === 'Students' 
                      ? "font-semibold text-[#10b981] border-b-2 border-[#10b981]" 
                      : "font-medium text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Students
                </button>
                <button 
                  onClick={() => setActiveTab('New Enrollment')}
                  className={`pb-3 text-[13px] whitespace-nowrap ${
                    activeTab === 'New Enrollment' 
                      ? "font-semibold text-[#10b981] border-b-2 border-[#10b981]" 
                      : "font-medium text-gray-500 hover:text-gray-700"
                  }`}
                >
                  New Enrollment
                </button>
                <button className="pb-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
                  Returning
                </button>
                <button className="pb-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-1.5">
                  Admissions <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">4</span>
                </button>
                <button className="pb-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
                  Suspensions
                </button>
                <button className="pb-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
                  Alumni
                </button>
                <button className="pb-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
                  Analytics
                </button>
              </nav>
            </div>

            {/* Gender Split Card */}
            {activeTab === 'Students' && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-[#1a2332]">Gender Split</h3>
                  <div className="flex items-center gap-4 text-[12px] font-medium">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-[#1a2332]"></div>
                      <span className="text-[#1a2332] font-bold">5</span> boys (50%)
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-[#1a2332] font-bold">5</span> girls (50%)
                    </div>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#1a2332] w-1/2 border-r-2 border-white"></div>
                  <div className="h-full bg-gray-400 w-1/2"></div>
                </div>
              </div>
            )}

            {activeTab === 'New Enrollment' && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-[#1a2332]">Gender Split</h3>
                  <div className="flex items-center gap-4 text-[12px] font-medium">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-[#1a2332]"></div>
                      <span className="text-[#1a2332] font-bold">1</span> boys (100%)
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-[#1a2332] font-bold">0</span> girls (0%)
                    </div>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#1a2332] w-full"></div>
                  <div className="h-full bg-gray-400 w-0"></div>
                </div>
              </div>
            )}

            {/* Table Area */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              
              {/* Filters Row */}
              <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input 
                    type="text" 
                    placeholder="Search by name or admission no..." 
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-[13px] outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center justify-between gap-8 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 min-w-[120px] hover:bg-gray-50 transition-colors">
                    <span>Class</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  <button className="flex items-center justify-between gap-8 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 min-w-[120px] hover:bg-gray-50 transition-colors">
                    <span>Status</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  <button className="flex items-center justify-between gap-8 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 min-w-[120px] hover:bg-gray-50 transition-colors">
                    <span>Gender</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">Student</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">Admission No.</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">Parent</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100">Fees</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-100 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentStudentsData.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1a2332] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                              {student.initials}
                            </div>
                            <div>
                              <p className="font-bold text-[#1a2332]">{student.name}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{student.details}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-gray-500">
                          {student.admissionNo}
                          <div className="text-[#1a2332] mt-0.5 font-medium">{student.className}</div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-gray-500">
                          {student.parent}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              student.feeStatus === "Paid" 
                                ? "bg-green-100 text-green-700" 
                                : student.feeStatus === "Partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-600"
                            }`}>
                              {student.feeStatus}
                            </span>
                            {student.activities && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e2e8f0] text-[#475569]">
                                {student.activities} {student.activities === 1 ? 'activity' : 'activities'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-gray-400 hover:text-[#1a2332]">
                              <Edit size={15} />
                            </button>
                            <button className="text-gray-400 hover:text-[#1a2332]">
                              <MoreVertical size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </main>

      <AddStudentModal isOpen={addStudentOpen} onClose={() => setAddStudentOpen(false)} />

    </div>
  );
}
