"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldAlert,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Fish,
  CheckCircle2,
  Clock,
  RotateCcw,
  BarChart2,
  Search,
  BookOpen,
  Send,
  Eye,
  Edit3,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/utils/sound";

export default function AdminDashboard() {
  const { currentUser, showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [incidentFilter, setIncidentFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Admin fetch error:", err);
      showToast("Failed to load admin metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIncidentStatus = async (id: number, newStatus: string) => {
    playClickSound();
    setUpdatingId(id);
    try {
      const res = await fetch("/api/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        playSuccessSound();
        showToast(`Incident #${id} status updated to ${newStatus}.`, "success");
        // Update local state
        setData((prev: any) => ({
          ...prev,
          recentIncidents: prev.recentIncidents.map((inc: any) =>
            inc.id === id ? { ...inc, status: newStatus } : inc
          ),
        }));
      }
    } catch (err) {
      console.error("Update incident error:", err);
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendPhishingDrill = (empName: string) => {
    playClickSound();
    showToast(`Simulated phishing drill dispatched to ${empName}.`, "info");
  };

  const handleAssignRefresher = (empName: string) => {
    playClickSound();
    showToast(`Mandatory refresher course assigned to ${empName}.`, "warning");
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Loading Security Operations Center Telemetry...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalEmployees: 148,
    completionRate: 81.4,
    avgSecurityScore: 88,
    openIncidents: 2,
    phishingCatchRate: 96.2,
  };

  const incidents = data?.recentIncidents || [];
  const employees = data?.employees || [];
  const departmentStats = data?.departmentStats || [];
  const coursesList = data?.courses || [];

  const filteredIncidents = incidents.filter(
    (i: any) => incidentFilter === "All" || i.status.toLowerCase() === incidentFilter.toLowerCase()
  );

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Admin SOC Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CHIEF INFORMATION SECURITY OFFICER (CISO) CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security Operations & Training Oversight
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Real-time telemetry of organization-wide human firewall training, phishing simulation drills, and incident response queues.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300">
            SOC Level: Tier 1 Active
          </span>
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Metrics"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Enterprise Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">Total Personnel</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{metrics.totalEmployees}</p>
          <p className="text-[11px] text-cyan-400 mt-1">100% Onboarded</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{metrics.completionRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">+4.2% this month</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">Avg Security Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{metrics.avgSecurityScore}/100</p>
          <p className="text-[11px] text-emerald-400 mt-1">Low Risk Threshold</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">Phish Catch Rate</span>
            <Fish className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">{metrics.phishingCatchRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Simulated Drills</p>
        </div>

        {/* Metric 5 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{metrics.openIncidents}</p>
          <p className="text-[11px] text-slate-400 mt-1">Under Investigation</p>
        </div>
      </div>

      {/* Two-Column Middle Section: Department Competency + Incident Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Completion Chart */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Training Completion By Department</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">ORGANIZATION METRICS</span>
          </div>

          <div className="space-y-4 pt-2">
            {departmentStats.map((dept: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{dept.name}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-400">{dept.userCount} personnel</span>
                    <span className="text-cyan-400 font-bold">{dept.completionRate}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    style={{ width: `${dept.completionRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security Posture Summary Card */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>NIST & ISO 27001 Compliance</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/20">
                AUDIT READY
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Annual Awareness Compliance</span>
                <span className="font-mono text-emerald-400 font-bold">94.8% Pass</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Phishing Resilience Index</span>
                <span className="font-mono text-cyan-400 font-bold">Grade A (Optimal)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Incident Escalation Median Time</span>
                <span className="font-mono text-purple-300 font-bold">8.4 Minutes</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">MFA Policy Adherence</span>
                <span className="font-mono text-emerald-400 font-bold">100% Enforced</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300 font-mono">
            Next Scheduled Red Team Phishing Drill: Tomorrow at 09:00 AM UTC
          </div>
        </div>
      </div>

      {/* Incident Triage Console Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Incident Response Management Console</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Triage and modify status of reported security threats directly in PostgreSQL
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Reported", "Investigating", "Mitigated", "Resolved"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  playClickSound();
                  setIncidentFilter(st);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  incidentFilter === st
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono uppercase text-slate-400 text-[10px]">
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Incident Type</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Update Triage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.map((inc: any) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    {inc.referenceNo}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{inc.employeeName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{inc.employeeId}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {inc.incidentType}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        inc.urgency === "Critical"
                          ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                          : inc.urgency === "High"
                          ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                          : "bg-blue-950 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {inc.urgency}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-slate-400 truncate">
                    {inc.description}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        inc.status === "Reported"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                          : inc.status === "Investigating"
                          ? "bg-blue-950 text-blue-300 border border-blue-500/30"
                          : inc.status === "Mitigated"
                          ? "bg-purple-950 text-purple-300 border border-purple-500/30"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {inc.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={inc.status}
                      disabled={updatingId === inc.id}
                      onChange={(e) => handleUpdateIncidentStatus(inc.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none focus:border-cyan-400 cursor-pointer disabled:opacity-50"
                    >
                      <option value="Reported">Reported</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Mitigated">Mitigated</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Management Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Personnel Cybersecurity Roster</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor employee security scores and dispatch targeted simulations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono uppercase text-slate-400 text-[10px]">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Security Score</th>
                <th className="py-3 px-4">Active Streak</th>
                <th className="py-3 px-4 text-right">SOC Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp: any) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{emp.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{emp.email}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">{emp.department}</td>

                  <td className="py-3.5 px-4 font-mono uppercase text-cyan-400">
                    {emp.role}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {emp.securityScore}/100
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-amber-400 font-bold">
                    {emp.streakDays} Days
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleSendPhishingDrill(emp.name)}
                      className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition"
                    >
                      Send Drill
                    </button>
                    <button
                      onClick={() => handleAssignRefresher(emp.name)}
                      className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition"
                    >
                      Assign Refresher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
