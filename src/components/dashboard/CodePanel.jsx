import React, { useState } from "react";
import { Copy, Check, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodePanel({ project }) {
  const [copied, setCopied] = useState(false);

  const code = project.flutter_code || "// Generating Flutter code...\n// Please wait for analysis to complete.";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name || "app"}_main.dart`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white/80">main.dart</span>
          <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded text-[10px] text-violet-400">Flutter</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 text-white/40 hover:text-white/70 hover:bg-white/5 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="h-8 bg-violet-600 hover:bg-violet-500 text-white text-xs"
          >
            Download .dart
          </Button>
        </div>
      </div>

      {/* Code viewer */}
      <div className="relative rounded-xl bg-[#0d1117] border border-white/[0.07] overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
          {["#ff5f56", "#febc2e", "#27c93f"].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
          ))}
          <span className="text-xs text-white/25 ml-2 font-mono">lib/main.dart</span>
        </div>
        <pre className="p-4 overflow-auto max-h-[500px] text-[12px] leading-relaxed">
          <code className="text-[#c9d1d9] font-mono whitespace-pre-wrap break-words">
            {code}
          </code>
        </pre>
      </div>

      {/* Added features code */}
      {(project.features || []).length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-white/30 uppercase tracking-widest">AI-Added Features</p>
          {project.features.map((f, i) => (
            <div key={i} className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">{f.name}</span>
              </div>
              <p className="text-xs text-white/40 mb-2">{f.description}</p>
              {f.packages && f.packages.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {f.packages.map((pkg, j) => (
                    <span key={j} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">
                      {pkg}
                    </span>
                  ))}
                </div>
              )}
              {f.snippet && (
                <pre className="mt-3 text-[11px] text-emerald-300/70 font-mono bg-black/20 rounded-lg p-3 overflow-auto max-h-32 whitespace-pre-wrap">
                  {f.snippet}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}