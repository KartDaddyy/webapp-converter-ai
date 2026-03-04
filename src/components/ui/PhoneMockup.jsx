import React from "react";
import { motion } from "framer-motion";

export default function PhoneMockup({ children, platform = "android", className = "" }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
        {platform === "android" ? "Android" : "iOS"} Preview
      </span>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-[280px] h-[560px] rounded-[2.5rem] border-[3px] border-slate-700 bg-slate-900 shadow-2xl shadow-blue-500/10 overflow-hidden"
      >
        {/* Notch */}
        {platform === "ios" ? (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-900 rounded-b-2xl z-20" />
        ) : (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rounded-full z-20 border border-slate-700" />
        )}
        {/* Screen content */}
        <div className="w-full h-full overflow-hidden bg-white rounded-[2.2rem]">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600 rounded-full z-20" />
      </motion.div>
    </div>
  );
}