"use client";

import { useState, useEffect, useTransition } from "react";
import {
  X,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { getCbtExam, submitCbtExam } from "@/actions/cbt";

export default function TakeCbtModal({
  isOpen,
  onClose,
  examId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  onSuccess: () => void;
}) {
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [resultStatus, setResultStatus] = useState<string>("MARKED");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && examId) {
      setLoading(true);
      setShowResult(false);
      setAnswers({});
      setCurrentQuestionIdx(0);
      getCbtExam(examId).then((data) => {
        setExam(data);
        setLoading(false);
      });
    }
  }, [isOpen, examId]);

  if (!isOpen) return null;

  function handleSelect(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleNext() {
    if (currentQuestionIdx < exam.questions.length - 1) {
      setCurrentQuestionIdx((p) => p + 1);
    }
  }

  function handlePrev() {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((p) => p - 1);
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitCbtExam(examId, answers);
      if (result.success) {
        setFinalScore(result.score as number);
        setResultStatus(result.status as string);
        setShowResult(true);
        onSuccess();
      } else {
        setError(result.error || "An unexpected error occurred");
      }
    });
  }

  const currentQuestion = exam?.questions[currentQuestionIdx];
  const maxScore = exam?.questions.reduce(
    (sum: number, q: any) => sum + q.points,
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-[#1a2332]">
            {exam ? exam.title : "CBT Assessment"}
          </h2>
          {!showResult && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#1a2332] transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 bg-gray-50 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p className="text-[13px]">Loading exam questions...</p>
            </div>
          ) : showResult ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={64} className="text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-[#1a2332] mb-2">
                Assessment Completed!
              </h3>

              {resultStatus === "PENDING" ? (
                <>
                  <p className="text-gray-500 mb-8">
                    Your submission includes short answers and is pending manual
                    review.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl p-8 mb-8 w-full max-w-sm shadow-sm text-center">
                    <p className="font-bold text-[15px]">
                      Pending Manual Review
                    </p>
                    <p className="text-[12px] mt-2 text-amber-600">
                      Your final score will be available once your teacher
                      grades your written answers.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-500 mb-8">
                    Your answers have been auto-graded successfully.
                  </p>
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 w-full max-w-sm shadow-sm">
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Final Score
                    </p>
                    <p className="text-5xl font-black text-[#1a2332]">
                      {finalScore}{" "}
                      <span className="text-2xl text-gray-400 font-bold">
                        / {maxScore}
                      </span>
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={onClose}
                className="bg-[#1a2332] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#243047] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : exam && currentQuestion ? (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-[13px]">
                  {error}
                </div>
              )}

              {/* Progress */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[12px] font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                  Question {currentQuestionIdx + 1} of {exam.questions.length}
                </span>
                <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                  {currentQuestion.points} pts
                </span>
              </div>

              {/* Question */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 flex-1 flex flex-col">
                <p className="text-[15px] font-bold text-[#1a2332] mb-6 leading-relaxed">
                  {currentQuestion.prompt}
                </p>

                <div className="space-y-3 mt-auto">
                  {currentQuestion.type === "MCQ" ? (
                    currentQuestion.options.map((opt: string, idx: number) => {
                      const isSelected =
                        answers[currentQuestion.id] === idx.toString();
                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            handleSelect(currentQuestion.id, idx.toString())
                          }
                          className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#1a2332] bg-[#f8fafc] text-[#1a2332] font-bold shadow-sm"
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 font-medium"
                          }`}
                        >
                          <span className="inline-block w-6 h-6 text-center leading-6 rounded bg-white border border-gray-200 mr-3 text-[11px] font-bold text-gray-400">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })
                  ) : currentQuestion.type === "TRUE_FALSE" ? (
                    ["True", "False"].map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelect(currentQuestion.id, opt)}
                          className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#1a2332] bg-[#f8fafc] text-[#1a2332] font-bold shadow-sm"
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 font-medium"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })
                  ) : (
                    <textarea
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleSelect(currentQuestion.id, e.target.value)
                      }
                      className="w-full h-32 p-4 rounded-xl border-2 border-gray-100 bg-white text-[#1a2332] text-[14px] focus:border-[#1a2332] focus:outline-none transition-all resize-none"
                    />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-auto">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIdx === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13px] text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {currentQuestionIdx === exam.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isPending ||
                      Object.keys(answers).length < exam.questions.length
                    }
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] bg-[#1a2332] text-white hover:bg-[#243047] disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isPending && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] bg-white border border-gray-200 text-[#1a2332] hover:bg-gray-50 transition-all shadow-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
