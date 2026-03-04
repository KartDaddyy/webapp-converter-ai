import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Cpu, FolderOpen, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const isLanding = currentPageName === "Home";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLanding ? "bg-white/80 backdrop-blur-xl border-b border-slate-100/50" : "bg-white border-b border-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              WebApp Converter <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to={createPageUrl("Home")}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium"
            >
              Home
            </Link>
            <Link
              to={createPageUrl("MyProjects")}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Projects
            </Link>
          </div>
        </div>
      </nav>

      {/* Content with top padding for fixed nav */}
      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}