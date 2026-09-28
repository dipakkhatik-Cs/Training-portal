"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Key,
  Fish,
  Bug,
  Mail,
  Database,
  Laptop,
  Share2,
  AlertTriangle,
  Wifi,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  X,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/utils/sound";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Key,
  Fish,
  Bug,
  Mail,
  Database,
  Laptop,
  Share2,
  AlertTriangle,
  Wifi,
};

export default function CoursesCatalog() {
  const { currentUser, setActiveTab, showToast } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Selected course for detail modal
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

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
      console.error("Courses fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCourse = async (courseId: string) => {
    playClickSound();
    setActiveCourseId(courseId);
    setLoadingDetail(true);
    setActiveLessonIndex(0);
    try {
      const res = await fetch(`/api/courses/${courseId}?userId=${currentUser?.id || "usr_emp_101"}`);
      const data = await res.json();
      setCourseDetail(data);
    } catch (err) {
      console.error("Failed to load course detail:", err);
      showToast("Failed to load course content", "error");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleMarkLessonComplete = async () => {
    if (!courseDetail || !activeCourseId) return;
    playSuccessSound();
    const currentPercent = courseDetail.progress?.progressPercent || 0;
    const newPercent = Math.min(100, currentPercent + 35);
    const isCompleted = newPercent >= 100;

    try {
      await fetch(`/api/courses/${activeCourseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id || "usr_emp_101",
          progressPercent: newPercent,
          completed: isCompleted,
        }),
      });

      setCourseDetail((prev: any) => ({
        ...prev,
        progress: {
          ...prev.progress,
          progressPercent: newPercent,
          completed: isCompleted,
        },
      }));

      // Update in main list as well
      setCourses((prev) =>
        prev.map((c) =>
          c.id === activeCourseId ? { ...c, progressPercent: newPercent, completed: isCompleted } : c
        )
      );

      showToast(
        isCompleted
          ? "🎉 Course completed! You can now take the certification quiz."
          : `Progress saved: ${newPercent}% complete.`,
        "success"
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiff =
      selectedDifficulty === "All" || course.difficulty === selectedDifficulty;

    const matchesCat =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesDiff && matchesCat;
  });

  const categories = [
    "All",
    "Core Defense",
    "Identity & Access",
    "Threat Awareness",
    "Endpoint Protection",
    "Communication",
    "Compliance & Governance",
    "Hardware & Mobile",
    "Digital Footprint",
    "Crisis Management",
    "Distributed Teams",
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>NIST SP 800-50 CURRICULUM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Cybersecurity Training Catalog
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ten essential modules engineered to educate enterprise personnel against contemporary threat vectors, phishing scams, credential harvesting, and regulatory non-compliance.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, e.g. Phishing, Password, Ransomware, Wi-Fi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 focus:border-cyan-400 text-white text-xs sm:text-sm placeholder:text-slate-500 outline-none transition"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const IconComponent = ICON_MAP[course.iconName] || Shield;
          const isDone = course.completed;
          const percent = course.progressPercent || 0;

          return (
            <div
              key={course.id}
              className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 hover:-translate-y-1"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-cyan-400 font-semibold">
                    {course.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      course.difficulty === "Beginner"
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                        : course.difficulty === "Intermediate"
                        ? "bg-blue-950/60 text-blue-300 border border-blue-500/30"
                        : "bg-purple-950/60 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {course.difficulty}
                  </span>
                </div>

                {/* Course Icon & Title */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-950 to-blue-950 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 group-hover:scale-105 transition">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.lessonsCount} Lessons
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {course.description}
                </p>
              </div>

              {/* Progress & Action Bottom */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-mono text-cyan-400 font-bold">{percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => handleOpenCourse(course.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    isDone
                      ? "bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30"
                      : percent > 0
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "bg-slate-800 hover:bg-cyan-950/50 hover:border-cyan-500/40 text-slate-200 border border-slate-700"
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Review Course & Quiz</span>
                    </>
                  ) : percent > 0 ? (
                    <>
                      <span>Continue Lesson</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Start Module</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No courses match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try searching with a different keyword or resetting filters.</p>
        </div>
      )}

      {/* Course Detail & Lesson Reader Modal */}
      {activeCourseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-4xl w-full my-8 bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveCourseId(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingDetail ? (
              <div className="py-20 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <span>Loading interactive lesson syllabus...</span>
              </div>
            ) : courseDetail ? (
              <div className="space-y-6">
                {/* Course Header */}
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {courseDetail.course.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {courseDetail.course.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {courseDetail.course.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {courseDetail.course.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {courseDetail.course.description}
                  </p>

                  {/* Progress bar in header */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{
                          width: `${courseDetail.progress?.progressPercent || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold whitespace-nowrap">
                      {courseDetail.progress?.progressPercent || 0}% Done
                    </span>
                  </div>
                </div>

                {/* Lesson Navigation Tabs */}
                {courseDetail.lessons && courseDetail.lessons.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
                      {courseDetail.lessons.map((lesson: any, idx: number) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            playClickSound();
                            setActiveLessonIndex(idx);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                            activeLessonIndex === idx
                              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                          }`}
                        >
                          <span>Lesson {lesson.orderIndex}</span>
                          <span className="text-[11px] opacity-80 hidden sm:inline truncate max-w-[140px]">
                            {lesson.title}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active Lesson Content */}
                    {courseDetail.lessons[activeLessonIndex] && (
                      <div className="mt-6 space-y-6">
                        <div>
                          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                            Lesson {courseDetail.lessons[activeLessonIndex].orderIndex} of {courseDetail.lessons.length}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-1">
                            {courseDetail.lessons[activeLessonIndex].title}
                          </h3>
                        </div>

                        {/* Summary Card */}
                        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
                          <strong>Executive Summary:</strong> {courseDetail.lessons[activeLessonIndex].summary}
                        </div>

                        {/* Rich Content Text */}
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                          {courseDetail.lessons[activeLessonIndex].content}
                        </div>

                        {/* Pro Security Tips Card */}
                        <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5 space-y-3">
                          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                            <Shield className="w-4 h-4 text-amber-400" />
                            CRITICAL ACTIONABLE SECURITY TIPS
                          </h4>
                          <ul className="text-xs text-slate-300 space-y-2">
                            {(() => {
                              try {
                                const tips = JSON.parse(courseDetail.lessons[activeLessonIndex].tips);
                                return tips.map((tip: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span>{tip}</span>
                                  </li>
                                ));
                              } catch {
                                return <li>Verify suspicious links and lock your workstation.</li>;
                              }
                            })()}
                          </ul>
                        </div>

                        {/* Key Takeaways */}
                        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-3">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                            <Sparkles className="w-4 h-4" />
                            CORE TAKEAWAYS FOR DEFENSE
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                            {(() => {
                              try {
                                const takes = JSON.parse(courseDetail.lessons[activeLessonIndex].keyTakeaways);
                                return takes.map((take: string, idx: number) => (
                                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <span>{take}</span>
                                  </div>
                                ));
                              } catch {
                                return <div>Always verify before clicking unknown attachments.</div>;
                              }
                            })()}
                          </div>
                        </div>

                        {/* Lesson Navigation Controls */}
                        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <button
                            disabled={activeLessonIndex === 0}
                            onClick={() => {
                              playClickSound();
                              setActiveLessonIndex((prev) => Math.max(0, prev - 1));
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous Lesson</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleMarkLessonComplete}
                              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                              <span>Mark Lesson Understood</span>
                            </button>

                            {activeLessonIndex < courseDetail.lessons.length - 1 ? (
                              <button
                                onClick={() => {
                                  playClickSound();
                                  setActiveLessonIndex((prev) => prev + 1);
                                }}
                                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                              >
                                <span>Next Lesson</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  playSuccessSound();
                                  setActiveCourseId(null);
                                  setActiveTab("courses");
                                  // Open quiz
                                  showToast("Module lessons finished! Redirecting to Quiz...", "success");
                                }}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                              >
                                <Award className="w-4 h-4" />
                                <span>Take Certification Quiz</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Curriculum materials ready for practical assessment.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
