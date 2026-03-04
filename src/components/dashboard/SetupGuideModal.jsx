import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Terminal, ExternalLink, FolderOpen, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ExternalLink,
    title: "Install Flutter SDK",
    color: "bg-blue-100 text-blue-600",
    content: (
      <span>
        Download and install Flutter from{" "}
        <a
          href="https://flutter.dev/docs/get-started/install"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-700"
        >
          flutter.dev
        </a>
        . Follow the platform-specific instructions for Windows, macOS, or Linux.
      </span>
    ),
  },
  {
    icon: FolderOpen,
    title: "Extract the ZIP",
    color: "bg-violet-100 text-violet-600",
    content: "Unzip the downloaded file to a folder of your choice. Inside you'll find the complete Flutter project.",
  },
  {
    icon: Terminal,
    title: "Get dependencies",
    color: "bg-amber-100 text-amber-600",
    content: (
      <span>
        Open a terminal inside the project folder and run:
        <code className="block mt-1 bg-slate-900 text-green-400 rounded-lg px-3 py-2 text-xs font-mono">
          flutter pub get
        </code>
      </span>
    ),
  },
  {
    icon: Smartphone,
    title: "Build or Run",
    color: "bg-emerald-100 text-emerald-600",
    content: (
      <span>
        Connect an Android device (enable USB debugging) or start an emulator, then:
        <code className="block mt-1 bg-slate-900 text-green-400 rounded-lg px-3 py-2 text-xs font-mono whitespace-pre">{`# Run on device/emulator
flutter run

# Build release APK
flutter build apk --release
# → build/app/outputs/flutter-apk/app-release.apk`}</code>
      </span>
    ),
  },
];

export default function SetupGuideModal({ open, onClose, appName }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Flutter Project Downloaded!
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-500 mt-1 mb-4">
          Your Flutter project <span className="font-medium text-slate-700">"{appName}"</span> has been downloaded as a ZIP. Follow these steps to build and run it.
        </p>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${step.color}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 mt-2 min-h-[16px]" />
                )}
              </div>
              <div className="pb-4 flex-1">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  <span className="text-slate-400 mr-1.5">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{step.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
          <span className="font-semibold">Tip:</span> Want to skip local setup?{" "}
          <a
            href="https://flutlab.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-800"
          >
            FlutLab.io
          </a>{" "}
          lets you build and run Flutter apps entirely in the browser — just upload your project.
        </div>

        <Button onClick={onClose} className="w-full mt-4 bg-slate-900 hover:bg-slate-800">
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
}