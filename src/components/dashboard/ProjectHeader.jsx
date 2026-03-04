import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Smartphone, ArrowLeft, Globe, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  analyzing: { label: "Analyzing", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Loader2, spin: true },
  generating: { label: "Generating", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Loader2, spin: true },
  preview: { label: "Ready", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  building: { label: "Building", color: "bg-violet-500/10 text-violet-400 border-violet-500/20", icon: Loader2, spin: true },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertCircle },
};

export default function ProjectHeader({ project, analyzing }) {
  const navigate = useNavigate();
  const cfg = statusConfig[project.status] || statusConfig.analyzing;
  const Icon = cfg.icon;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0a0b0c]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(createPageUrl("Home"))}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Smartphone className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">{project.name || "App"}</span>
        </div>

        <div className="flex items-center gap-1.5 text-white/30 text-xs">
          <Globe className="w-3 h-3" />
          <span className="truncate max-w-[200px]">{project.url}</span>
        </div>
      </div>

      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.color}`}>
        <Icon className={`w-3 h-3 ${cfg.spin ? "animate-spin" : ""}`} />
        {analyzing && project.status === "analyzing" ? "Analyzing website..." : cfg.label}
      </div>
    </header>
  );
}