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

      // Generate code based on framework
      const screenNames = (result.screens || []).map(s => s.name).join(", ");
      const primaryColor = (result.colors?.[0] || "#3b82f6").replace("#", "0xFF");
      const isRN = project.framework === "react_native";

      const codeResult = await base44.integrations.Core.InvokeLLM({
        prompt: isRN
          ? `You are an expert React Native developer. Generate a complete, single-file React Native App.tsx for a mobile app based on this website: "${project.url}"

Website name: ${result.siteName}
Description: ${result.description}
Navigation items: ${JSON.stringify(result.navItems || [])}
Screens to create: ${screenNames}
Primary color: ${result.colors?.[0] || "#3b82f6"}
Secondary color: ${result.colors?.[1] || "#8b5cf6"}

STRICT REQUIREMENTS:
1. Use only React Native core components: View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList
2. Implement a bottom tab navigation using a simple custom tab bar (no react-navigation package)
3. Create ${Math.min((result.screens || []).length, 4)} screen components with realistic placeholder content matching each screen's purpose
4. Use StyleSheet.create for all styles
5. Primary color: ${result.colors?.[0] || "#3b82f6"}
6. App name: "${result.siteName}"
7. Export default App component
8. Return ONLY valid TypeScript/JSX code with NO markdown, NO backticks, NO explanations - just raw .tsx file content starting with "import React"
9. Do NOT use any packages except react and react-native

Generate the complete App.tsx now:`
          : `You are an expert Flutter developer. Generate a complete, syntactically correct Flutter main.dart file for a mobile app based on this website: "${project.url}"

Website name: ${result.siteName}
Description: ${result.description}
Navigation items: ${JSON.stringify(result.navItems || [])}
Screens to create: ${screenNames}
Primary color hex: ${result.colors?.[0] || "#3b82f6"}
Secondary color hex: ${result.colors?.[1] || "#8b5cf6"}

STRICT REQUIREMENTS - follow exactly:
1. Start with: import 'package:flutter/material.dart';
2. The main() function must be: void main() { runApp(const MyApp()); }
3. MyApp must be a StatelessWidget returning MaterialApp
4. Use MaterialApp with theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Color(${primaryColor})), useMaterial3: true)
5. Create a MainScreen StatefulWidget with BottomNavigationBar
6. Create ${Math.min((result.screens || []).length, 4)} screen widgets as separate StatelessWidget classes
7. Each screen should have a Scaffold with AppBar and a ListView or Column with realistic placeholder content (Cards, ListTiles, etc.) that matches what that screen would show
8. The app title should be: "${result.siteName}"
9. Use proper Dart syntax: no trailing commas errors, all brackets matched, all classes properly closed
10. Do NOT use any external packages - only flutter/material.dart
11. Return ONLY valid Dart code with NO markdown, NO \`\`\`, NO explanations - just the raw .dart file content starting with "import 'package:flutter/material.dart';"
12. CRITICAL: In Dart string literals, NEVER use bare dollar signs like \$10 or \$30. Always escape them as \\\$10 or use concatenation. Dollar signs in strings MUST be escaped with a backslash.

Generate the complete file now:`,
        response_json_schema: {
          type: "object",
          properties: {
            code: { type: "string" }
          }
        }
      });

      // Update project
      const updateData = {
        status: "preview",
        analysis: result,
        screens: result.screens,
        color_scheme: {
          primary: result.colors?.[0] || "#3b82f6",
          secondary: result.colors?.[1] || "#8b5cf6",
          accent: result.colors?.[2] || "#ec4899"
        }
      };
      if (isRN) {
        updateData.react_native_code = codeResult.code;
      } else {
        updateData.flutter_code = codeResult.code;
      }
      await base44.entities.Project.update(project.id, updateData);

      await loadProject();
      setIsAnalyzing(false);
    };

    runAnalysis();
  }, [project?.id, project?.status]);

  // Handle AI commands — updates Flutter code with the new feature
  const handleCommand = async (command) => {
    setIsCommandProcessing(true);

    // Step 1: Determine feature details
    const featureResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI assistant for a mobile app generator. The user wants to add this feature to their Flutter app:

Command: "${command}"

Current app: ${project?.analysis?.siteName || project?.url}

Respond with:
1. A short feature name
2. A description of what will be added
3. What Flutter packages would be needed`,
      response_json_schema: {
        type: "object",
        properties: {
          feature_name: { type: "string" },
          description: { type: "string" },
          packages_needed: { type: "array", items: { type: "string" } }
        }
      }
    });

    // Step 2: Update the code to include the feature
    const isRN = project.framework === "react_native";
    const currentCode = isRN ? (project.react_native_code || "") : (project.flutter_code || "");

    const codeResult = await base44.integrations.Core.InvokeLLM({
      prompt: isRN
        ? `You are an expert React Native developer. Update the following React Native App.tsx code to add this feature: "${command}"

Feature details: ${featureResult.description}

CURRENT CODE:
${currentCode}

REQUIREMENTS:
- Add the feature using only react-native core components
- Keep all existing screens and functionality intact
- Return ONLY valid TypeScript/JSX code with NO markdown, NO backticks, NO explanations`
        : `You are an expert Flutter developer. Update the following Flutter main.dart code to add this feature: "${command}"

Feature details: ${featureResult.description}

CURRENT CODE:
${currentCode}

REQUIREMENTS:
- Add the feature in a realistic way using only flutter/material.dart (no external packages unless absolutely necessary for the feature)
- Keep all existing screens and functionality intact
- If the feature requires a new screen or dialog, add it
- Return ONLY valid Dart code with NO markdown, NO \`\`\`, NO explanations — just the raw .dart file content
- CRITICAL: In Dart string literals, escape all dollar signs as \\\$ (e.g. write \\\$10 not \$10, write \\\$30 not \$30)`,
      response_json_schema: {
        type: "object",
        properties: {
          code: { type: "string" }
        }
      }
    });

    const updatedFeatures = [
      ...(project.features || []),
      {
        name: featureResult.feature_name,
        status: "added",
        added_at: new Date().toISOString()
      }
    ];

    const updatePayload = { features: updatedFeatures };
    if (isRN) {
      updatePayload.react_native_code = codeResult.code;
    } else {
      updatePayload.flutter_code = codeResult.code;
    }
    await base44.entities.Project.update(project.id, updatePayload);

    await loadProject();
    setIsCommandProcessing(false);
    return featureResult;
  };

  // Handle build — simulates build progress only (download handled in BuildPanel)
  const handleBuild = async (buildType) => {
    setIsBuilding(true);

    const currentBuildStatus = { ...(project.build_status || {}) };
    currentBuildStatus[buildType] = "building";
    await base44.entities.Project.update(project.id, {
      build_status: currentBuildStatus,
      status: "building"
    });
    await loadProject();

    // Simulate build time
    await new Promise(r => setTimeout(r, 2500 + Math.random() * 1500));

    // Mark as ready
    currentBuildStatus[buildType] = "ready";
    await base44.entities.Project.update(project.id, {
      build_status: currentBuildStatus,
      status: "preview"
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
                    project={project}
                    onCommand={handleCommand}
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