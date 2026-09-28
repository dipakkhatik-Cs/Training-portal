"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Lightbulb,
  KeyRound,
  ShieldAlert,
  Link2,
  RefreshCw,
  Lock,
  Wifi,
  Database,
  AlertTriangle,
  Usb,
  FileText,
  Search,
  CheckCircle2,
  Check,
  Printer,
  Sparkles,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/utils/sound";

interface Tip {
  id: string;
  title: string;
  category: "Passwords" | "Access" | "Browsing" | "Maintenance" | "Physical" | "Network" | "Privacy" | "Incident";
  severity: "Critical" | "High" | "Medium";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  checklist: string[];
}

export default function SecurityTipsSection() {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [completedTips, setCompletedTips] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [checklistModal, setChecklistModal] = useState(false);

  const tips: Tip[] = [
    {
      id: "tip-1",
      title: "Use High-Entropy Passphrases",
      category: "Passwords",
      severity: "Critical",
      icon: KeyRound,
      description: "Avoid short complex passwords like 'P@ss1'. Use 4 to 5 random memorable dictionary words. Length exponentially multiplies entropy against GPU brute-forcing.",
      checklist: [
        "Create a passphrase with at least 16+ characters",
        "Never reuse credentials across personal and work applications",
        "Store passwords exclusively in an approved enterprise password manager",
      ],
    },
    {
      id: "tip-2",
      title: "Enable Multi-Factor Authentication (MFA)",
      category: "Access",
      severity: "Critical",
      icon: Lock,
      description: "MFA blocks over 99.9% of automated credential theft attempts. Prefer authenticator apps (TOTP) or hardware keys (FIDO2) over SMS text messages.",
      checklist: [
        "Enforce MFA across email, cloud storage, and corporate VPN",
        "Never approve an unexpected push notification (reject MFA fatigue attacks)",
        "Store backup recovery codes in a locked, encrypted vault",
      ],
    },
    {
      id: "tip-3",
      title: "Inspect Links Before Clicking",
      category: "Browsing",
      severity: "High",
      icon: Link2,
      description: "Never trust display anchor text alone. Hover over any hyperlink on desktop or press and hold on mobile to preview the genuine destination domain.",
      checklist: [
        "Verify sender email domain matches official company URL",
        "Watch for lookalike typosquatted domains (e.g. paypa1.com)",
        "Never enter corporate credentials on pages reached via unexpected email links",
      ],
    },
    {
      id: "tip-4",
      title: "Keep Operating Systems & Software Updated",
      category: "Maintenance",
      severity: "High",
      icon: RefreshCw,
      description: "Over 60% of network intrusions exploit known vulnerabilities (CVEs) where security patches were released months prior but never applied.",
      checklist: [
        "Enable automatic updates on your OS and web browsers",
        "Restart your workstation at least once a week to apply pending patches",
        "Never bypass or disable enterprise endpoint protection agents",
      ],
    },
    {
      id: "tip-5",
      title: "Lock Your Workstation Instantly",
      category: "Physical",
      severity: "Medium",
      icon: Lock,
      description: "Physical security is the first line of defense. Whenever stepping away from your desk—even for a cup of coffee—lock your screen immediately.",
      checklist: [
        "Use shortcut: Win + L on Windows or Cmd + Ctrl + Q on macOS",
        "Configure screen saver timeout to lock automatically after 3 minutes",
        "Never leave corporate badges or visitor keys unattended",
      ],
    },
    {
      id: "tip-6",
      title: "Avoid Unencrypted Public Wi-Fi",
      category: "Network",
      severity: "High",
      icon: Wifi,
      description: "Airport, hotel, and coffee shop networks are unencrypted and vulnerable to Evil Twin hotspots and packet eavesdropping.",
      checklist: [
        "Always connect through the corporate Virtual Private Network (VPN)",
        "Turn off automatic Wi-Fi joining and file sharing in public venues",
        "Verify all web connections enforce HTTPS with valid TLS certificates",
      ],
    },
    {
      id: "tip-7",
      title: "Protect Confidential & PII Data",
      category: "Privacy",
      severity: "Critical",
      icon: Database,
      description: "Classify company information strictly (Public, Internal, Confidential, Restricted). Never upload customer data to public AI chatbots or unvetted cloud tools.",
      checklist: [
        "Encrypt sensitive files before transmitting across email or cloud",
        "Do not paste company source code or customer data into external LLMs",
        "Securely shred confidential paper documents in designated security bins",
      ],
    },
    {
      id: "tip-8",
      title: "Report Suspicious Activity Within 15 Minutes",
      category: "Incident",
      severity: "Critical",
      icon: AlertTriangle,
      description: "Early reporting is the difference between an isolated event and a catastrophic ransomware lockout. You will never be penalized for reporting an honest mistake.",
      checklist: [
        "If you clicked a suspicious link, immediately notify the SOC Hotline",
        "Disconnect your device from Wi-Fi if malware or ransomware is suspected",
        "Use CyberGuard's Incident Report tool to generate a tracking ticket",
      ],
    },
    {
      id: "tip-9",
      title: "Beware of Unknown USB Drives & Peripherals",
      category: "Physical",
      severity: "Medium",
      icon: Usb,
      description: "Attackers leave malicious USB flash drives in parking lots or lobbies ('Baiting'). Inserting an unknown drive can execute keystroke-injection payloads in milliseconds.",
      checklist: [
        "Never plug unknown thumb drives into company hardware",
        "Hand found USB storage devices directly to building security",
        "Use approved enterprise cloud transfer links instead of thumb drives",
      ],
    },
  ];

  const handleToggleTipDone = (tipId: string) => {
    playSuccessSound();
    const current = !!completedTips[tipId];
    setCompletedTips((prev) => ({ ...prev, [tipId]: !current }));
    if (!current) {
      showToast("Security practice marked as mastered!", "success");
    }
  };

  const handleToggleCheckItem = (key: string) => {
    playClickSound();
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || tip.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["All", "Passwords", "Access", "Browsing", "Maintenance", "Physical", "Network", "Privacy", "Incident"];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>DEFENSIVE BEST PRACTICES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Actionable Cybersecurity Tips
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Clear, practical, and everyday defense habits to shield enterprise infrastructure from social engineering, malware, and data breaches.
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setChecklistModal(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition whitespace-nowrap self-start md:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Emergency Security Checklist</span>
          </button>
        </div>

        {/* Filter & Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search security tips (e.g. MFA, public Wi-Fi, USB, passwords)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip) => {
          const Icon = tip.icon;
          const isDone = !!completedTips[tip.id];

          return (
            <div
              key={tip.id}
              className={`rounded-2xl border p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 shadow-xl ${
                isDone
                  ? "bg-slate-900/40 border-emerald-500/40"
                  : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <div>
                {/* Header Severity & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tip.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      tip.severity === "Critical"
                        ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                        : tip.severity === "High"
                        ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                        : "bg-blue-950 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {tip.severity.toUpperCase()} RISK
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {tip.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {tip.description}
                </p>

                {/* Checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                    Actionable Routine:
                  </p>
                  {tip.checklist.map((item, idx) => {
                    const itemKey = `${tip.id}-item-${idx}`;
                    const isChecked = !!checkedItems[itemKey];

                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleCheckItem(itemKey)}
                        className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none group"
                      >
                        <div
                          className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition flex-shrink-0 ${
                            isChecked
                              ? "bg-cyan-500 border-cyan-500 text-slate-950"
                              : "border-slate-700 bg-slate-950 group-hover:border-cyan-400"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`leading-tight ${isChecked ? "line-through text-slate-500" : ""}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-800">
                <button
                  onClick={() => handleToggleTipDone(tip.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isDone
                      ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isDone ? "Practice Implemented" : "Mark as Mastered"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Emergency Checklist Modal */}
      {checklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full my-8 bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setChecklistModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white print:hidden"
            >
              ✕
            </button>

            <div className="border-b border-slate-800 pb-4 mb-6">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                CYBERGUARD ENTERPRISE STANDARD
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Workstation Quick Defense Checklist
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Print or bookmark this card at your workstation for rapid security adherence.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { title: "Daily Morning Protocol", items: ["Check for pending OS/browser updates and reboot if needed", "Ensure Enterprise VPN is active before browsing", "Verify screen lock timer is active (3 mins)"] },
                { title: "Email Intake Vigilance", items: ["Inspect sender domain address on all unexpected messages", "Never click emergency password reset links from unknown sources", "Never purchase gift cards or process wire changes based on email alone"] },
                { title: "End of Day Hygiene", items: ["Lock computer (Win+L / Cmd+Ctrl+Q) before leaving workspace", "Store confidential documents in secure physical drawers", "Never leave access badges or USB keys on the desk"] },
              ].map((sec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-2">{sec.title}</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {sec.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Checklist</span>
              </button>
              <button
                onClick={() => setChecklistModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
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
