import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Zap, Shield, CreditCard, Paintbrush, Bell, Moon, RefreshCw, Loader2, CheckCircle2, X } from "lucide-react";

const SUGGESTED_COMMANDS = [
  { label: "Push Notifications", icon: Bell, command: "Add Firebase push notifications" },
  { label: "Google Login", icon: Shield, command: "Add Google login" },
  { label: "Dark Mode", icon: Moon, command: "Add dark mode" },
  { label: "AdMob Ads", icon: CreditCard, command: "Add AdMob ads" },
  { label: "Offline Cache", icon: RefreshCw, command: "Add offline caching" },
  { label: "Splash Screen", icon: Paintbrush, command: "Add splash screen customization" },
];

export default function AICommandBox({ onCommand, isProcessing, features = [] }) {
  const [command, setCommand] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() && !isProcessing) {
      onCommand(command.trim());
      setCommand("");
    }
  };

  const handleSuggestion = (cmd) => {
    if (!isProcessing) {
      onCommand(cmd);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-violet-500" />
          AI Feature Commands
        </h3>
        <p className="text-sm text-slate-500">Type a command or choose a suggestion to add features</p>
      </div>

      {/* Command input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='e.g. "Add Firebase push notifications"'
            className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            disabled={isProcessing}
          />
        </div>
        <Button
          type="submit"
          disabled={isProcessing || !command.trim()}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/20"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_COMMANDS.map((item) => {
          const isAdded = features.some(f => f.name?.toLowerCase().includes(item.label.toLowerCase()));
          return (
            <button
              key={item.label}
              onClick={() => !isAdded && handleSuggestion(item.command)}
              disabled={isProcessing || isAdded}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                isAdded
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 cursor-default"
                  : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {isAdded ? <CheckCircle2 className="w-3 h-3" /> : <item.icon className="w-3 h-3" />}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Added features */}
      <AnimatePresence>
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Added Features</p>
            <div className="space-y-1.5">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-slate-700 flex-1">{feature.name}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {feature.status || "added"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}