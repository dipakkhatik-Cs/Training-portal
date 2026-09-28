"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  LifeBuoy,
  WifiOff,
  KeyRound,
  FileText,
  X,
} from "lucide-react";
import { playClickSound, playSuccessSound, playAlertSound } from "@/utils/sound";

export default function IncidentReportingSection() {
  const { currentUser, showToast } = useAuth();
  const [employeeName, setEmployeeName] = useState(currentUser?.name || "");
  const [employeeId, setEmployeeId] = useState(currentUser?.employeeId || "");
  const [incidentType, setIncidentType] = useState("Phishing Email");
  const [urgency, setUrgency] = useState("Medium");
  const [affectedSystem, setAffectedSystem] = useState("Corporate Workstation");
  const [description, setDescription] = useState("");
  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [incidentsList, setIncidentsList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setEmployeeName(currentUser.name);
      setEmployeeId(currentUser.employeeId);
    }
    fetchIncidents();
  }, [currentUser]);

  const fetchIncidents = async () => {
    try {
      setLoadingList(true);
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.incidents) {
        setIncidentsList(data.incidents);
      }
    } catch (err) {
      console.error("Incidents fetch error:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || description.trim().length < 10) {
      playAlertSound();
      showToast("Please provide a detailed description (minimum 10 characters).", "warning");
      return;
    }

    setSubmitting(true);
    playClickSound();

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          employeeId,
          userId: currentUser?.id || "usr_emp_101",
          incidentType,
          urgency,
          affectedSystem,
          description,
          attachmentName: simulatedFile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      playSuccessSound();
      setSubmittedRef(data.incident.referenceNo);
      showToast(`Incident reported! Ticket generated: ${data.incident.referenceNo}`, "success");
      setDescription("");
      setSimulatedFile(null);
      fetchIncidents();
    } catch (err: any) {
      playAlertSound();
      showToast(err.message || "Failed to submit report", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSimulatedFile(`${file.name} (${Math.round(file.size / 1024)} KB)`);
      showToast(`Attached evidence: ${file.name}`, "info");
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-rose-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 text-xs font-mono font-medium mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SECURITY OPERATIONS CENTER (SOC) HOTLINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Report a Security Incident
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Immediate notification prevents lateral network spread. No employee will ever face reprimand for reporting an honest mistake or suspicious email.
          </p>
        </div>
      </div>

      {/* Confirmation Card after Submission */}
      {submittedRef && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  INCIDENT LOGGED WITH SOC
                </span>
                <h3 className="text-xl font-black text-white">
                  Reference Ticket: {submittedRef}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSubmittedRef(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your report has been queued for immediate triage by the Security Operations Center. A security analyst has been assigned and may contact you via internal Slack or extension if memory dumps or quarantine actions are required.
          </p>

          {/* Immediate Containment Advice Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-emerald-400" />
              IMMEDIATE CONTAINMENT PROTOCOL:
            </p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li className="flex items-center gap-2">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>If you suspect active malware: disconnect Wi-Fi or unplug your Ethernet cable now.</span>
              </li>
              <li className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>If you entered credentials on a fake page: change your password immediately from a secondary clean device.</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Leave your computer powered ON (do not shut down or reboot) so volatile memory forensics can be captured.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Incident Intake Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Security Incident Intake Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                  Employee Full Name
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                  Incident Classification
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Phishing Email">Phishing Email / BEC</option>
                  <option value="Malware">Malware / Ransomware</option>
                  <option value="Lost/Stolen Device">Lost / Stolen Hardware Device</option>
                  <option value="Suspicious Login">Suspicious Login / Account Takeover</option>
                  <option value="Data Leak">Data Leak / PII Exposure</option>
                  <option value="Other">Other Security Anomaly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs outline-none cursor-pointer font-bold ${
                    urgency === "Critical"
                      ? "border-rose-500 text-rose-400"
                      : urgency === "High"
                      ? "border-amber-500 text-amber-400"
                      : "border-slate-700 text-cyan-300"
                  }`}
                >
                  <option value="Low">Low - Informational / Non-urgent</option>
                  <option value="Medium">Medium - Suspicious activity without loss</option>
                  <option value="High">High - Credential entered or file opened</option>
                  <option value="Critical">Critical - Active ransomware / Stolen device</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                Affected System or Device
              </label>
              <input
                type="text"
                value={affectedSystem}
                onChange={(e) => setAffectedSystem(e.target.value)}
                placeholder="e.g. Workstation Dell #1042, Outlook 365, Company iPad..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                Incident Description & Sequence of Events
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, any links clicked, senders involved, or anomalous behaviors observed..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 leading-relaxed"
                required
              />
            </div>

            {/* Evidence attachment simulated uploader */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                Attachment / Evidence Upload (Optional)
              </label>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-400 bg-slate-950/60 cursor-pointer transition">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-300">
                  {simulatedFile ? (
                    <span className="text-cyan-400 font-bold">{simulatedFile}</span>
                  ) : (
                    "Click to attach email file (.eml, .msg), screenshot (.png, .jpg), or logs"
                  )}
                </span>
                <input
                  type="file"
                  onChange={handleSimulateUpload}
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.eml,.msg,.txt,.pdf,.csv"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Transmitting to SOC...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Security Report to SOC</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Incident Tracking List */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Reported Incidents History</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">DATABASE</span>
            </div>

            {loadingList ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                Syncing reported events...
              </div>
            ) : incidentsList.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No incidents reported yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {incidentsList.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {inc.referenceNo}
                      </span>
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
                    </div>

                    <p className="text-xs font-semibold text-white truncate">
                      {inc.incidentType} • {inc.affectedSystem}
                    </p>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Reported by: {inc.employeeName}</span>
                      <span className="font-mono">{inc.urgency} Urgency</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono">
            Emergency SOC Line: ext. 4410
            <br />
            External Crisis Line: +1 (800) 555-CYBER
          </div>
        </div>
      </div>
    </div>
  );
}
