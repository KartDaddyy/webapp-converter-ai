import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Circle, Globe, Layout, Palette, Code2, Smartphone } from "lucide-react";

const steps = [
  { id: "fetch", label: "Fetching website content", icon: Globe },
  { id: "analyze", label: "Analyzing structure & navigation", icon: Layout },
  { id: "design", label: "Redesigning for mobile UI", icon: Palette },
  { id: "generate", label: "Generating Flutter code", icon: Code2 },
  { id: "preview", label: "Building preview", icon: Smartphone },
];

export default function AnalysisProgress({ currentStep = 0, isComplete = false }) {
  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep && !isComplete;
          const isDone = index < currentStep || isComplete;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                isActive
                  ? "bg-blue-50 border border-blue-100"
                  : isDone
                  ? "bg-emerald-50/50 border border-emerald-100/50"
                  : "bg-slate-50 border border-transparent"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isActive
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : isDone
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isActive ? "text-blue-700" : isDone ? "text-emerald-700" : "text-slate-400"
                }`}>
                  {step.label}
                </p>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}