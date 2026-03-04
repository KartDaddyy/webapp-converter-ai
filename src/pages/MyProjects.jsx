import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Smartphone, ArrowRight, Clock, Layers, Trash2 } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  analyzing: { label: "Analyzing", color: "bg-blue-100 text-blue-700" },
  generating: { label: "Generating", color: "bg-violet-100 text-violet-700" },
  preview: { label: "Preview", color: "bg-purple-100 text-purple-700" },
  building: { label: "Building", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
};

export default function MyProjects() {
  const navigate = useNavigate();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("-created_date", 50),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
            <p className="text-sm text-slate-500 mt-1">{projects.length} apps generated</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-50 rounded w-2/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-50 rounded-full w-20" />
                  <div className="h-6 bg-slate-50 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No projects yet</h3>
            <p className="text-sm text-slate-400 mb-6">Convert your first website into a mobile app</p>
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First App
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => {
              const status = statusConfig[project.status] || statusConfig.analyzing;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(createPageUrl("ProjectDashboard") + `?id=${project.id}`)}
                  className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                        {(project.name || "A")[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {project.analysis?.siteName || project.name || "Untitled"}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {project.url}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${status.color} text-[10px]`}>{status.label}</Badge>
                    {project.features?.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        <Layers className="w-3 h-3 mr-1" />
                        {project.features.length} features
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {project.created_date ? format(new Date(project.created_date), "MMM d, yyyy") : ""}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}