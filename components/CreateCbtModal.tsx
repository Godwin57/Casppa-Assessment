"use client";

import { useState, useTransition } from "react";
import { X, ChevronDown, Calendar, Plus, Loader2, Trash2 } from "lucide-react";
import { createCbtExam } from "@/actions/cbt";
import { QuestionType } from "@prisma/client";

export interface CreateCbtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASS_OPTIONS = [
  "JSS 1", "JSS 2", "JSS 3", "Primary 3", "Primary 4", "Primary 5", "SS 1", "SS 2", "SS 3"
];
const SUBJECT_OPTIONS = [
  "Mathematics", "English Language", "Basic Science", "Social Studies", "Yoruba", "French", "Civic Education", "Agricultural Science"
];

interface CbtQuestionDraft {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export default function CreateCbtModal({ isOpen, onClose }: CreateCbtModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState(30);

  const [questions, setQuestions] = useState<CbtQuestionDraft[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  function addQuestion(type: QuestionType) {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        type,
        prompt: "",
        options: type === "MCQ" ? ["", "", "", ""] : type === "TRUE_FALSE" ? ["True", "False"] : [],
        correctAnswer: type === "MCQ" ? "0" : type === "TRUE_FALSE" ? "True" : "",
        points: 1
      }
    ]);
  }

  function updateQuestion(id: string, field: keyof CbtQuestionDraft, value: any) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  }

  function updateOption(qId: string, optIndex: number, value: string) {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  }

  function removeQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (questions.length === 0) {
      setError("Please add at least one question.");
      return;
    }

    startTransition(async () => {
      const result = await createCbtExam({
        title,
        description,
        classId: selectedClass,
        subjectId: selectedSubject,
        dueDate,
        duration,
        questions
      });

      if (result.success) {
        onClose();
        // reset form
        setTitle(""); setDescription(""); setSelectedClass(""); setSelectedSubject("");
        setDueDate(""); setDuration(30); setQuestions([]);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[700px] h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-[#1a2332]">Create CBT Exam</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#1a2332] transition-colors">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          <form id="create-cbt-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Exam Details */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-[#1a2332]">Exam Details</h3>
              
              <div>
                <label className="block text-[12px] font-semibold text-[#1a2332] mb-1.5">Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mid-Term Math Assessment" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1a2332] mb-1.5">Class</label>
                  <select required value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2332]">
                    <option value="" disabled>Select Class...</option>
                    {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1a2332] mb-1.5">Subject</label>
                  <select required value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2332]">
                    <option value="" disabled>Select Subject...</option>
                    {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1a2332] mb-1.5">Due Date</label>
                  <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1a2332] mb-1.5">Duration (minutes)</label>
                  <input required type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1a2332] mb-1.5">Description (Optional)</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[12px] text-[#1a2332] resize-none focus:outline-none focus:ring-1 focus:ring-[#1a2332]" />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Questions Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-[#1a2332]">Questions Builder</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => addQuestion("MCQ")} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    <Plus size={14} /> Add MCQ
                  </button>
                  <button type="button" onClick={() => addQuestion("TRUE_FALSE")} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                    <Plus size={14} /> Add T/F
                  </button>
                  <button type="button" onClick={() => addQuestion("SHORT_ANSWER")} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Plus size={14} /> Add Short Answer
                  </button>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-gray-200 border-dashed rounded-xl">
                  <p className="text-[12px] text-gray-500">No questions added yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3 gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-[#1a2332] text-white px-2 py-0.5 rounded">Q{qIndex + 1}</span>
                          <span className="text-[11px] font-semibold text-gray-500">{q.type === "MCQ" ? "Multiple Choice" : q.type === "TRUE_FALSE" ? "True / False" : "Short Answer"}</span>
                        </div>
                        <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <textarea
                          placeholder="Type your question here..."
                          required
                          value={q.prompt}
                          onChange={e => updateQuestion(q.id, "prompt", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-[#1a2332] resize-none focus:outline-none focus:ring-1 focus:ring-[#1a2332]"
                          rows={2}
                        />

                        {q.type === "MCQ" && (
                          <div className="space-y-2">
                            {q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input 
                                  type="radio" 
                                  name={`correct-${q.id}`} 
                                  checked={q.correctAnswer === oIndex.toString()}
                                  onChange={() => updateQuestion(q.id, "correctAnswer", oIndex.toString())}
                                  className="w-4 h-4 accent-[#1a2332]" 
                                />
                                <input 
                                  required
                                  type="text" 
                                  placeholder={`Option ${oIndex + 1}`} 
                                  value={opt} 
                                  onChange={e => updateOption(q.id, oIndex, e.target.value)}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] text-[#1a2332] focus:outline-none focus:ring-1 focus:ring-[#1a2332]" 
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === "TRUE_FALSE" && (
                          <div className="flex items-center gap-4 pt-2">
                            <label className="flex items-center gap-2 text-[12px] font-medium text-[#1a2332]">
                              <input type="radio" name={`correct-${q.id}`} checked={q.correctAnswer === "True"} onChange={() => updateQuestion(q.id, "correctAnswer", "True")} className="w-4 h-4 accent-[#1a2332]" />
                              True
                            </label>
                            <label className="flex items-center gap-2 text-[12px] font-medium text-[#1a2332]">
                              <input type="radio" name={`correct-${q.id}`} checked={q.correctAnswer === "False"} onChange={() => updateQuestion(q.id, "correctAnswer", "False")} className="w-4 h-4 accent-[#1a2332]" />
                              False
                            </label>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                          <label className="text-[11px] font-medium text-gray-500">Points</label>
                          <input type="number" min={1} required value={q.points} onChange={e => updateQuestion(q.id, "points", Number(e.target.value))} className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-[#1a2332] text-center focus:outline-none focus:ring-1 focus:ring-[#1a2332]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-white">
          <button type="button" onClick={onClose} disabled={isPending} className="text-[12px] font-semibold text-gray-500 hover:text-[#1a2332] px-2 py-2">
            Cancel
          </button>
          <button type="submit" form="create-cbt-form" disabled={isPending} className="flex items-center gap-1.5 bg-[#1a2332] text-white text-[12px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#243047] disabled:opacity-70 transition-colors">
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {isPending ? "Creating..." : "Create CBT Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}
