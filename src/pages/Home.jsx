import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import HeroSection from "@/components/landing/HeroSection";
import { Smartphone, Code2, Zap, Shield, ArrowRight, Globe, Layers, Cpu } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Website Analysis",
    description: "AI scans your entire website structure, navigation, forms, and assets automatically.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Native Mobile UI",
    description: "Not a WebView wrapper — we generate true native mobile components and layouts.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Code2,
    title: "Flutter Source Code",
    description: "Get production-ready Flutter code with proper architecture and best practices.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "AI Commands",
    description: "Add features like push notifications, login, or dark mode with simple text commands.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Layers,
    title: "Cross Platform",
    description: "Generate Android APK, AAB bundles, and iOS-ready Xcode projects from one source.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Secure & Clean",
    description: "External scripts are sanitized, code is secure, and follows mobile best practices.",
    color: "from-slate-500 to-slate-700",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitUrl = async (url) => {
    setIsLoading(true);
    const project = await base44.entities.Project.create({
      url,
      name: new URL(url).hostname.replace("www.", ""),
      status: "analyzing",
    });
    navigate(createPageUrl("ProjectDashboard") + `?id=${project.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection onSubmitUrl={handleSubmitUrl} isLoading={isLoading} />

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            From website URL to production mobile app in three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-24">
          {[
            { step: "01", title: "Paste URL", desc: "Enter your website address" },
            { step: "02", title: "AI Converts", desc: "We analyze and redesign for mobile" },
            { step: "03", title: "Download App", desc: "Get APK, AAB, or source code" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg shadow-blue-500/20">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
              </div>
              {i < 2 && (
                <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block mx-4" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}