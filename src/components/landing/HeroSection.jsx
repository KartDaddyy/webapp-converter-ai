import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroSection({ onSubmitUrl, isLoading }) {
  const [url, setUrl] = useState("");
  const [framework, setFramework] = useState("flutter");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onSubmitUrl(url.trim(), framework);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered App Generation
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
          Convert Any Website{" "}
          <span className="gradient-text">Into a Mobile App</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Paste your website URL and our AI will analyze, redesign, and generate
          a production-ready Flutter app with native mobile UI — in minutes.
        </p>

        {/* Framework Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-2 mb-5"
        >
          <span className="text-sm text-slate-500 font-medium">Framework:</span>
          <button
            type="button"
            onClick={() => setFramework("flutter")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${framework === "flutter" ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}
          >
            Flutter
          </button>
          <button
            type="button"
            onClick={() => setFramework("react_native")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${framework === "react_native" ? "bg-violet-600 text-white border-violet-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-violet-400"}`}
          >
            React Native
          </button>
        </motion.div>

        {/* URL Input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 h-14 text-base rounded-xl border-slate-200 bg-white shadow-lg shadow-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-14 px-8 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25 transition-all duration-300"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Generate App <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </motion.form>

        {/* Features tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10 text-sm text-slate-400"
        >
          {["Flutter & React Native", "APK & AAB Builds", "iOS Ready", "AI Commands"].map((tag) => (
            <span key={tag} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-32 right-[15%] hidden lg:block"
      >
        <div className="p-3 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <Smartphone className="w-6 h-6 text-violet-500" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-32 left-[15%] hidden lg:block"
      >
        <div className="p-3 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <Globe className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>
    </div>
  );
}