import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Hammer, Package, FileCode2, Apple, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function BuildItem({ icon: Icon, label, format, status, onDownload }) {
  const statusMap = {
    idle: { color: "bg-slate-100 text-slate-500", label: "Ready" },
    building: { color: "bg-amber-100 text-amber-700", label: "Building..." },
    completed: { color: "bg-emerald-100 text-emerald-700", label: "Ready" },
    failed: { color: "bg-red-100 text-red-700", label: "Failed" },
  };

  const st = statusMap[status] || statusMap.idle;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-400">{format}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`${st.color} text-[10px] font-medium`}>{st.label}</Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={onDownload}
          disabled={status !== "completed"}
          className="rounded-lg h-8 px-3 text-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}

export default function BuildPanel({ project, onBuild, isBuilding }) {
  const buildStatus = project?.build_status || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Hammer className="w-4 h-4 text-orange-500" />
            Build & Download
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">Generate production builds for your app</p>
        </div>
        <Button
          onClick={onBuild}
          disabled={isBuilding}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/20"
        >
          {isBuilding ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Building...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              Build App
            </span>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <BuildItem
          icon={Package}
          label="Android APK"
          format=".apk (Debug)"
          status={buildStatus.apk || "idle"}
          onDownload={() => {}}
        />
        <BuildItem
          icon={Package}
          label="Android App Bundle"
          format=".aab (Release)"
          status={buildStatus.aab || "idle"}
          onDownload={() => {}}
        />
        <BuildItem
          icon={Apple}
          label="iOS Build"
          format="Xcode Project"
          status={buildStatus.ios || "idle"}
          onDownload={() => {}}
        />
        <BuildItem
          icon={FileCode2}
          label="Flutter Source Code"
          format=".zip"
          status={buildStatus.source || "idle"}
          onDownload={() => {}}
        />
      </div>
    </div>
  );
}