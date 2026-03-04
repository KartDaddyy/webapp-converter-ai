import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Send, Loader2, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_COMMANDS = [
  "Add Firebase push notifications",
  "Add Google login",
  "Add dark mode",
  "Add offline caching",
  "Add AdMob ads",
  "Add pull to refresh",
  "Add loading animations",
  "Add Apple login",
  "Add OTP login",
  "Add in-app purchases",
];

export default function AICommandBox({ project, onCommand }) {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    if (!command.trim() || loading || !project) return;
    const cmd = command.trim();
    setLoading(true);
    setResult(null);
    setCommand("");
    try {
      const res = await onCommand(cmd);
      setResult(res);
      setHistory(prev => [{ cmd, result: res, time: new Date() }, ...prev.slice(0, 9)]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const isDisabled = project?.status === "analyzing" || !project?.analysis;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">AI Feature Commands</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Describe a feature in plain English — AI will add it to your app automatically.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick commands */}
        <div className="px-4 py-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Quick Commands</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_COMMANDS.map((cmd, i) => (
              <button
                key={i}
                onClick={() => setCommand(cmd)}
                disabled={isDisabled || loading}
                className="px-2.5 py-1 bg-slate-100 hover:bg-violet-100 border border-slate-200 hover:border-violet-300 rounded-full text-[10px] text-slate-500 hover:text-violet-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-4 p-4 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">{result.feature_name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">{result.description}</p>
              {result.packages_needed?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {result.packages_needed.map((pkg, i) => (
                    <span key={i} className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                      {pkg}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="px-4 mb-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">History</p>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <div key={i} className="flex items-start gap-2 py-2 px-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <ChevronRight className="w-3 h-3 text-violet-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-600 truncate">{h.cmd}</p>
                    <p className="text-[10px] text-slate-400">{h.result?.feature_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-slate-100">
        {isDisabled && (
          <p className="text-[10px] text-slate-400 text-center mb-2">
            Waiting for analysis to complete...
          </p>
        )}
        <div className="relative">
          <Textarea
            value={command}
            onChange={e => setCommand(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={isDisabled ? "Analyzing..." : "e.g. Add Google login with Firebase..."}
            disabled={isDisabled || loading}
            rows={3}
            className="resize-none text-xs rounded-xl focus-visible:ring-violet-500/40 pr-12 disabled:opacity-40"
          />
          <Button
            onClick={handleSubmit}
            disabled={!command.trim() || loading || isDisabled}
            size="icon"
            className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 rounded-lg"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}