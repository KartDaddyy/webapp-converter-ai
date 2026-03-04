import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import AnalysisProgress from "@/components/dashboard/AnalysisProgress";
import AnalysisResults from "@/components/dashboard/AnalysisResults";
import MobilePreview from "@/components/dashboard/MobilePreview";
import AICommandBox from "@/components/dashboard/AICommandBox";
import BuildPanel from "@/components/dashboard/BuildPanel";
import CodeViewer from "@/components/dashboard/CodeViewer";

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isCommandProcessing, setIsCommandProcessing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    const projects = await base44.entities.Project.filter({ id: projectId });
    if (projects.length > 0) {
      setProject(projects[0]);
      if (projects[0].status !== "analyzing") {
        setIsAnalyzing(false);
      }
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Simulate analysis with AI
  useEffect(() => {
    if (!project || project.status !== "analyzing") return;

    const runAnalysis = async () => {
      // Step through analysis phases
      for (let i = 0; i < 5; i++) {
        setAnalysisStep(i);
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
      }

      // Call AI to analyze the website
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website URL for mobile app conversion: ${project.url}
        
Provide a detailed analysis of:
1. The likely site name and description
2. How many pages it probably has
3. Navigation items (main menu items)
4. Estimate of forms, buttons, images, external links
5. Color scheme (provide 4-6 hex color codes that would suit the site)
6. What screens the mobile app should have (4-6 screens)

Be creative and realistic based on the URL/domain.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            siteName: { type: "string" },
            description: { type: "string" },
            pageCount: { type: "number" },
            navItems: { type: "array", items: { type: "string" } },
            formCount: { type: "number" },
            buttonCount: { type: "number" },
            imageCount: { type: "number" },
            linkCount: { type: "number" },
            colors: { type: "array", items: { type: "string" } },
            screens: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Generate Flutter code
      const codeResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a complete Flutter main.dart file for a mobile app converting the website "${project.url}".

Site name: ${result.siteName}
Screens: ${JSON.stringify(result.screens)}
Nav items: ${JSON.stringify(result.navItems)}
Colors: ${JSON.stringify(result.colors)}

Generate a complete, compilable Flutter app with:
- MaterialApp with theme using the extracted colors
- Bottom navigation bar
- Drawer menu
- Home screen with cards/lists
- Proper routing
- Splash screen
- Modern Material 3 design

Return ONLY the dart code, no markdown.`,
        response_json_schema: {
          type: "object",
          properties: {
            code: { type: "string" }
          }
        }
      });

      // Update project
      await base44.entities.Project.update(project.id, {
        status: "preview",
        analysis: result,
        flutter_code: codeResult.code,
        screens: result.screens,
        color_scheme: {
          primary: result.colors?.[0] || "#3b82f6",
          secondary: result.colors?.[1] || "#8b5cf6",
          accent: result.colors?.[2] || "#ec4899"
        }
      });

      await loadProject();
      setIsAnalyzing(false);
    };

    runAnalysis();
  }, [project?.id, project?.status]);

  // Handle AI commands
  const handleCommand = async (command) => {
    setIsCommandProcessing(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI assistant for a mobile app generator. The user wants to add this feature to their Flutter app:

Command: "${command}"

Current app: ${project?.analysis?.siteName || project?.url}
Current features: ${JSON.stringify(project?.features || [])}

Respond with:
1. A short feature name
2. What Flutter packages/code changes would be needed
3. Updated status`,
      response_json_schema: {
        type: "object",
        properties: {
          featureName: { type: "string" },
          description: { type: "string" },
          packages: { type: "array", items: { type: "string" } },
          status: { type: "string" }
        }
      }
    });

    const updatedFeatures = [
      ...(project.features || []),
      {
        name: result.featureName,
        status: "added",
        added_at: new Date().toISOString()
      }
    ];

    await base44.entities.Project.update(project.id, {
      features: updatedFeatures
    });

    await loadProject();
    setIsCommandProcessing(false);
  };

  // Handle build
  const handleBuild = async () => {
    setIsBuilding(true);

    await base44.entities.Project.update(project.id, {
      build_status: {
        apk: "building",
        aab: "building",
        ios: "building",
        source: "building"
      }
    });
    await loadProject();

    // Simulate build steps
    const buildSteps = ["apk", "aab", "ios", "source"];
    for (const step of buildSteps) {
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));
      const currentStatus = { ...(project.build_status || {}) };
      currentStatus[step] = "completed";
      for (const next of buildSteps) {
        if (!currentStatus[next]) currentStatus[next] = "building";
      }
      await base44.entities.Project.update(project.id, {
        build_status: currentStatus,
        status: "building"
      });
      await loadProject();
    }

    await base44.entities.Project.update(project.id, {
      status: "completed",
      build_status: { apk: "completed", aab: "completed", ios: "completed", source: "completed" }
    });
    await loadProject();
    setIsBuilding(false);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(createPageUrl("Home"))}
              className="rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                {project.analysis?.siteName || project.name || "Project"}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {project.url}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              project.status === "completed" ? "bg-emerald-100 text-emerald-700" :
              project.status === "analyzing" ? "bg-blue-100 text-blue-700" :
              project.status === "building" ? "bg-amber-100 text-amber-700" :
              "bg-violet-100 text-violet-700"
            }`}>
              {project.status === "analyzing" ? "Analyzing..." :
               project.status === "generating" ? "Generating..." :
               project.status === "building" ? "Building..." :
               project.status === "completed" ? "Completed" :
               "Preview Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Your Website</h2>
              <p className="text-slate-500 mb-8">Our AI is scanning {project.url}</p>
              <AnalysisProgress currentStep={analysisStep} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left: Analysis + Commands + Build */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <AnalysisResults analysis={project.analysis} />
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <AICommandBox
                    onCommand={handleCommand}
                    isProcessing={isCommandProcessing}
                    features={project.features || []}
                  />
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <BuildPanel
                    project={project}
                    onBuild={handleBuild}
                    isBuilding={isBuilding}
                  />
                </div>
              </div>

              {/* Center: Mobile Preview */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="sticky top-24">
                  <MobilePreview project={project} />
                </div>
              </div>

              {/* Right: Code viewer */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
                  <CodeViewer code={project.flutter_code} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}