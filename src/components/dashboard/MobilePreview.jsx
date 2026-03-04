import React, { useState } from "react";
import { motion } from "framer-motion";
import PhoneMockup from "@/components/ui/PhoneMockup";
import { Home, Search, User, Menu, Bell, Settings, ChevronRight, Star, ShoppingBag, Heart } from "lucide-react";

function PreviewScreen({ analysis, colorScheme }) {
  const primary = colorScheme?.primary || "#3b82f6";
  const screens = analysis?.screens || [];
  const siteName = analysis?.siteName || "My App";
  const navItems = analysis?.navItems || ["Home", "Search", "Profile"];

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 text-xs">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-8 pb-2 bg-white">
        <span className="font-bold text-sm" style={{ color: primary }}>{siteName}</span>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <Menu className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-slate-100">
          <Search className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-300 text-[10px]">Search...</span>
        </div>

        {/* Hero card */}
        <div className="rounded-xl overflow-hidden shadow-sm" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
          <div className="px-4 py-5 text-white">
            <p className="font-bold text-sm mb-1">Welcome Back</p>
            <p className="text-[10px] opacity-80">Explore {siteName}</p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-2">
          {(screens.length > 0 ? screens.slice(0, 4) : [
            { name: "Dashboard", icon: Home },
            { name: "Products", icon: ShoppingBag },
            { name: "Favorites", icon: Heart },
            { name: "Settings", icon: Settings }
          ]).map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${primary}15` }}>
                {item.icon ? <item.icon className="w-3.5 h-3.5" style={{ color: primary }} /> : (
                  <Home className="w-3.5 h-3.5" style={{ color: primary }} />
                )}
              </div>
              <p className="font-medium text-[10px]">{item.name || `Screen ${i+1}`}</p>
            </div>
          ))}
        </div>

        {/* List items */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {["Recent Activity", "Notifications", "Updates"].map((item, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-2.5 ${i < 2 ? "border-b border-slate-50" : ""}`}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${primary}10` }}>
                  <Star className="w-3 h-3" style={{ color: primary }} />
                </div>
                <span className="text-[10px] font-medium">{item}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-around bg-white border-t border-slate-100 py-2 pb-3">
        {[
          { icon: Home, label: navItems[0] || "Home", active: true },
          { icon: Search, label: navItems[1] || "Search", active: false },
          { icon: Heart, label: "Saved", active: false },
          { icon: User, label: navItems[2] || "Profile", active: false },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <item.icon
              className="w-4 h-4"
              style={{ color: item.active ? primary : "#94a3b8" }}
            />
            <span className="text-[8px]" style={{ color: item.active ? primary : "#94a3b8", fontWeight: item.active ? 600 : 400 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MobilePreview({ project }) {
  const [platform, setPlatform] = useState("android");
  const analysis = project?.analysis || {};
  const colorScheme = project?.color_scheme || {};

  return (
    <div className="flex flex-col items-center">
      {/* Platform toggle */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6">
        {["android", "ios"].map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              platform === p
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {p === "android" ? "Android" : "iOS"}
          </button>
        ))}
      </div>

      <PhoneMockup platform={platform}>
        <PreviewScreen analysis={analysis} colorScheme={colorScheme} />
      </PhoneMockup>
    </div>
  );
}