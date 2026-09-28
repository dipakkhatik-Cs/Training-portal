"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Fish,
  GraduationCap,
  Sparkles,
  BarChart3,
  Calendar,
  Lock,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { playClickSound } from "@/utils/sound";

export default function EmployeeDashboard() {
  const { currentUser, setActiveTab } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses?userId=${currentUser?.id || "usr_emp_101"}`);
      const data = await res.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = courses.filter((c) => c.completed).length;
  const totalCount = courses.length || 10;
  const pendingCount = totalCount - completedCount;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome & Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-cyan-950/40 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white text-2xl font-black">
                  {currentUser?.name.charAt(0) || "E"}
                </div>
              </div>
              <div
                title="Security Status: Low Risk"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white text-[10px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {greeting}, {currentUser?.name || "Employee"}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
                  {currentUser?.role.toUpperCase() || "EMPLOYEE"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {currentUser?.department || "Operations"} • Employee ID:{" "}
                <span className="font-mono text-slate-300 font-semibold">{currentUser?.employeeId || "EMP-1042"}</span>
              </p>
              <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  {currentUser?.streakDays || 6}-Day Active Learning Streak
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Security Tier: Sentinel Level 3
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("courses");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Resume Training</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("phishing");
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 font-semibold text-xs transition"
            >
              <Fish className="w-4 h-4 text-cyan-400" />
              <span>Spot Phish Drill</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("incidents");
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-500/30 font-semibold text-xs transition"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Report Threat</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dashboard Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Training Progress */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-xl hover:border-cyan-500/40 transition shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Training Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {overallProgress}%
            </span>
            <span className="text-xs text-slate-400">of curriculum</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-[11px] text-cyan-400">
            {completedCount} of {totalCount} modules certified
          </p>
        </div>

        {/* Card 2: Security Score */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-xl hover:border-emerald-500/40 transition shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Security Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {currentUser?.securityScore || 88}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Low Risk • Compliant</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Top 15% of company defense</p>
        </div>

        {/* Card 3: Courses Completed */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-xl hover:border-purple-500/40 transition shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Completed Modules
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {completedCount}
            </span>
            <span className="text-xs text-slate-400">completed</span>
          </div>
          <p className="mt-2 text-xs text-purple-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} remaining modules</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">Avg completion time: 22m</p>
        </div>

        {/* Card 4: Quiz Mastery Score */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-xl hover:border-amber-500/40 transition shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Quiz Score Average
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              92%
            </span>
            <span className="text-xs text-slate-400">Passing &gt;= 70%</span>
          </div>
          <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Certified Human Firewall</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">10 of 10 questions mastered</p>
        </div>
      </div>

      {/* Two-Column Middle Section: Awareness Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Awareness Vectors Breakdown Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Cybersecurity Competency By Attack Vector</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated through interactive scenario drills & quarterly quizzes
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
              BENCHMARK PASSED
            </span>
          </div>

          {/* Competency Bars */}
          <div className="space-y-4">
            {[
              { label: "Phishing & Social Engineering", score: 98, color: "from-cyan-500 to-blue-500" },
              { label: "Password Security & Entropy", score: 100, color: "from-emerald-500 to-teal-500" },
              { label: "Endpoint & Ransomware Isolation", score: 85, color: "from-blue-500 to-indigo-500" },
              { label: "Data Privacy & PII Handling", score: 90, color: "from-purple-500 to-violet-500" },
              { label: "Public Wi-Fi & Remote Defense", score: 80, color: "from-amber-500 to-orange-500" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono text-cyan-400 font-bold">{item.score}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Alert Callout */}
          <div className="mt-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-cyan-400">Weekly Security Challenge:</span> Complete the Remote Work Security lesson to boost your Wi-Fi defense score to 95%.
            </div>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("courses");
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold whitespace-nowrap flex items-center gap-1"
            >
              Start <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Recent Security Activity</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">LIVE FEED</span>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  icon: CheckCircle2,
                  color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/30",
                  title: "Completed: Password Security & MFA",
                  time: "Today, 10:45 AM",
                  desc: "Scored 100% on passphrase entropy challenge",
                },
                {
                  icon: Fish,
                  color: "text-cyan-400 bg-cyan-950/50 border-cyan-500/30",
                  title: "Phishing Simulation Detected",
                  time: "Yesterday, 3:12 PM",
                  desc: "Correctly flagged spoofed M365 password reset email",
                },
                {
                  icon: AlertTriangle,
                  color: "text-amber-400 bg-amber-950/50 border-amber-500/30",
                  title: "Incident INC-2025-8492 Logged",
                  time: "2 days ago",
                  desc: "Forwarded suspicious wire transfer email to SOC",
                },
                {
                  icon: Award,
                  color: "text-purple-400 bg-purple-950/50 border-purple-500/30",
                  title: "Earned Badge: Phishing Defender",
                  time: "3 days ago",
                  desc: "Recognized 5 consecutive simulated attack vectors",
                },
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-200 truncate">{act.title}</p>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab("achievements");
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <span>View All Badges & Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Enrolled Courses Quick Tracker */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Your Training Modules</h3>
            <p className="text-xs text-slate-400">Continue where you left off</p>
          </div>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("courses");
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            View All 10 Courses <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course.id}
              onClick={() => {
                playClickSound();
                setActiveTab("courses");
              }}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                  {course.category}
                </span>
                {course.completed ? (
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-400">
                    In Progress
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                {course.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500">{course.duration}</span>
                <span className="text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                  {course.completed ? "Review Course" : "Continue"} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
