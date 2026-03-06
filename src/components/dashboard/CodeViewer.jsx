import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileCode2, ChevronDown, ChevronUp } from "lucide-react";

export default function CodeViewer({ code, rnCode, framework = "flutter" }) {
  const activeCode = framework === "react_native" ? rnCode : code;
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    if (activeCode) {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!activeCode) return null;

  const displayCode = expanded ? activeCode : activeCode.slice(0, 1500) + (activeCode.length > 1500 ? "\n\n// ... (click expand to see full code)" : "");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-cyan-500" />
          Generated Flutter Code
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="text-xs h-7"
          >
            {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-xs rounded-lg h-7"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
        <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-slate-300 font-mono max-h-[400px] overflow-y-auto">
          <code>{displayCode}</code>
        </pre>
      </div>
    </div>
  );
}