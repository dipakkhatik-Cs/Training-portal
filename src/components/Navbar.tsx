"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  ShieldAlert,
  GraduationCap,
  Fish,
  Lightbulb,
  AlertTriangle,
  Trophy,
  LayoutDashboard,
  Lock,
  LogOut,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Volume2,
  VolumeX,
  BookOpen,
} from "lucide-react";
import { toggleSound, isSoundEnabled, playClickSound } from "@/utils/sound";

export default function Navbar() {
  const { currentUser, logout, switchDemoUser, activeTab, setActiveTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleNavClick = (tab: string) => {
    playClickSound();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  };

  const navItems = [
    { id: "landing", label: "Home", icon: Shield },
    { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "phishing", label: "Phishing Lab", icon: Fish },
    { id: "tips", label: "Security Tips", icon: Lightbulb },
    { id: "incidents", label: "Report Incident", icon: AlertTriangle },
    { id: "achievements", label: "Leaderboard", icon: Trophy },
    { id: "college-hub", label: "College Viva Hub", icon: BookOpen, badge: "CODE & VIVA" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl transition-all">
      {/* Top Threat Intelligence Status Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-purple-950/60 border-b border-slate-800/80 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] tracking-wide text-emerald-400">
              ZERO-TRUST PERIMETER: ARMED
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Active Telemetry: NIST SP 800-50 Compliant Awareness
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              title={soundOn ? "Mute interactive audio feedback" : "Enable audio feedback"}
              className="text-slate-400 hover:text-cyan-400 transition flex items-center gap-1 text-[11px]"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden md:inline">{soundOn ? "Audio On" : "Muted"}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono text-[11px]">
              ID: {currentUser ? currentUser.employeeId : "GUEST"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick("landing")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  Cyber<span className="text-cyan-400">Guard</span>
                </span>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wider uppercase">
                Employee Security Training
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1 rounded font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin SOC tab button */}
            <button
              onClick={() => handleNavClick("admin")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ml-1 ${
                activeTab === "admin"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-slate-900/80 text-amber-400/90 hover:bg-amber-950/40 hover:text-amber-300 border border-amber-500/20"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin SOC</span>
            </button>
          </nav>

          {/* Right Action: User Pill & Switcher */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition text-left text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-1 ring-cyan-400/30">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold text-slate-200 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-cyan-400 font-mono">
                      {currentUser.role.toUpperCase()} • {currentUser.securityScore}/100
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Role Switcher Menu */}
                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 backdrop-blur-2xl">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-slate-300">Signed In As</p>
                      <p className="text-xs text-cyan-400 font-medium truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500">{currentUser.department}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Quick Demo Switcher
                      </p>
                      <button
                        onClick={() => {
                          switchDemoUser("employee");
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-300 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                          Sarah Connor (Employee)
                        </span>
                        <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">Score: 88</span>
                      </button>

                      <button
                        onClick={() => {
                          switchDemoUser("employee_alex");
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-300 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                          Alex Chen (Finance)
                        </span>
                        <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">Score: 92</span>
                      </button>

                      <button
                        onClick={() => {
                          switchDemoUser("admin");
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-950/30 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                          Marcus Vance (CISO Admin)
                        </span>
                        <span className="text-[10px] bg-amber-950/50 text-amber-400 px-1 rounded">Admin</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("login")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-5 space-y-1 backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "text-cyan-300 bg-cyan-950/50 border border-cyan-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick("admin")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 bg-amber-950/30 border border-amber-500/20"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin SOC Console</span>
          </button>
        </div>
      )}
    </header>
  );
}
