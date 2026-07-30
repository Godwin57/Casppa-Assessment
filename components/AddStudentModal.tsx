"use client";

import React, { useState } from "react";
import {
  X,
  Image as ImageIcon,
  Upload,
  Calendar as CalendarIcon,
  ChevronDown,
  LayoutList,
  Paperclip,
  Check,
} from "lucide-react";

interface Activity {
  id: string;
  emoji: string;
  title: string;
  description: string;
  price: string;
}

const extracurriculars: Activity[] = [
  {
    id: "swimming",
    emoji: "🏊",
    title: "Swimming",
    description: "Twice-weekly pool sessions with certified instructor",
    price: "₦25,000/term",
  },
  {
    id: "ballet",
    emoji: "🩰",
    title: "Ballet / Dance",
    description: "Classical ballet and contemporary dance classes",
    price: "₦20,000/term",
  },
  {
    id: "music",
    emoji: "🎹",
    title: "Music (Keyboard)",
    description: "Keyboard lessons — beginner to intermediate",
    price: "₦18,000/term",
  },
  {
    id: "football",
    emoji: "⚽",
    title: "Football (Academy)",
    description: "Structured football coaching for junior and senior players",
    price: "₦12,000/term",
  },
  {
    id: "chess",
    emoji: "♟️",
    title: "Chess Club",
    description: "Competitive chess training",
    price: "₦8,000/term",
  },
  {
    id: "debate",
    emoji: "🎤",
    title: "Debate Club",
    description: "Public speaking and debating skills",
    price: "₦5,000/term",
  },
];

const documentTypes = [
  "Birth Certificate",
  "Parent ID (NIN / Driver's License)",
  "Passport Photograph",
  "Immunization Card",
];

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-[#1a2332]">Add New Student</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-1.5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          
          {/* Photo Upload */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#1a2332] flex items-center justify-center shrink-0">
              <ImageIcon size={24} className="text-white/70" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1a2332]">Student Photo</p>
              <p className="text-[11px] text-gray-500 mb-2">JPG / PNG, max 1MB</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 transition-colors">
                <Upload size={13} />
                Choose photo
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
            {/* Full Name */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Chiamaka Okafor"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
              />
            </div>

            {/* Admission Number */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Admission Number *</label>
              <input
                type="text"
                placeholder="BL/2024/020"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
              />
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Date of Birth *</label>
              <div className="relative">
                <CalendarIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-[13px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Gender *</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Class *</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="primary1">Primary 1</option>
                  <option value="primary2">Primary 2</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Arm */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Arm</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="a">A</option>
                  <option value="b">B</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Session */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Session</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="23-24">2023/2024</option>
                  <option value="24-25">2024/2025</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Blood Group</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="o+">O+</option>
                  <option value="a+">A+</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* House */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">House</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="red">Red House</option>
                  <option value="blue">Blue House</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Allergies / Medical Notes */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Allergies / Medical Notes</label>
              <input
                type="text"
                placeholder="e.g. Peanut allergy, asthma — or 'None'"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
              />
            </div>

            {/* Fee Category */}
            <div>
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Fee Category</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="standard">Standard</option>
                  <option value="scholarship">Scholarship</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Empty space for grid alignment if needed, but Parent is full width in design */}
            <div className="hidden md:block"></div>

            {/* Parent / Guardian (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Parent / Guardian *</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="parent1">Mr. Tunde Okafor</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Admission Type (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-[12px] font-bold text-[#1a2332] mb-1.5">Admission Type</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a2332] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1a2332] bg-white">
                  <option value="" disabled selected></option>
                  <option value="new">New Student</option>
                  <option value="transfer">Transfer</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Extracurricular Activities */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <LayoutList size={16} className="text-gray-500" />
              <h3 className="text-[13px] font-bold text-[#1a2332]">Extracurricular Activities</h3>
            </div>
            <p className="text-[12px] text-gray-500 mb-4">
              Select any activities for this student. The fee will be added as a line item on their invoice automatically.
            </p>
            
            <div className="space-y-2.5">
              {extracurriculars.map((activity) => {
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <div 
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? "border-[#1a2332] bg-white shadow-sm ring-1 ring-[#1a2332]" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg w-8 flex justify-center">{activity.emoji}</div>
                      <div>
                        <p className="text-[13px] font-bold text-[#1a2332] leading-none mb-1">{activity.title}</p>
                        <p className="text-[11px] text-gray-500 leading-none">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-[13px] font-bold text-[#1a2332] ml-4 shrink-0">
                      {activity.price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload Documents */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Paperclip size={16} className="text-gray-500" />
              <h3 className="text-[13px] font-bold text-[#1a2332]">Upload Documents</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map((docType) => (
                <div key={docType} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-[12px] font-bold text-[#1a2332] truncate">{docType}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-gray-400">No file</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 transition-colors">
                      <Upload size={12} />
                      Choose
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-[#1a2332] hover:bg-[#243047] rounded-lg transition-colors shadow-sm"
          >
            <Check size={16} />
            Save Student
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Demo wrapper ────────────────────────────────────────────────────────────

export function AddStudentModalDemo() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#1a2332] text-white rounded-lg font-semibold"
      >
        Open Add Student Modal
      </button>
      <AddStudentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
