import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, User, Settings, Bell, Menu, ChevronRight, Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react";

const iconMap = {
  home: Home, search: Search, person: User, settings: Settings, notifications: Bell,
  favorite: Heart, cart: ShoppingCart, menu: Menu, star: Star,
};

function getIcon(name) {
  const key = (name || "").toLowerCase();
  return iconMap[key] || Home;
}

export default function MobileSimulator({ project, device, analyzing }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const analysis = project?.analysis || {};
  const colors = project?.color_scheme || {};
  const primaryColor = colors.primary || "#6d28d9";
  const navItems = analysis.nav_items || [
    { label: "Home", icon: "home" },
    { label: "Search", icon: "search" },
    { label: "Profile", icon: "person" },
    { label: "Settings", icon: "settings" },
  ];
  const screens = project?.screens || [];
  const features = project?.features || [];

  const isIOS = device === "ios";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-white/30 uppercase tracking-widest">{isIOS ? "iOS Preview" : "Android Preview"}</p>

      {/* Phone frame */}
      <div
        className={`relative bg-[#111] shadow-2xl shadow-black/60 ${
          isIOS
            ? "w-[280px] h-[580px] rounded-[44px] border-[6px] border-[#2a2a2a]"
            : "w-[280px] h-[580px] rounded-[28px] border-[5px] border-[#1a1a1a]"
        }`}
      >
        {/* Notch / Dynamic Island */}
        {isIOS ? (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
        ) : (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rounded-full z-20 border border-[#333]" />
        )}

        {/* Screen content */}
        <div className="absolute inset-0 rounded-[inherit] overflow-hidden bg-white">

          {analyzing ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#f5f5f5]">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Generating UI...</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.background || "#f8f9fa" }}>
              {/* Status bar */}
              <div
                className="flex items-center justify-between px-5 pt-3 pb-1"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-[10px] font-semibold text-white/90">9:41</span>
                <div className="flex items-center gap-1.5">
                  {[4, 3, 2].map(i => (
                    <div key={i} className="h-2.5 bg-white/80 rounded-sm" style={{ width: `${i * 2}px` }} />
                  ))}
                  <div className="w-4 h-2 border border-white/60 rounded-sm ml-0.5">
                    <div className="w-3/4 h-full bg-white/80 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* App bar */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center gap-2">
                  <button className="text-white/80">
                    <Menu className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-white truncate max-w-[140px]">
                    {screens[activeScreen]?.name || analysis.app_name || project?.name || "App"}
                  </span>
                </div>
                <button className="text-white/80">
                  <Bell className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Main content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-hidden px-3 py-3 space-y-2.5"
                >
                  {/* Hero card */}
                  <div
                    className="rounded-2xl p-4 text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${colors.secondary || "#a855f7"})` }}
                  >
                    <p className="text-[11px] text-white/70 mb-0.5">Welcome to</p>
                    <p className="text-sm font-bold">{analysis.app_name || project?.name}</p>
                    <p className="text-[10px] text-white/60 mt-1">{analysis.tagline || "Your mobile experience"}</p>
                    <div className="absolute right-3 bottom-3 opacity-20">
                      <div className="w-12 h-12 rounded-full border-2 border-white" />
                    </div>
                  </div>

                  {/* Feature badges */}
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {features.slice(-3).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[9px] font-medium text-white" style={{ backgroundColor: primaryColor + "cc" }}>
                          ✓ {f.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cards */}
                  {(analysis.nav_items || []).slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                      onClick={() => setActiveScreen(i % Math.max(screens.length, 1))}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: primaryColor + "20" }}
                      >
                        {React.createElement(getIcon(item.icon), {
                          className: "w-4 h-4",
                          style: { color: primaryColor }
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                        <p className="text-[10px] text-gray-400 truncate">Tap to explore</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Bottom navigation */}
              <div className={`bg-white border-t border-gray-100 flex items-center px-1 ${isIOS ? "pb-4 pt-1" : "py-1"}`}>
                {navItems.slice(0, 5).map((item, i) => {
                  const Icon = getIcon(item.icon);
                  const isActive = i === activeScreen % navItems.length;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveScreen(i)}
                      className="flex-1 flex flex-col items-center gap-0.5 py-1.5"
                    >
                      <Icon
                        className="w-4 h-4 transition-colors"
                        style={{ color: isActive ? primaryColor : "#9ca3af" }}
                      />
                      <span
                        className="text-[9px] font-medium transition-colors"
                        style={{ color: isActive ? primaryColor : "#9ca3af" }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Home indicator (iOS) */}
        {isIOS && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full" />
        )}
      </div>

      {/* Screen name */}
      {!analyzing && screens[activeScreen] && (
        <p className="text-xs text-white/25">{screens[activeScreen].name}</p>
      )}
    </div>
  );
}