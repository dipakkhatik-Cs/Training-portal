import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "CyberGuard — Employee Cybersecurity Training Portal",
  description: "Modern, professional enterprise cybersecurity training portal with phishing simulations, interactive courses, incident reporting, and compliance gamification.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-slate-950">
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
