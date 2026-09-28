"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = "border-cyan-500/30";
        let bgClass = "bg-slate-900/90";
        let Icon = Info;
        let iconColor = "text-cyan-400";

        if (toast.type === "success") {
          borderClass = "border-emerald-500/40";
          bgClass = "bg-slate-900/95";
          Icon = CheckCircle2;
          iconColor = "text-emerald-400";
        } else if (toast.type === "error") {
          borderClass = "border-rose-500/40";
          bgClass = "bg-slate-900/95";
          Icon = AlertCircle;
          iconColor = "text-rose-400";
        } else if (toast.type === "warning") {
          borderClass = "border-amber-500/40";
          bgClass = "bg-slate-900/95";
          Icon = AlertTriangle;
          iconColor = "text-amber-400";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 ${borderClass} ${bgClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs text-slate-200 leading-relaxed font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition -mr-1 -mt-1 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
