"use client";

import { useState, useEffect, use, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Trash2,
    Globe,
    Eye,
    Users,
    MousePointerClick,
    TrendingUp,
    TrendingDown,
    Settings,
} from "lucide-react";
import {
    FilterProvider,
    FilterBar,
    EventsTable,
    useFilters,
    type Event,
    type FilterOptions,
} from "@/components/analytics";

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
    growth: {
        pageviews: number;
        visitors: number;
        events: number;
    };
    topPages: { page: string; views: number }[];
}

interface EventsResponse {
    events: Event[];
    total: number;
    limit: number;
    offset: number;
    filterOptions: FilterOptions;
}

// Inner component that uses the filter context
function ProjectDashboard({ projectId }: { projectId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { filters, setFilterOptions } = useFilters();

    const [project, setProject] = useState<Project | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsTotal, setEventsTotal] = useState(0);
    const [eventsOffset, setEventsOffset] = useState(0);
    const [eventsLimit, setEventsLimit] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [isEventsLoading, setIsEventsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Build query string from filters
    const buildQueryString = useCallback(() => {
        const params = new URLSearchParams();

        params.set("limit", eventsLimit.toString());
        params.set("offset", eventsOffset.toString());

        if (filters.startDate) params.set("startDate", filters.startDate);
        if (filters.endDate) params.set("endDate", filters.endDate);
        if (filters.types.length > 0) params.set("type", filters.types.join(","));
        if (filters.eventName) params.set("name", filters.eventName);
        if (filters.page) params.set("page", filters.page);
        if (filters.pageContains) params.set("pageContains", filters.pageContains);
        if (filters.devices.length > 0) params.set("device", filters.devices.join(","));
        if (filters.browsers.length > 0) params.set("browser", filters.browsers.join(","));
        if (filters.countries.length > 0) params.set("country", filters.countries.join(","));
        if (filters.sessionId) params.set("sessionId", filters.sessionId);
        if (filters.referrer) params.set("referrer", filters.referrer);
        if (filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
        if (filters.sortOrder !== "desc") params.set("sortOrder", filters.sortOrder);

        return params.toString();
    }, [filters, eventsLimit, eventsOffset]);

    const fetchProject = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}`);
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
    }, [projectId, router]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    }, [projectId]);

    const fetchEvents = useCallback(async () => {
        setIsEventsLoading(true);
        try {
            const queryString = buildQueryString();
            const response = await fetch(`/api/projects/${projectId}/events?${queryString}`);
            if (response.ok) {
                const data: EventsResponse = await response.json();
                setEvents(data.events);
                setEventsTotal(data.total);
                setFilterOptions(data.filterOptions);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsEventsLoading(false);
        }
    }, [projectId, buildQueryString, setFilterOptions]);

    useEffect(() => {
        fetchProject();
        fetchStats();
    }, [fetchProject, fetchStats]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const refreshAll = async () => {
        await Promise.all([fetchStats(), fetchEvents()]);
    };

    const handlePageChange = (newOffset: number) => {
        setEventsOffset(newOffset);
    };

    const handleLimitChange = (newLimit: number) => {
        setEventsLimit(newLimit);
        setEventsOffset(0); // Reset to first page
    };

    const toggleActive = async () => {
        if (!project) return;

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
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
            const response = await fetch(`/api/projects/${projectId}`, {
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
        <div className="space-y-6">
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
                    <Link href={`/projects/${projectId}/settings`}>
                        <Button variant="secondary">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Button>
                    </Link>
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
                    {
                        label: "Page Views",
                        value: stats?.totalPageviews || 0,
                        growth: stats?.growth?.pageviews ?? 0,
                        icon: Eye
                    },
                    {
                        label: "Unique Visitors",
                        value: stats?.totalVisitors || 0,
                        growth: stats?.growth?.visitors ?? 0,
                        icon: Users
                    },
                    {
                        label: "Events",
                        value: stats?.totalEvents || 0,
                        growth: stats?.growth?.events ?? 0,
                        icon: MousePointerClick
                    },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[#101014] border border-[#1e1e24] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className="w-4 h-4 text-[#6b6b75]" />
                            <span className="text-xs text-[#6b6b75]">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-semibold text-[#e4e4e7]">
                            {stat.value.toLocaleString()}
                        </p>
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.growth > 0
                            ? 'text-[#6fcf97]'
                            : stat.growth < 0
                                ? 'text-[#f87171]'
                                : 'text-[#6b6b75]'
                            }`}>
                            {stat.growth > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : stat.growth < 0 ? (
                                <TrendingDown className="w-3 h-3" />
                            ) : null}
                            <span>
                                {stat.growth > 0 ? '+' : ''}{stat.growth}% vs previous period
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <FilterBar onRefresh={refreshAll} isLoading={isEventsLoading} />

            {/* Events Table */}
            <EventsTable
                events={events}
                isLoading={isEventsLoading}
                total={eventsTotal}
                limit={eventsLimit}
                offset={eventsOffset}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />

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
            )
            }
        </div >
    );
}

// Main page component with FilterProvider wrapper
export default function ProjectDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);

    return (
        <FilterProvider>
            <Suspense fallback={
                <div className="space-y-8">
                    <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-8 flex items-center justify-center">
                        <div className="flex items-center gap-3 text-[#6b6b75]">
                            <div className="w-5 h-5 border-2 border-[#7c5eb3] border-t-transparent rounded-full animate-spin" />
                            <span>Loading...</span>
                        </div>
                    </div>
                </div>
            }>
                <ProjectDashboard projectId={id} />
            </Suspense>
        </FilterProvider>
    );
}
