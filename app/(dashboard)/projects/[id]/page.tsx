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
    Trash2,
    Globe,
    Eye,
    Users,
    MousePointerClick,
    TrendingUp,
    Clock,
    Monitor,
    Smartphone,
    Tablet
} from "lucide-react";

interface Project {
    id: string;
    name: string;
    domain: string;
    apiKey: string;
    isActive: boolean;
    createdAt: string;
}

interface Stats {
    totalPageviews: number;
    totalVisitors: number;
    totalEvents: number;
    topPages: { page: string; views: number }[];
}

interface Event {
    id: number;
    projectId: string;
    type: string;
    name: string | null;
    page: string;
    referrer: string | null;
    country: string | null;
    device: string | null;
    browser: string | null;
    sessionId: string | null;
    createdAt: string;
}

function getDeviceIcon(device: string | null) {
    switch (device?.toLowerCase()) {
        case "mobile":
            return <Smartphone className="w-3 h-3" />;
        case "tablet":
            return <Tablet className="w-3 h-3" />;
        default:
            return <Monitor className="w-3 h-3" />;
    }
}

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
}

export default function ProjectDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchProject();
        fetchStats();
        fetchEvents();
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

    const fetchStats = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/events?limit=50`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data.events);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    const refreshAll = async () => {
        await Promise.all([fetchStats(), fetchEvents()]);
    };

    const copyScript = () => {
        if (!project) return;

        const script = `<script defer src="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/script" data-api-key="${project.apiKey}"></script>`;
        navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    const toggleActive = async () => {
        if (!project) return;

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !project.isActive }),
            });

            if (response.ok) {
                const data = await response.json();
                setProject(data.project);
            }
        } catch (error) {
            console.error("Failed to toggle project:", error);
        }
    };

    const deleteProject = async () => {
        if (!project) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/projects");
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
                <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-8 flex items-center justify-center">
                    <div className="text-[#6b6b75]">Loading...</div>
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
                        href="/projects"
                        className="p-2 rounded-lg hover:bg-[#18181e] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#8a8a94]" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-[#e4e4e7]">{project.name}</h1>
                            <div className={`px-2 py-0.5 rounded text-xs font-medium ${project.isActive
                                ? "bg-[#1a3a2a] text-[#6fcf97] border border-[#2a4a3a]"
                                : "bg-[#3d2020] text-[#f87171] border border-[#5c3030]"
                                }`}>
                                {project.isActive ? "Active" : "Paused"}
                            </div>
                        </div>
                        <p className="text-sm text-[#6b6b75] flex items-center gap-1 mt-1">
                            <Globe className="w-3 h-3" />
                            {project.domain}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={toggleActive}>
                        {project.isActive ? "Pause" : "Activate"}
                    </Button>
                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Page Views", value: stats?.totalPageviews || 0, icon: Eye },
                    { label: "Unique Visitors", value: stats?.totalVisitors || 0, icon: Users },
                    { label: "Events", value: stats?.totalEvents || 0, icon: MousePointerClick },
                    { label: "Growth", value: "+0%", icon: TrendingUp },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[#101014] border border-[#1e1e24] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className="w-4 h-4 text-[#6b6b75]" />
                            <span className="text-xs text-[#6b6b75]">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-semibold text-[#e4e4e7]">
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Events Log Table */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24] flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#e4e4e7]">Events Log</h2>
                        <p className="text-sm text-[#6b6b75]">Recent tracking events</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={refreshAll}>
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-[#6b6b75]">
                            No events recorded yet. Add the tracking script to your website to start collecting data.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#1e1e24]">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase tracking-wider">Page</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase tracking-wider">Browser</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase tracking-wider">Country</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b75] uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e1e24]">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-[#18181e] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${event.type === 'pageview'
                                                ? 'bg-[#1a3a2a] text-[#6fcf97] border border-[#2a4a3a]'
                                                : event.type === 'click'
                                                    ? 'bg-[#3a2a1a] text-[#f5a623] border border-[#4a3a2a]'
                                                    : 'bg-[#7c5eb3]/10 text-[#b39ddb] border border-[#7c5eb3]/20'
                                                }`}>
                                                {event.type}
                                            </span>
                                            {event.name && (
                                                <span className="ml-2 text-xs text-[#8a8a94]">{event.name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-[#e4e4e7] font-mono">{event.page}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-[#8a8a94]">
                                                {getDeviceIcon(event.device)}
                                                {event.device || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8a8a94]">
                                            {event.browser || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8a8a94]">
                                            {event.country || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-[#6b6b75]">
                                                <Clock className="w-3 h-3" />
                                                {formatTimeAgo(event.createdAt)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Tracking Script */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24]">
                    <h2 className="text-lg font-semibold text-[#e4e4e7]">Tracking Script</h2>
                    <p className="text-sm text-[#6b6b75]">Add this script to your website&apos;s &lt;head&gt; tag</p>
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
                </div>
            </div>

            {/* API Key */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24]">
                    <h2 className="text-lg font-semibold text-[#e4e4e7]">API Key</h2>
                    <p className="text-sm text-[#6b6b75]">Use this key for manual API integration</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <code className="flex-1 bg-[#0c0c10] border border-[#1e1e24] rounded-lg px-4 py-3 text-sm text-[#e4e4e7] font-mono">
                            {project.apiKey}
                        </code>
                        <Button variant="secondary" onClick={regenerateApiKey}>
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </Button>
                    </div>
                    <p className="text-xs text-[#6b6b75] mt-3">
                        ⚠️ Regenerating the API key will invalidate the current key immediately
                    </p>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-[#e4e4e7] mb-2">Delete Project</h3>
                        <p className="text-sm text-[#6b6b75] mb-6">
                            Are you sure you want to delete &quot;{project.name}&quot;? This will permanently delete all analytics data. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={deleteProject}
                                isLoading={isDeleting}
                            >
                                Delete Project
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
