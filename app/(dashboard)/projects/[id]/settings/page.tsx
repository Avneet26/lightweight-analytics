"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Copy,
    Check,
    RefreshCw,
    Settings,
    Code,
    Key,
    Trash2,
    AlertTriangle,
} from "lucide-react";

interface Project {
    id: string;
    name: string;
    domain: string;
    apiKey: string;
    isActive: boolean;
    createdAt: string;
}

export default function ProjectSettingsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    // Delete logs modal state
    const [showDeleteLogsModal, setShowDeleteLogsModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProject(data.project);
            } else {
                router.push("/projects");
            }
        } catch (error) {
            console.error("Failed to fetch project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyScript = () => {
        if (!project) return;

        const script = `<script defer src="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/script" data-api-key="${project.apiKey}"></script>`;
        navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyApiKey = () => {
        if (!project) return;
        navigator.clipboard.writeText(project.apiKey);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const regenerateApiKey = async () => {
        if (!project) return;

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ regenerateApiKey: true }),
            });

            if (response.ok) {
                const data = await response.json();
                setProject(data.project);
            }
        } catch (error) {
            console.error("Failed to regenerate API key:", error);
        }
    };

    const handleDeleteLogs = async () => {
        if (deleteConfirmation !== "delete the logs") {
            setDeleteError("Please type 'delete the logs' exactly to confirm.");
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`/api/projects/${id}/events`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmation: deleteConfirmation }),
            });

            if (response.ok) {
                setShowDeleteLogsModal(false);
                setDeleteConfirmation("");
                // Show success message or redirect
            } else {
                const data = await response.json();
                setDeleteError(data.error || "Failed to delete logs");
            }
        } catch (error) {
            console.error("Failed to delete logs:", error);
            setDeleteError("An error occurred while deleting logs");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Link
                    href={`/projects/${id}`}
                    className="inline-flex items-center gap-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project
                </Link>
                <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-8 flex items-center justify-center">
                    <div className="flex items-center gap-3 text-[#6b6b75]">
                        <div className="w-5 h-5 border-2 border-[#7c5eb3] border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/projects/${id}`}
                        className="p-2 rounded-lg hover:bg-[#18181e] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#8a8a94]" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <Settings className="w-6 h-6 text-[#7c5eb3]" />
                            <h1 className="text-2xl font-semibold text-[#e4e4e7]">Project Settings</h1>
                        </div>
                        <p className="text-sm text-[#6b6b75] mt-1">
                            {project.name} • {project.domain}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tracking Script Section */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24] flex items-center gap-3">
                    <Code className="w-5 h-5 text-[#7c5eb3]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#e4e4e7]">Tracking Script</h2>
                        <p className="text-sm text-[#6b6b75]">Add this script to your website&apos;s &lt;head&gt; tag</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="relative">
                        <pre className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-4 overflow-x-auto text-sm text-[#e4e4e7] font-mono">
                            {`<script defer src="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/script" 
  data-api-key="${project.apiKey}">
</script>`}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-3 right-3"
                            onClick={copyScript}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    <div className="mt-4 p-4 bg-[#18181e] rounded-lg">
                        <h3 className="text-sm font-medium text-[#e4e4e7] mb-2">Usage Example</h3>
                        <pre className="text-xs text-[#8a8a94] font-mono overflow-x-auto">
                            {`<!-- Track custom events -->
<script>
  // Track button clicks
  document.querySelector('#signup-btn').addEventListener('click', () => {
    window.la.track('click', 'signup_button');
  });
</script>`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* API Key Section */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24] flex items-center gap-3">
                    <Key className="w-5 h-5 text-[#7c5eb3]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#e4e4e7]">API Key</h2>
                        <p className="text-sm text-[#6b6b75]">Use this key for manual API integration</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <code className="flex-1 bg-[#0c0c10] border border-[#1e1e24] rounded-lg px-4 py-3 text-sm text-[#e4e4e7] font-mono">
                            {project.apiKey}
                        </code>
                        <Button variant="secondary" onClick={copyApiKey}>
                            {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedKey ? "Copied!" : "Copy"}
                        </Button>
                        <Button variant="secondary" onClick={regenerateApiKey}>
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </Button>
                    </div>
                    <p className="text-xs text-[#f5a623] mt-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Regenerating the API key will invalidate the current key immediately. Update your tracking script after regenerating.
                    </p>
                </div>
            </div>

            {/* API Usage Section */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24]">
                    <h2 className="text-lg font-semibold text-[#e4e4e7]">API Usage</h2>
                    <p className="text-sm text-[#6b6b75]">Send events directly via our REST API</p>
                </div>
                <div className="p-6">
                    <pre className="bg-[#0c0c10] border border-[#1e1e24] rounded-lg p-4 overflow-x-auto text-sm text-[#e4e4e7] font-mono">
                        {`curl -X POST ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/track \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "${project.apiKey}",
    "type": "pageview",
    "page": "/pricing"
  }'`}
                    </pre>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#101014] border border-[#3d2020] rounded-xl">
                <div className="px-6 py-4 border-b border-[#3d2020] flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-[#f87171]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#f87171]">Danger Zone</h2>
                        <p className="text-sm text-[#6b6b75]">Irreversible and destructive actions</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-[#1a0f0f] border border-[#3d2020] rounded-lg">
                        <div>
                            <h3 className="text-sm font-medium text-[#e4e4e7]">Delete All Event Logs</h3>
                            <p className="text-xs text-[#6b6b75] mt-1">
                                Permanently delete all tracked events for this project. This action cannot be undone.
                            </p>
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteLogsModal(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Logs
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Logs Confirmation Modal */}
            {showDeleteLogsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#3d2020] flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-[#f87171]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#e4e4e7]">Delete All Logs</h3>
                                <p className="text-sm text-[#6b6b75]">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-sm text-[#8a8a94] mb-4">
                            You are about to permanently delete all tracked events for <strong className="text-[#e4e4e7]">{project.name}</strong>.
                            This includes all pageviews, clicks, and custom events.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm text-[#6b6b75] mb-2">
                                Type <span className="text-[#f87171] font-mono">delete the logs</span> to confirm:
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="delete the logs"
                                className="w-full px-4 py-3 bg-[#0c0c10] border border-[#1e1e24] rounded-lg text-sm text-[#e4e4e7] placeholder-[#6b6b75] focus:outline-none focus:border-[#f87171]"
                            />
                            {deleteError && (
                                <p className="text-xs text-[#f87171] mt-2">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowDeleteLogsModal(false);
                                    setDeleteConfirmation("");
                                    setDeleteError(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteLogs}
                                isLoading={isDeleting}
                                disabled={deleteConfirmation !== "delete the logs"}
                            >
                                Delete All Logs
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
