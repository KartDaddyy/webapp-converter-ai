import React, { useState } from "react";
import MobileSimulator from "@/components/preview/MobileSimulator";
import { Smartphone, Monitor } from "lucide-react";

export default function PreviewPanel({ project, analyzing }) {
  const [device, setDevice] = useState("android");

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Device toggle */}
      <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1">
        {[
          { id: "android", label: "Android" },
          { id: "ios", label: "iOS" },
        ].map(d => (
          <button
            key={d.id}
            onClick={() => setDevice(d.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              device === d.id
                ? "bg-white/10 text-white"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {d.label}
          </button>
        ))}
      </div>

      {/* Phone simulator */}
      <div className="flex gap-8 items-start justify-center flex-wrap">
        <MobileSimulator project={project} device={device} analyzing={analyzing} />
      </div>

      {analyzing && (
        <p className="text-xs text-white/25 text-center mt-2">
          AI is analyzing your website and generating the mobile UI...
        </p>
      )}
    </div>
  );
}