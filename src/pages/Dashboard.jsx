import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AnalysisPanel from "@/components/dashboard/AnalysisPanel";
import PreviewPanel from "@/components/dashboard/PreviewPanel";
import CodePanel from "@/components/dashboard/CodePanel";
import BuildPanel from "@/components/dashboard/BuildPanel";
import AICommandBox from "@/components/dashboard/AICommandBox";
import ProjectHeader from "@/components/dashboard/ProjectHeader";

export default function Dashboard() {
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) loadProject(id);
  }, []);

  const loadProject = async (id) => {
    const p = await base44.entities.Project.get(id);
    setProject(p);
    if (p.status === "analyzing") {
      runAnalysis(p);
    }
  };

  const runAnalysis = async (p) => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the website at URL: ${p.url}

You are a mobile app architect. Analyze this website and return a detailed mobile app structure.

Return a JSON with:
{
  "app_name": "Clean app name from the website",
  "tagline": "Short app description",
  "primary_color": "#hexcolor (main brand color)",
  "secondary_color": "#hexcolor",
  "background_color": "#hexcolor",
  "pages": [
    {"name": "Page name", "type": "home|list|detail|form|settings", "description": "What this page shows", "nav_icon": "icon name like home|search|person|settings|favorite"}
  ],
  "nav_items": [
    {"label": "Tab label", "icon": "icon name", "page": "page name"}
  ],
  "drawer_items": [
    {"label": "Menu item", "icon": "icon name"}
  ],
  "features_detected": ["list of detected features like auth, search, cart, etc"],
  "ui_components": ["bottom_nav", "drawer", "cards", "forms", "etc"],
  "screens": [
    {"name": "Screen name", "type": "splash|home|list|detail|form|profile|settings", "description": "Screen description"}
  ]
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            app_name: { type: "string" },
            tagline: { type: "string" },
            primary_color: { type: "string" },
            secondary_color: { type: "string" },
            background_color: { type: "string" },
            pages: { type: "array", items: { type: "object" } },
            nav_items: { type: "array", items: { type: "object" } },
            drawer_items: { type: "array", items: { type: "object" } },
            features_detected: { type: "array", items: { type: "string" } },
            ui_components: { type: "array", items: { type: "string" } },
            screens: { type: "array", items: { type: "object" } }
          }
        }
      });

      const flutterCode = await generateFlutterCode(p.url, result);

      const updated = await base44.entities.Project.update(p.id, {
        status: "preview",
        name: result.app_name || p.name,
        analysis: result,
        screens: result.screens || [],
        flutter_code: flutterCode,
        color_scheme: {
          primary: result.primary_color,
          secondary: result.secondary_color,
          background: result.background_color
        }
      });
      setProject(updated);
    } catch (e) {
      console.error(e);
      await base44.entities.Project.update(p.id, { status: "failed" });
    }
    setAnalyzing(false);
  };

  const generateFlutterCode = async (url, analysis) => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a complete Flutter main.dart file for a mobile app based on this website: ${url}

App analysis:
${JSON.stringify(analysis, null, 2)}

Generate a complete, production-ready Flutter app with:
1. Proper MaterialApp setup with theme using colors: primary=${analysis.primary_color}, secondary=${analysis.secondary_color}
2. Splash screen
3. Bottom navigation bar with ${(analysis.nav_items || []).slice(0, 5).map(n => n.label).join(", ")} tabs
4. Drawer navigation with menu items
5. Multiple screen widgets (one per page)
6. Proper routing with named routes
7. Modern Material 3 design
8. Loading states and error handling

Return ONLY the complete Dart code, no explanation.`,
    });
    return typeof result === "string" ? result : result?.text || "// Flutter code generation in progress...";
  };

  const handleAICommand = async (command) => {
    if (!project) return;
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Flutter developer. The user wants to add a feature to their app.

Current app: ${project.name} (converted from ${project.url})
Current features: ${(project.features || []).map(f => f.name).join(", ")}
Current Flutter code snippet (first 500 chars): ${(project.flutter_code || "").substring(0, 500)}

User command: "${command}"

Analyze this command and return:
{
  "feature_name": "Short feature name",
  "description": "What was added/modified",
  "code_changes": "Description of Flutter code changes needed",
  "packages_needed": ["list of pub.dev packages"],
  "updated_code_snippet": "Key Flutter code snippet showing the feature implementation (just the relevant part, ~30 lines)"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          feature_name: { type: "string" },
          description: { type: "string" },
          code_changes: { type: "string" },
          packages_needed: { type: "array", items: { type: "string" } },
          updated_code_snippet: { type: "string" }
        }
      }
    });

    const newFeature = {
      name: result.feature_name,
      description: result.description,
      code_changes: result.code_changes,
      packages: result.packages_needed,
      snippet: result.updated_code_snippet,
      status: "added",
      added_at: new Date().toISOString()
    };

    const updatedFeatures = [...(project.features || []), newFeature];
    const updated = await base44.entities.Project.update(project.id, {
      features: updatedFeatures,
      flutter_code: (project.flutter_code || "") + "\n\n// === " + result.feature_name + " ===\n" + (result.updated_code_snippet || "")
    });
    setProject(updated);
    return result;
  };

  const handleBuild = async (type) => {
    const buildStatus = { ...(project.build_status || {}) };
    buildStatus[type] = "building";
    setProject(prev => ({ ...prev, build_status: buildStatus }));
    await base44.entities.Project.update(project.id, { build_status: buildStatus, status: "building" });

    await new Promise(r => setTimeout(r, 3000));

    buildStatus[type] = "ready";
    const updated = await base44.entities.Project.update(project.id, {
      build_status: buildStatus,
      status: "completed"
    });
    setProject(updated);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <ProjectHeader project={project} analyzing={analyzing} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 border-r border-white/[0.06] flex flex-col bg-[#0c0d0f] overflow-y-auto">
          <AnalysisPanel project={project} analyzing={analyzing} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-6 bg-[#0a0b0c]">
            {["preview", "code", "build"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 mr-1 ${
                  activeTab === tab
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-white/35 hover:text-white/60"
                }`}
              >
                {tab === "preview" ? "Mobile Preview" : tab === "code" ? "Flutter Code" : "Build & Download"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "preview" && <PreviewPanel project={project} analyzing={analyzing} />}
            {activeTab === "code" && <CodePanel project={project} />}
            {activeTab === "build" && <BuildPanel project={project} onBuild={handleBuild} />}
          </div>
        </div>

        {/* Right sidebar - AI Command */}
        <div className="w-80 border-l border-white/[0.06] bg-[#0c0d0f] flex flex-col">
          <AICommandBox project={project} onCommand={handleAICommand} />
        </div>
      </div>
    </div>
  );
}