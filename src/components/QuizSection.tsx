"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Shield,
  Printer,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { playClickSound, playSuccessSound, playAlertSound } from "@/utils/sound";
import confetti from "canvas-confetti";

interface Question {
  id: number;
  courseId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ReviewDetail {
  id: number;
  question: string;
  options: string[];
  userChoice: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export default function QuizSection() {
  const { currentUser, showToast } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    reviewDetails: ReviewDetail[];
  } | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, submitted, selectedAnswers]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quiz");
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setTimerActive(true);
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
      showToast("Failed to load questions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    playClickSound();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setTimerActive(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id || "usr_emp_101",
          courseId: "comprehensive-quiz",
          answers: selectedAnswers,
        }),
      });

      const data = await res.json();
      setResult(data);
      setSubmitted(true);

      if (data.passed) {
        playSuccessSound();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(`Congratulations! You passed with ${data.percentage}%.`, "success");
      } else {
        playAlertSound();
        showToast(`Quiz completed: ${data.percentage}%. 70% required to pass.`, "warning");
      }
    } catch (err) {
      console.error("Quiz submit error:", err);
      showToast("Failed to grade quiz", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    playClickSound();
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
    setCurrentIndex(0);
    setTimeLeft(600);
    setTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Loading Cybersecurity Examination Bank...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Quiz Header Bar */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              OFFICIAL ASSESSMENT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              PASS MARK: 70%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Cybersecurity Awareness Examination
          </h2>
        </div>

        {/* Live Timer & Answered Tracker */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-mono uppercase">Answered</p>
            <p className="text-xs font-mono font-bold text-cyan-400">
              {answeredCount} / {questions.length} Questions
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-xs font-bold ${
              timeLeft < 120
                ? "bg-rose-950/60 border-rose-500/40 text-rose-400 animate-pulse"
                : "bg-slate-950/80 border-slate-700 text-cyan-300"
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {!submitted ? (
        /* Question Answering View */
        <div className="space-y-6">
          {/* Question Navigator Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    playClickSound();
                    setCurrentIndex(idx);
                  }}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center flex-shrink-0 ${
                    isCurrent
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : isAnswered
                      ? "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-950 text-slate-500 border border-slate-800 hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-mono text-cyan-400 font-semibold">
                  QUESTION {currentIndex + 1} OF {questions.length}
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Multiple Choice
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`group p-4 rounded-xl border transition cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-950/40"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 transition ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400 text-slate-950"
                            : "border-slate-700 text-slate-500 group-hover:border-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Prev / Next / Submit Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => {
                    playClickSound();
                    setCurrentIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      playClickSound();
                      setCurrentIndex((prev) => prev + 1);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Grading Answers...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Final Quiz</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Results & Pedagogical Feedback View */
        result && (
          <div className="space-y-8">
            {/* Score Summary Card */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 backdrop-blur-2xl shadow-2xl text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center border-2 ${
                  result.passed
                    ? "bg-emerald-950/80 border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    : "bg-rose-950/80 border-rose-400 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
                }`}
              >
                {result.passed ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <AlertTriangle className="w-10 h-10" />
                )}
              </div>

              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 ${
                    result.passed
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-950 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {result.passed ? "CERTIFICATION PASSED" : "ASSESSMENT FAILED (PASS MARK: 70%)"}
                </span>
                <h3 className="text-3xl font-black text-white">
                  You Scored {result.percentage}% ({result.score}/{result.totalQuestions})
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1 leading-relaxed">
                  {result.passed
                    ? "Exemplary performance! You have demonstrated strong enterprise cybersecurity awareness and threat defense capability."
                    : "Review the question breakdowns below to understand the key threat vectors before retaking your assessment."}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                {result.passed && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowCertificate(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Official Certificate</span>
                  </button>
                )}

                <button
                  onClick={handleRetakeQuiz}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Examination</span>
                </button>
              </div>
            </div>

            {/* Detailed Question Review Cards */}
            <div className="space-y-4">
              <h4 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Question By Question Review & Analysis</span>
              </h4>

              {result.reviewDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border backdrop-blur-xl ${
                    detail.isCorrect
                      ? "bg-emerald-950/10 border-emerald-500/30"
                      : "bg-rose-950/10 border-rose-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      QUESTION {idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        detail.isCorrect ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {detail.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Incorrect (0)
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white mb-3">
                    {detail.question}
                  </p>

                  {/* Options review */}
                  <div className="space-y-1.5 text-xs mb-3">
                    {detail.options.map((opt, optIdx) => {
                      const isUser = detail.userChoice === optIdx;
                      const isCorrect = detail.correctIndex === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-semibold"
                              : isUser
                              ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                              : "bg-slate-950/40 border-slate-800 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 font-bold">CORRECT ANSWER</span>}
                          {isUser && !isCorrect && <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300">YOUR CHOICE</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation box */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-400">Security Rationale:</strong> {detail.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full my-8 bg-slate-950 border-2 border-cyan-400/60 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white print:hidden"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-cyan-500/30 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Shield className="w-8 h-8" />
              </div>
              <p className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold pt-2">
                CyberGuard Enterprise Defense Systems
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Certificate of Cybersecurity Achievement
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                NIST SP 800-50 / ISO 27001 Human Firewall Compliance
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center py-8 space-y-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                This is officially conferred upon
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                {currentUser?.name || "Sarah Connor"}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                having successfully completed rigorous examination in threat detection, phishing identification, credential security, data privacy, and enterprise incident response.
              </p>
            </div>

            {/* Certificate Footer / Signature */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-left">
                <p className="font-mono text-slate-400 text-[10px]">VERIFICATION ID</p>
                <p className="font-mono text-cyan-400 font-bold">CERT-SEC-2025-8849</p>
                <p className="text-[10px] text-slate-500 mt-1">Issued: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base text-slate-300">Marcus Vance</div>
                <div className="w-24 h-px bg-slate-700 ml-auto my-1"></div>
                <p className="text-[10px] text-slate-400">Chief Information Security Officer (CISO)</p>
              </div>
            </div>

            {/* Certificate Actions */}
            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
