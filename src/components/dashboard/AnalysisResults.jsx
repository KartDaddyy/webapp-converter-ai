import React from "react";
import { motion } from "framer-motion";
import { Globe, Layout, Navigation, Palette, FileText, Link2, Image, MousePointer } from "lucide-react";

export default function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  const stats = [
    { label: "Pages Found", value: analysis.pageCount || 0, icon: FileText, color: "text-blue-500 bg-blue-50" },
    { label: "Navigation Items", value: analysis.navItems?.length || 0, icon: Navigation, color: "text-violet-500 bg-violet-50" },
    { label: "Forms Detected", value: analysis.formCount || 0, icon: Layout, color: "text-emerald-500 bg-emerald-50" },
    { label: "External Links", value: analysis.linkCount || 0, icon: Link2, color: "text-orange-500 bg-orange-50" },
    { label: "Images", value: analysis.imageCount || 0, icon: Image, color: "text-pink-500 bg-pink-50" },
    { label: "Buttons", value: analysis.buttonCount || 0, icon: MousePointer, color: "text-cyan-500 bg-cyan-50" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
        <Globe className="w-4 h-4 text-blue-500" />
        Website Analysis
      </h3>

      {/* Site info */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-100">
        <p className="font-semibold text-slate-900">{analysis.siteName || "Website"}</p>
        <p className="text-xs text-slate-400 mt-0.5">{analysis.description || "Analyzed successfully"}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-400 text-center">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Color scheme */}
      {analysis.colors && analysis.colors.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Palette className="w-3 h-3" />
            Extracted Colors
          </p>
          <div className="flex gap-1.5">
            {analysis.colors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg shadow-sm border border-white"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Transformations */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mobile Transformations</p>
        {[
          "Header menu → Bottom navigation tabs",
          "Sidebar menus → Mobile drawer menu",
          "Website grids → Mobile card layouts",
          "Forms → Native mobile forms",
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-600 py-1">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}