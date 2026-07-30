"use client";

import { useState } from "react";
import { CheckCircle, Clock, FileText, Search, X, Link as LinkIcon, Save } from "lucide-react";

interface Submission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  content: string;
  fileUrl: string | null;
  status: "Ungraded" | "Graded";
  submittedAt: string;
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    studentName: "Tobi Okafor",
    assignmentTitle: "Essay: My Future Career",
    content: "I want to be a software engineer because I love building things that people use. Technology is the future and I want to be a part of it. I have started learning HTML and CSS.",
    fileUrl: "https://example.com/essay.pdf",
    status: "Ungraded",
    submittedAt: "2 hours ago",
  },
  {
    id: "2",
    studentName: "Chiamaka Nwosu",
    assignmentTitle: "Algebra Practice - Set 3",
    content: "Attached are my working steps for the algebra assignment.",
    fileUrl: "https://example.com/algebra.pdf",
    status: "Graded",
    submittedAt: "1 day ago",
  },
  {
    id: "3",
    studentName: "David Mensah",
    assignmentTitle: "Essay: My Future Career",
    content: "My dream is to become a doctor so I can help people in my community.",
    fileUrl: null,
    status: "Ungraded",
    submittedAt: "2 days ago",
  }
];

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission) {
      setSubmissions(prev => 
        prev.map(sub => sub.id === selectedSubmission.id ? { ...sub, status: "Graded" } : sub)
      );
    }
    setSelectedSubmission(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Grading Dashboard</h1>
            <p className="text-sm text-gray-500">Review and grade recent student submissions.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search submissions..." 
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-[#1a2332] focus:ring-1 focus:ring-[#1a2332]"
            />
          </div>
        </header>

        {/* Submissions List/Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Assignment</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {sub.studentName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {sub.assignmentTitle}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {sub.submittedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        sub.status === "Ungraded" 
                          ? "bg-amber-50 text-amber-700 border border-amber-200" 
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}>
                        {sub.status === "Ungraded" ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#f1f5f9] px-3 py-1.5 text-sm font-medium text-[#1a2332] hover:bg-[#e2e8f0] transition-colors"
                      >
                        <FileText size={14} />
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-2xl flex-col rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Grade Submission</h2>
                <p className="text-sm text-gray-500">{selectedSubmission.studentName} &middot; {selectedSubmission.assignmentTitle}</p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* Student Content */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Student's Answer</h3>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed min-h-[100px]">
                  {selectedSubmission.content || <span className="italic text-gray-400">No text provided.</span>}
                </div>
              </div>

              {/* Attachment */}
              {selectedSubmission.fileUrl && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">Attachment</h3>
                  <a 
                    href={selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1a2332] transition-all shadow-sm"
                  >
                    <LinkIcon size={16} />
                    View Attached File
                  </a>
                </div>
              )}

              <hr className="border-gray-100" />

              {/* Grading Form */}
              <form id="grading-form" onSubmit={handleGradeSubmit} className="space-y-5">
                <div>
                  <label htmlFor="score" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Score (out of 100)
                  </label>
                  <input
                    type="number"
                    id="score"
                    min="0"
                    max="100"
                    required
                    className="w-full sm:w-32 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#1a2332] focus:ring-1 focus:ring-[#1a2332] transition-all"
                    placeholder="e.g. 85"
                  />
                </div>
                
                <div>
                  <label htmlFor="feedback" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    rows={4}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1a2332] focus:ring-1 focus:ring-[#1a2332] transition-all resize-none"
                    placeholder="Provide constructive feedback here..."
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="grading-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a2332] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#243047] active:bg-[#111b2a] transition-colors shadow-sm"
              >
                <Save size={16} />
                Save Grade
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
