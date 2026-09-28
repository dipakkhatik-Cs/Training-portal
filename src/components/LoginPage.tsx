"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  X,
} from "lucide-react";
import { playClickSound, playAlertSound } from "@/utils/sound";

export default function LoginPage() {
  const { login, switchDemoUser, setActiveTab, showToast } = useAuth();
  const [identifier, setIdentifier] = useState("emp101@cyberguard.internal");
  const [password, setPassword] = useState("CyberGuard#2025");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      playAlertSound();
      showToast("Please enter your Employee ID/Email and Password", "warning");
      return;
    }
    setLoading(true);
    playClickSound();
    const result = await login(identifier, password);
    setLoading(false);
    if (!result.success) {
      playAlertSound();
    }
  };

  const handleQuickEmployee = () => {
    playClickSound();
    setIdentifier("emp101@cyberguard.internal");
    setPassword("CyberGuard#2025");
    switchDemoUser("employee");
  };

  const handleQuickAdmin = () => {
    playClickSound();
    setIdentifier("admin@cyberguard.internal");
    setPassword("AdminSec#2025");
    switchDemoUser("admin");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setForgotModalOpen(false);
    showToast(
      `Password reset instructions simulated for ${resetEmail || identifier}. Contact your Internal SOC.`,
      "info"
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative z-10">
        {/* Left Side: Login Form */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>SINGLE SIGN-ON & CREDENTIAL VERIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to CyberGuard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in with your enterprise credentials to access your security training modules and compliance score.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase font-mono">
                Employee ID or Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="EMP-1042 or user@cyberguard.internal"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs sm:text-sm placeholder:text-slate-500 transition outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs sm:text-sm placeholder:text-slate-500 transition outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Keep me authenticated (30 days)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate to Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* One-Click Demo Access buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <p className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              One-Click Evaluator Demonstration Logins:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickEmployee}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-700 hover:border-cyan-500/40 text-left transition text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-200">Sarah Connor</p>
                  <p className="text-[10px] text-cyan-400 font-mono">Employee Role</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickAdmin}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-700 hover:border-amber-500/40 text-left transition text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-200">Marcus Vance</p>
                  <p className="text-[10px] text-amber-400 font-mono">CISO / SOC Admin</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Security Assurance Card */}
        <div className="md:col-span-5 hidden md:block">
          <div className="rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-500/20 p-6 space-y-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Enterprise Security Protocols</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                CyberGuard complies with NIST SP 800-50 security training guidelines and implements strict role-based access control.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>PBKDF2 / SHA-256 Hashed Credentials</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero-Trust Session Invalidation</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Active Phishing Simulation Telemetry</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono">
              SOC Hotline: ext. 4410
              <br />
              Emergency Response: 24/7 Monitored
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Credentials</h3>
                <p className="text-xs text-slate-400">Enterprise Security Self-Service</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              In an enterprise zero-trust environment, automated password recovery triggers an alert to the Security Operations Center (SOC). Please enter your corporate email to generate a time-limited one-time verification token.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="employee@cyberguard.internal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Request SOC Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
