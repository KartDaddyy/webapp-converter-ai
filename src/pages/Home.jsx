import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Smartphone, Code2, Globe, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = "https://" + cleanUrl;
      }
      const project = await base44.entities.Project.create({
        url: cleanUrl,
        name: new URL(cleanUrl).hostname.replace("www.", ""),
        status: "analyzing"
      });
      navigate(createPageUrl(`Dashboard?id=${project.id}`));
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const features = [
    { icon: Globe, label: "Website Analysis", desc: "AI scans pages, menus, forms & assets" },
    { icon: Smartphone, label: "Mobile Redesign", desc: "Native UI with bottom nav & drawer" },
    { icon: Code2, label: "Flutter Code", desc: "Full cross-platform source code" },
    { icon: Zap, label: "AI Commands", desc: "Add features with plain English" },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[10%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-fuchsia-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">WebApp Converter AI</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
          <span className="hover:text-white/80 cursor-pointer transition-colors">Features</span>
          <span className="hover:text-white/80 cursor-pointer transition-colors">Pricing</span>
          <span className="hover:text-white/80 cursor-pointer transition-colors">Docs</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-32 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8">
            <Star className="w-3 h-3 text-violet-400" />
            Powered by Advanced AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Convert Any Website<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Into a Mobile App
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
            AI analyzes your website, redesigns the UI for mobile, and generates production-ready Flutter code for Android & iOS — in minutes.
          </p>

          {/* URL Input */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto mb-4">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
                placeholder="Enter website URL (e.g. yoursite.com)"
                className="pl-11 h-14 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl text-sm focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !url.trim()}
              className="h-14 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-500/25 disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Generate App
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
          <p className="text-xs text-white/25">No credit card required · Free to try</p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full"
        >
          {features.map((f, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 text-left hover:bg-white/[0.06] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-white/80 mb-1">{f.label}</p>
              <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Supported outputs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <p className="text-xs text-white/25 uppercase tracking-widest">Generates For</p>
          <div className="flex items-center gap-6">
            {["Android APK", "Android AAB", "iOS App", "Flutter Source"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-white/40 text-sm">
                <ChevronRight className="w-3 h-3 text-violet-500" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}