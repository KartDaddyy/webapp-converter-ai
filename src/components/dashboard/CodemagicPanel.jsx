import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, CheckCircle2, XCircle, Clock, RefreshCw, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  finished: { label: "Finished", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
  building: { label: "Building...", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Loader2 },
  preparing: { label: "Preparing", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  queued: { label: "Queued", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", icon: Clock },
};

export default function CodemagicPanel() {
  const [apps, setApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [buildId, setBuildId] = useState(null);
  const [buildStatus, setBuildStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApps();
  }, []);

  // Poll build status
  useEffect(() => {
    if (!buildId) return;
    const interval = setInterval(async () => {
      const res = await base44.functions.invoke("codemagicBuild", { action: "status", buildId });
      const data = res.data;
      if (data?.build) {
        setBuildStatus(data.build);
        if (["finished", "failed", "canceled"].includes(data.build.status)) {
          clearInterval(interval);
        }
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [buildId]);

  const loadApps = async () => {
    setLoadingApps(true);
    setError(null);
    const res = await base44.functions.invoke("codemagicBuild", { action: "listApps" });
    const data = res.data;
    if (data?.applications) {
      setApps(data.applications);
      if (data.applications.length > 0) {
        setSelectedApp(data.applications[0]);
        const workflows = Object.keys(data.applications[0].workflows || {});
        if (workflows.length > 0) setSelectedWorkflow(workflows[0]);
      }
    } else {
      setError(data?.error || "Could not load Codemagic apps. Make sure your API token is correct.");
    }
    setLoadingApps(false);
  };

  const triggerBuild = async () => {
    if (!selectedApp || !selectedWorkflow) return;
    setTriggering(true);
    setBuildStatus(null);
    setError(null);
    const res = await base44.functions.invoke("codemagicBuild", {
      action: "triggerBuild",
      appId: selectedApp._id,
      workflowId: selectedWorkflow
    });
    const data = res.data;
    if (data?.buildId) {
      setBuildId(data.buildId);
      setBuildStatus({ status: "queued" });
    } else {
      setError(data?.error || "Failed to trigger build.");
    }
    setTriggering(false);
  };

  const statusCfg = buildStatus ? (STATUS_CONFIG[buildStatus.status] || STATUS_CONFIG.queued) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Codemagic CI/CD
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Trigger cloud builds on Codemagic</p>
        </div>
        <Button variant="ghost" size="icon" onClick={loadApps} disabled={loadingApps} className="h-7 w-7">
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loadingApps ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">{error}</div>
      )}

      {loadingApps ? (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Loading your Codemagic apps...
        </div>
      ) : apps.length === 0 && !error ? (
        <div className="text-xs text-slate-400 py-2">
          No apps found on Codemagic. Add your Flutter project at{" "}
          <a href="https://codemagic.io/apps" target="_blank" rel="noreferrer" className="text-blue-500 underline">codemagic.io/apps</a>.
        </div>
      ) : (
        <>
          {/* App selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600">App</label>
            <select
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={selectedApp?._id || ""}
              onChange={e => {
                const app = apps.find(a => a._id === e.target.value);
                setSelectedApp(app);
                const workflows = Object.keys(app?.workflows || {});
                setSelectedWorkflow(workflows[0] || null);
                setBuildStatus(null);
                setBuildId(null);
              }}
            >
              {apps.map(app => (
                <option key={app._id} value={app._id}>{app.appName || app.repository?.name || app._id}</option>
              ))}
            </select>
          </div>

          {/* Workflow selector */}
          {selectedApp && Object.keys(selectedApp.workflows || {}).length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">Workflow</label>
              <select
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                value={selectedWorkflow || ""}
                onChange={e => { setSelectedWorkflow(e.target.value); setBuildStatus(null); setBuildId(null); }}
              >
                {Object.entries(selectedApp.workflows).map(([id, wf]) => (
                  <option key={id} value={id}>{wf.name || id}</option>
                ))}
              </select>
            </div>
          )}

          {/* Trigger button */}
          <Button
            onClick={triggerBuild}
            disabled={triggering || !selectedApp || !selectedWorkflow}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white text-xs"
            size="sm"
          >
            {triggering ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Triggering...</>
            ) : (
              <><Zap className="w-3.5 h-3.5 mr-1.5" />Trigger Build</>
            )}
          </Button>

          {/* Build status */}
          {buildStatus && statusCfg && (
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 ${statusCfg.bg}`}>
              <statusCfg.icon className={`w-4 h-4 ${statusCfg.color} ${buildStatus.status === "building" ? "animate-spin" : ""}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</p>
                {buildStatus.id && (
                  <p className="text-[10px] text-slate-400 font-mono truncate">ID: {buildStatus.id || buildId}</p>
                )}
              </div>
              {buildId && (
                <a
                  href={`https://codemagic.io/app/${selectedApp?._id}/build/${buildId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}