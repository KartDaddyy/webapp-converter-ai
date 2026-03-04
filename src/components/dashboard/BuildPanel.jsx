import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2, Package, Smartphone, Code2, Apple } from "lucide-react";

const buildTypes = [
  {
    id: "apk",
    label: "Android APK",
    desc: "Direct install on Android devices",
    icon: Smartphone,
    color: "from-green-600 to-emerald-600",
    glow: "shadow-emerald-500/20",
    cmd: "flutter build apk --release",
    ext: "apk"
  },
  {
    id: "aab",
    label: "Android AAB",
    desc: "Google Play Store upload bundle",
    icon: Package,
    color: "from-blue-600 to-cyan-600",
    glow: "shadow-blue-500/20",
    cmd: "flutter build appbundle --release",
    ext: "aab"
  },
  {
    id: "ios",
    label: "iOS / Xcode",
    desc: "Xcode project for App Store",
    icon: Apple,
    color: "from-gray-600 to-slate-600",
    glow: "shadow-slate-500/20",
    cmd: "flutter build ios --release",
    ext: "zip"
  },
  {
    id: "source",
    label: "Flutter Source",
    desc: "Complete Flutter project source",
    icon: Code2,
    color: "from-violet-600 to-fuchsia-600",
    glow: "shadow-violet-500/20",
    cmd: "Full project zip",
    ext: "zip"
  },
];

export default function BuildPanel({ project, onBuild }) {
  const buildStatus = project.build_status || {};

  const handleDownloadSource = () => {
    const code = project.flutter_code || "// No code generated yet";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name || "app"}_flutter_source.dart`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Build & Download</h2>
        <p className="text-sm text-slate-500">Compile your app for distribution or development</p>
      </div>

      {/* Build cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {buildTypes.map(bt => {
          const status = buildStatus[bt.id];
          const isBuilding = status === "building";
          const isReady = status === "ready";

          return (
            <div
              key={bt.id}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bt.color} flex items-center justify-center shadow-lg ${bt.glow}`}>
                  <bt.icon className="w-5 h-5 text-white" />
                </div>
                {isReady && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white mb-1">{bt.label}</p>
              <p className="text-xs text-white/30 mb-1">{bt.desc}</p>
              <p className="text-[10px] text-white/20 font-mono mb-4">{bt.cmd}</p>

              {bt.id === "source" ? (
                <Button
                  onClick={handleDownloadSource}
                  size="sm"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download Source
                </Button>
              ) : isReady ? (
                <Button
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download .{bt.ext}
                </Button>
              ) : (
                <Button
                  onClick={() => onBuild(bt.id)}
                  disabled={isBuilding || project.status === "analyzing"}
                  size="sm"
                  variant="outline"
                  className="w-full border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-xs"
                >
                  {isBuilding ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Building...
                    </>
                  ) : (
                    "Build Now"
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Build note */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
        <p className="text-xs text-amber-300/70 leading-relaxed">
          <span className="font-semibold text-amber-300">Note:</span> APK/AAB builds are simulated in this environment. Download the Flutter Source Code and run <span className="font-mono bg-black/20 px-1 rounded">flutter build apk</span> locally to generate real builds.
        </p>
      </div>
    </div>
  );
}