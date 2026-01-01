"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, Globe, ExternalLink } from "lucide-react";

interface Project {
    id: string;
    name: string;
    domain: string;
    isActive: boolean;
    createdAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects");
            const data = await response.json();
            if (data.projects) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#e4e4e7]">Projects</h1>
                        <p className="text-sm text-[#6b6b75] mt-1">Manage your tracked websites</p>
                    </div>
                </div>
                <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-8 flex items-center justify-center">
                    <div className="text-[#6b6b75]">Loading...</div>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#e4e4e7]">Projects</h1>
                        <p className="text-sm text-[#6b6b75] mt-1">Manage your tracked websites</p>
                    </div>
                </div>

                <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                    <div className="flex flex-col items-center justify-center text-center py-20 px-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center mb-6">
                            <FolderKanban className="w-8 h-8 text-[#b39ddb]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#e4e4e7] mb-2">No projects yet</h3>
                        <p className="text-sm text-[#6b6b75] max-w-md mb-8">
                            Create your first project to start tracking page views, clicks, and other events on your website.
                        </p>
                        <Link href="/projects/new">
                            <Button size="lg">
                                <Plus className="w-4 h-4" />
                                Create your first project
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#e4e4e7]">Projects</h1>
                    <p className="text-sm text-[#6b6b75] mt-1">Manage your tracked websites</p>
                </div>
                <Link href="/projects/new">
                    <Button>
                        <Plus className="w-4 h-4" />
                        New Project
                    </Button>
                </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-5 hover:border-[#2a2a32] transition-all duration-150 group cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#7c5eb3]/10 border border-[#7c5eb3]/20 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-[#b39ddb]" />
                                </div>
                                <div className={`px-2 py-0.5 rounded text-xs font-medium ${project.isActive
                                        ? "bg-[#1a3a2a] text-[#6fcf97] border border-[#2a4a3a]"
                                        : "bg-[#3d2020] text-[#f87171] border border-[#5c3030]"
                                    }`}>
                                    {project.isActive ? "Active" : "Paused"}
                                </div>
                            </div>

                            <h3 className="text-base font-semibold text-[#e4e4e7] mb-1 group-hover:text-[#b39ddb] transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-sm text-[#6b6b75] flex items-center gap-1">
                                {project.domain}
                                <ExternalLink className="w-3 h-3" />
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
