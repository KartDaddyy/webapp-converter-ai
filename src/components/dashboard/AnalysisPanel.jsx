import React from "react";
import { Layers, Navigation, FileText, Cpu, Palette } from "lucide-react";

export default function AnalysisPanel({ project, analyzing }) {
  const analysis = project.analysis || {};

  if (analyzing) {
    return (
      <div className="p-5 space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Analysis</p>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-white/[0.05] rounded animate-pulse w-2/3" />
            <div className="h-2 bg-white/[0.03] rounded animate-pulse w-full" />
            <div className="h-2 bg-white/[0.03] rounded animate-pulse w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (!analysis.app_name) {
    return (
      <div className="p-5">
        <p className="text-xs text-white/20">No analysis yet</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      {/* App info */}
      <div>
        <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">App Info</p>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
          <p className="font-semibold text-white text-sm">{analysis.app_name}</p>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">{analysis.tagline}</p>
        </div>
      </div>

      {/* Color scheme */}
      {(analysis.primary_color || project.color_scheme) && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <Palette className="w-3 h-3" /> Colors
          </p>
          <div className="flex gap-2">
            {[analysis.primary_color, analysis.secondary_color, analysis.background_color].filter(Boolean).map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: c }} />
                <span className="text-[10px] text-white/25">{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screens */}
      {(project.screens || []).length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Screens ({project.screens.length})
          </p>
          <div className="space-y-1.5">
            {project.screens.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <div>
                  <p className="text-xs text-white/70 font-medium">{s.name}</p>
                  <p className="text-[10px] text-white/30">{s.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      {(analysis.nav_items || []).length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <Navigation className="w-3 h-3" /> Bottom Nav
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {analysis.nav_items.map((n, i) => (
              <span key={i} className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[11px] text-violet-300">
                {n.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Features detected */}
      {(analysis.features_detected || []).length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <Cpu className="w-3 h-3" /> Detected Features
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {analysis.features_detected.map((f, i) => (
              <span key={i} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-[11px] text-white/50">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Added features */}
      {(project.features || []).length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> AI Added Features
          </p>
          <div className="space-y-1.5">
            {project.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-xs text-emerald-300/80">{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}