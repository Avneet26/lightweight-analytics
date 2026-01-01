"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Globe, FolderKanban } from "lucide-react";

export default function NewProjectPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        if (!domain.trim()) {
            setError("Domain is required");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, domain }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create project");
            } else {
                router.push(`/projects/${data.project.id}`);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            {/* Back link */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-[#e4e4e7]">Create New Project</h1>
                <p className="text-sm text-[#6b6b75] mt-1">
                    Add a new website to track analytics
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-4 rounded-lg bg-[#3d2020] border border-[#5c3030] text-[#f87171] text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Project Name"
                        type="text"
                        placeholder="My Website"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<FolderKanban className="w-4 h-4" />}
                        required
                    />

                    <Input
                        label="Domain"
                        type="text"
                        placeholder="example.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        icon={<Globe className="w-4 h-4" />}
                        required
                    />

                    <p className="text-xs text-[#6b6b75]">
                        Enter your website domain without http:// or https://
                    </p>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
