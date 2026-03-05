import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, CheckCircle2, XCircle, Clock, RefreshCw, ExternalLink, Download, GitBranch } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  finished: { label: "Build Finished!", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  failed: { label: "Build Failed", color: "text-red-500", bg: "bg-red-50 border-red-200", icon: XCircle },
  building: { label: "Building on Codemagic...", color: "text-blue-500", bg: "bg-blue-50 border-blue-200", icon: Loader2 },
  preparing: { label: "Preparing build...", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", icon: Clock },
  queued: { label: "Queued...", color: "text-slate-500", bg: "bg-slate-50 border-slate-200", icon: Clock },
};

export default function CodemagicPanel({ project }) {
  const [apps, setApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [buildId, setBuildId] = useState(null);
  const [buildStatus, setBuildStatus] = useState(null);
  const [artifacts, setArtifacts] = useState([]);
  const [error, setError] = useState(null);
  const [pushing, setPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    if (!buildId) return;
    pollRef.current = setInterval(() => pollBuild(buildId), 8000);
    return () => clearInterval(pollRef.current);
  }, [buildId]);

  const pollBuild = async (id) => {
    const res = await base44.functions.invoke("codemagicBuild", { action: "status", buildId: id });
    const data = res.data;
    const build = data?.build || data?.builds?.[0];
    if (!build) return;
    setBuildStatus(build.status);
    if (build.status === "finished") {
      clearInterval(pollRef.current);
      // Extract APK/AAB artifacts
      const arts = build.artefacts || build.artifacts || [];
      setArtifacts(arts);
    } else if (build.status === "failed" || build.status === "canceled") {
      clearInterval(pollRef.current);
    }
  };

  const loadApps = async () => {
    setLoadingApps(true);
    setError(null);
    const res = await base44.functions.invoke("codemagicBuild", { action: "listApps" });
    const data = res.data;
    if (data?.applications) {
      setApps(data.applications);
      if (data.applications.length > 0) {
        const app = data.applications[0];
        setSelectedApp(app);
        const workflows = Object.keys(app.workflows || {});
        if (workflows.length > 0) setSelectedWorkflow(workflows[0]);
      }
    } else {
      setError(data?.error || "Could not load apps. Check your API token.");
    }
    setLoadingApps(false);
  };

  const triggerBuild = async () => {
    if (!selectedApp || !selectedWorkflow) return;
    setTriggering(true);
    setBuildStatus(null);
    setArtifacts([]);
    setBuildId(null);
    setError(null);
    const res = await base44.functions.invoke("codemagicBuild", {
      action: "triggerBuild",
      appId: selectedApp._id,
      workflowId: selectedWorkflow
    });
    const data = res.data;
    if (data?.buildId) {
      setBuildId(data.buildId);
      setBuildStatus("queued");
    } else {
      setError(data?.error || "Failed to trigger build.");
    }
    setTriggering(false);
  };

  const pushToGitHub = async () => {
    if (!project?.flutter_code) {
      setError("No Flutter code generated yet.");
      return;
    }
    setPushing(true);
    setPushSuccess(false);
    setError(null);

    const appName = project.analysis?.siteName || project.name || "app";
    const safeAppName = appName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const code = project.flutter_code;

    const pubspec = `name: ${safeAppName}
description: Generated Flutter app from ${project.url}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`;

    const files = [
      { path: "lib/main.dart", content: code },
      { path: "pubspec.yaml", content: pubspec },
    ];

    // Detect owner/repo from selected app's repository URL
    let owner = "KartDaddyy";
    let repo = "webapp-converter-ai";
    if (selectedApp?.repository?.htmlUrl) {
      const match = selectedApp.repository.htmlUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
      if (match) { owner = match[1]; repo = match[2]; }
    }

    const res = await base44.functions.invoke("pushToGithub", { owner, repo, files });
    if (res.data?.success) {
      setPushSuccess(true);
    } else {
      setError(res.data?.error || "Failed to push to GitHub.");
    }
    setPushing(false);
  };

  const getPublicUrl = async (artifactUrl) => {
    const res = await base44.functions.invoke("codemagicBuild", { action: "publicUrl", artifactUrl });
    if (res.data?.url) {
      window.open(res.data.url, "_blank");
    }
  };

  const statusCfg = buildStatus ? (STATUS_CONFIG[buildStatus] || STATUS_CONFIG.queued) : null;
  const apkArtifacts = artifacts.filter(a => a.name?.endsWith(".apk") || a.name?.endsWith(".aab") || a.name?.endsWith(".ipa"));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Codemagic Cloud Build
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Trigger a real cloud build — get APK download link</p>
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
        <div className="text-xs text-slate-500 py-2 leading-relaxed">
          No apps found. First add your Flutter project at{" "}
          <a href="https://codemagic.io/apps" target="_blank" rel="noreferrer" className="text-blue-500 underline">codemagic.io/apps</a>, then come back and refresh.
        </div>
      ) : (
        <>
          {/* App selector */}
          <div className="space-y-1.5">
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
                setArtifacts([]);
              }}
            >
              {apps.map(app => (
                <option key={app._id} value={app._id}>{app.appName || app.repository?.name || app._id}</option>
              ))}
            </select>
          </div>

          {/* Workflow selector */}
          {selectedApp && Object.keys(selectedApp.workflows || {}).length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Workflow</label>
              <select
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                value={selectedWorkflow || ""}
                onChange={e => { setSelectedWorkflow(e.target.value); setBuildStatus(null); setBuildId(null); setArtifacts([]); }}
              >
                {Object.entries(selectedApp.workflows).map(([id, wf]) => (
                  <option key={id} value={id}>{wf.name || id}</option>
                ))}
              </select>
            </div>
          )}

          {/* Push to GitHub */}
          <Button
            onClick={pushToGitHub}
            disabled={pushing || !project?.flutter_code}
            variant="outline"
            className="w-full text-xs border-slate-300"
            size="sm"
          >
            {pushing ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Pushing to GitHub...</>
            ) : pushSuccess ? (
              <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />Pushed to GitHub!</>
            ) : (
              <><GitBranch className="w-3.5 h-3.5 mr-1.5" />Push Code to GitHub</>
            )}
          </Button>

          {/* Trigger button */}
          <Button
            onClick={triggerBuild}
            disabled={triggering || !selectedApp || !selectedWorkflow || ["queued", "preparing", "building"].includes(buildStatus)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold"
            size="sm"
          >
            {triggering ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Starting build...</>
            ) : (
              <><Zap className="w-3.5 h-3.5 mr-1.5" />Build APK on Codemagic</>
            )}
          </Button>

          {/* Build status */}
          {statusCfg && (
            <div className={`border rounded-xl px-4 py-3 ${statusCfg.bg}`}>
              <div className="flex items-center gap-2">
                <statusCfg.icon className={`w-4 h-4 ${statusCfg.color} ${["building", "preparing", "queued"].includes(buildStatus) ? "animate-spin" : ""}`} />
                <p className={`text-xs font-semibold ${statusCfg.color}`}>{statusCfg.label}</p>
                {buildId && (
                  <a
                    href={`https://codemagic.io/app/${selectedApp?._id}/build/${buildId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-slate-400 hover:text-slate-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Artifact download buttons */}
              {apkArtifacts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {apkArtifacts.map((art, i) => (
                    <Button
                      key={i}
                      onClick={() => getPublicUrl(art.url)}
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download {art.name}
                    </Button>
                  ))}
                </div>
              )}

              {buildStatus === "finished" && apkArtifacts.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">Build finished. Check Codemagic for artifacts.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}