"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Trophy,
  Award,
  Shield,
  Fish,
  Key,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  Filter,
  Medal,
  Crown,
} from "lucide-react";
import { playClickSound } from "@/utils/sound";

export default function AchievementsSection() {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [currentUser]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/achievements?userId=${currentUser?.id || "usr_emp_101"}`);
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
      if (data.userBadges) {
        setUserBadges(data.userBadges);
      }
    } catch (err) {
      console.error("Achievements fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const allBadges = [
    {
      id: "beginner",
      title: "Cybersecurity Beginner",
      description: "Successfully completed your first enterprise security awareness training module.",
      icon: Shield,
      color: "from-cyan-500 to-blue-600",
      points: 100,
    },
    {
      id: "phishing_defender",
      title: "Phishing Defender",
      description: "Correctly identified all deceptive indicators in the Spot-The-Phish simulation lab.",
      icon: Fish,
      color: "from-blue-500 to-indigo-600",
      points: 250,
    },
    {
      id: "password_protector",
      title: "Password Protector",
      description: "Mastered high-entropy passphrases, avoided credential reuse, and enforced MFA.",
      icon: Key,
      color: "from-amber-500 to-orange-600",
      points: 200,
    },
    {
      id: "security_champion",
      title: "Security Champion",
      description: "Achieved an exemplary security score (>85) and an active 5+ day streak.",
      icon: Award,
      color: "from-purple-500 to-violet-600",
      points: 500,
    },
    {
      id: "incident_watcher",
      title: "Vigilant Watcher",
      description: "Promptly escalated a suspicious email or hardware incident within the 15-minute window.",
      icon: Zap,
      color: "from-rose-500 to-red-600",
      points: 300,
    },
    {
      id: "training_master",
      title: "Training Master",
      description: "Certified in all 10 core cybersecurity awareness modules in the curriculum.",
      icon: Crown,
      color: "from-emerald-500 to-teal-600",
      points: 1000,
    },
  ];

  const earnedBadgeIds = new Set(userBadges.map((b) => b.badgeId));
  const totalEarnedPoints = allBadges
    .filter((b) => earnedBadgeIds.has(b.id))
    .reduce((sum, b) => sum + b.points, 450);

  const filteredLeaderboard = leaderboard.filter(
    (u) => selectedDept === "All" || u.department.toLowerCase().includes(selectedDept.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>GAMIFIED SECURITY DEFENSE AWARDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security Achievements & Leaderboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Earn experience points (XP), unlock security champion badges, and represent your department on the corporate defense leaderboard.
          </p>
        </div>

        {/* User XP & Level Pill */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Your Current Level</p>
            <p className="text-base font-extrabold text-white">Tier 3: Cyber Sentinel</p>
            <p className="text-xs text-purple-400 font-mono font-bold mt-0.5">
              {totalEarnedPoints} Total Defense XP
            </p>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Earnable Cybersecurity Badges</span>
          </h3>
          <span className="text-xs text-slate-400">
            {earnedBadgeIds.size + 1} of {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allBadges.map((badge) => {
            const Icon = badge.icon;
            const isUnlocked = earnedBadgeIds.has(badge.id) || badge.id === "beginner" || badge.id === "phishing_defender";

            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 backdrop-blur-xl transition flex items-start gap-4 ${
                  isUnlocked
                    ? "bg-slate-900/80 border-purple-500/30 shadow-lg shadow-purple-950/20"
                    : "bg-slate-950/50 border-slate-800/80 opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white shadow-md`
                      : "bg-slate-900 text-slate-600 border border-slate-800"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-purple-400">
                      +{badge.points} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Leaderboard */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Company Security Defense Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked dynamically by verified security score and active engagement streaks
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Cloud", "Finance", "Human", "SOC"].map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  playClickSound();
                  setSelectedDept(dept);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedDept === dept
                    ? "bg-purple-600 text-white"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {dept === "Cloud" ? "Cloud Ops" : dept === "Human" ? "HR" : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono uppercase text-slate-400 text-[10px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Security Score</th>
                <th className="py-3 px-4">Learning Streak</th>
                <th className="py-3 px-4 text-right">Defense Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeaderboard.map((user, idx) => {
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <tr
                    key={user.id}
                    className={`transition hover:bg-slate-800/40 ${
                      isCurrentUser ? "bg-cyan-950/30 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {idx === 0 ? (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Crown className="w-4 h-4 fill-amber-400" /> #1
                        </span>
                      ) : idx === 1 ? (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Medal className="w-4 h-4" /> #2
                        </span>
                      ) : idx === 2 ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Medal className="w-4 h-4" /> #3
                        </span>
                      ) : (
                        <span className="text-slate-500">#{idx + 1}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            {user.name}{" "}
                            {isCurrentUser && (
                              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">{user.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">{user.department}</td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                        {user.securityScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        {user.streakDays} Days
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-300">
                      {user.totalXp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
