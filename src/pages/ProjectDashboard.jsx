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
      const screenNames = (result.screens || []).map(s => s.name).join(", ");
      const primaryColor = (result.colors?.[0] || "#3b82f6").replace("#", "0xFF");
      const secondaryColor = (result.colors?.[1] || "#8b5cf6").replace("#", "0xFF");

      const codeResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert Flutter developer. Generate a complete, syntactically correct Flutter main.dart file for a mobile app based on this website: "${project.url}"

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

Generate the complete file now:`,
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

  // Handle build — simulates build then auto-downloads the Flutter source
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

    // Generate a downloadable Flutter project ZIP
    const code = project.flutter_code || "// No code generated yet";
    const appName = project.analysis?.siteName || project.name || "app";
    const safeAppName = appName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const packageName = `com.example.${safeAppName}`;

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

    const androidManifest = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="${appName}"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>`;

    const readme = `# ${appName} - Flutter App

Generated by WebApp Converter AI from: ${project.url}

## How to build & install on Android:

### Prerequisites
1. Install Flutter: https://flutter.dev/docs/get-started/install
2. Connect your Android device (enable USB debugging) or start an emulator

### Steps to build APK:
\`\`\`bash
# 1. Extract this ZIP and open a terminal in the folder
cd ${safeAppName}

# 2. Get dependencies
flutter pub get

# 3. Build the APK
flutter build apk --release

# 4. The APK will be at:
# build/app/outputs/flutter-apk/app-release.apk

# 5. Install directly on connected Android device:
flutter install
\`\`\`

### Or run directly on device/emulator:
\`\`\`bash
flutter run
\`\`\`
`;

    // Build a ZIP file using JSZip-style manual approach (plain zip via data URI)
    // We'll create a simple tar-like structure as a ZIP using raw bytes
    const files = {
      [`${safeAppName}/lib/main.dart`]: code,
      [`${safeAppName}/pubspec.yaml`]: pubspec,
      [`${safeAppName}/android/app/src/main/AndroidManifest.xml`]: androidManifest,
      [`${safeAppName}/README.md`]: readme,
    };

    // Create a text-based bundle since we can't compile real APKs in browser
    // Download as a zip by creating individual files concatenated with clear separators
    const bundleContent = Object.entries(files)
      .map(([path, content]) => `${"=".repeat(60)}\nFILE: ${path}\n${"=".repeat(60)}\n${content}`)
      .join("\n\n");

    const blob = new Blob([bundleContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeAppName}_flutter_project.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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