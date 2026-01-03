"use client";

import { useState } from "react";
import {
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    Eye,
    MousePointerClick,
    Zap,
    ChevronUp,
    ChevronDown,
    ExternalLink,
    ArrowUpDown,
} from "lucide-react";
import { useFilters } from "./FilterContext";

// Event interface
export interface Event {
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

interface EventsTableProps {
    events: Event[];
    isLoading?: boolean;
    total: number;
    limit: number;
    offset: number;
    onPageChange?: (offset: number) => void;
    onLimitChange?: (limit: number) => void;
    onEventClick?: (event: Event) => void;
}

// Page size options
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Get device icon
function getDeviceIcon(device: string | null) {
    switch (device?.toLowerCase()) {
        case "mobile":
            return <Smartphone className="w-3.5 h-3.5" />;
        case "tablet":
            return <Tablet className="w-3.5 h-3.5" />;
        default:
            return <Monitor className="w-3.5 h-3.5" />;
    }
}

// Get event type config
function getEventTypeConfig(type: string) {
    switch (type) {
        case "pageview":
            return {
                icon: Eye,
                label: "Pageview",
                className: "bg-[#1a3a2a] text-[#6fcf97] border border-[#2a4a3a]",
            };
        case "click":
            return {
                icon: MousePointerClick,
                label: "Click",
                className: "bg-[#3a2a1a] text-[#f5a623] border border-[#4a3a2a]",
            };
        default:
            return {
                icon: Zap,
                label: type,
                className: "bg-[#7c5eb3]/10 text-[#b39ddb] border border-[#7c5eb3]/20",
            };
    }
}

// Format time ago
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

// Format full date
function formatFullDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

// Get flag emoji from country code
function getFlagEmoji(countryCode: string | null): string {
    if (!countryCode) return "🌍";
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

// Generate page numbers array with ellipsis
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages + 2) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (currentPage <= 3) {
            // Near the start
            for (let i = 2; i <= 4; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            // Near the end
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // In the middle
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        }
    }

    return pages;
}

type SortColumn = "createdAt" | "type" | "page" | "device" | "browser";

export function EventsTable({
    events,
    isLoading,
    total,
    limit,
    offset,
    onPageChange,
    onLimitChange,
    onEventClick,
}: EventsTableProps) {
    const { filters, setFilter } = useFilters();
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    const handleSort = (column: SortColumn) => {
        if (filters.sortBy === column) {
            // Toggle order
            setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
        } else {
            setFilter("sortBy", column);
            setFilter("sortOrder", "desc");
        }
    };

    const renderSortIcon = (column: SortColumn) => {
        if (filters.sortBy !== column) {
            return <ArrowUpDown className="w-3 h-3 opacity-50" />;
        }
        return filters.sortOrder === "asc" ? (
            <ChevronUp className="w-3 h-3" />
        ) : (
            <ChevronDown className="w-3 h-3" />
        );
    };

    const toggleRowExpand = (eventId: number) => {
        setExpandedRow(expandedRow === eventId ? null : eventId);
    };

    if (isLoading) {
        return (
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl overflow-hidden">
                <div className="p-8 flex items-center justify-center">
                    <div className="flex items-center gap-3 text-[#6b6b75]">
                        <div className="w-5 h-5 border-2 border-[#7c5eb3] border-t-transparent rounded-full animate-spin" />
                        <span>Loading events...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#101014] border border-[#1e1e24] rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#1e1e24] flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-[#e4e4e7]">Events Log</h2>
                    <p className="text-sm text-[#6b6b75]">
                        Showing {events.length} of {total.toLocaleString()} events
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {events.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#18181e] flex items-center justify-center">
                            <Eye className="w-8 h-8 text-[#6b6b75]" />
                        </div>
                        <h3 className="text-lg font-medium text-[#e4e4e7] mb-2">No events found</h3>
                        <p className="text-sm text-[#6b6b75]">
                            Try adjusting your filters or wait for new events to be tracked.
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#1e1e24]">
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("type")}
                                        className="flex items-center gap-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider hover:text-[#e4e4e7] transition-colors"
                                    >
                                        Type {renderSortIcon("type")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("page")}
                                        className="flex items-center gap-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider hover:text-[#e4e4e7] transition-colors"
                                    >
                                        Page {renderSortIcon("page")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("device")}
                                        className="flex items-center gap-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider hover:text-[#e4e4e7] transition-colors"
                                    >
                                        Device {renderSortIcon("device")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("browser")}
                                        className="flex items-center gap-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider hover:text-[#e4e4e7] transition-colors"
                                    >
                                        Browser {renderSortIcon("browser")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("createdAt")}
                                        className="flex items-center gap-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider hover:text-[#e4e4e7] transition-colors"
                                    >
                                        Time {renderSortIcon("createdAt")}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1e24]">
                            {events.map((event) => {
                                const typeConfig = getEventTypeConfig(event.type);
                                const TypeIcon = typeConfig.icon;
                                const isExpanded = expandedRow === event.id;

                                return (
                                    <>
                                        <tr
                                            key={event.id}
                                            onClick={() => toggleRowExpand(event.id)}
                                            className="hover:bg-[#18181e] transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${typeConfig.className}`}
                                                >
                                                    <TypeIcon className="w-3 h-3" />
                                                    {typeConfig.label}
                                                </span>
                                                {event.name && (
                                                    <span className="ml-2 text-xs text-[#8a8a94]">
                                                        {event.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-[#e4e4e7] font-mono">
                                                    {event.page}
                                                </span>
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center gap-1.5 text-xs text-[#6b6b75]"
                                                    title={formatFullDate(event.createdAt)}
                                                >
                                                    <Clock className="w-3 h-3" />
                                                    {formatTimeAgo(event.createdAt)}
                                                </span>
                                            </td>
                                        </tr>
                                        {/* Expanded row details */}
                                        {isExpanded && (
                                            <tr className="bg-[#0c0c10]">
                                                <td colSpan={5} className="px-6 py-4">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-[#6b6b75] block mb-1">
                                                                Event ID
                                                            </span>
                                                            <span className="text-[#e4e4e7] font-mono">
                                                                {event.id}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[#6b6b75] block mb-1">
                                                                Session ID
                                                            </span>
                                                            <span className="text-[#e4e4e7] font-mono text-xs">
                                                                {event.sessionId || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[#6b6b75] block mb-1">
                                                                Referrer
                                                            </span>
                                                            {event.referrer ? (
                                                                <a
                                                                    href={event.referrer}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[#7c5eb3] hover:text-[#b39ddb]"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    {new URL(event.referrer).hostname}
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-[#8a8a94]">
                                                                    Direct
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-[#6b6b75] block mb-1">
                                                                Full Timestamp
                                                            </span>
                                                            <span className="text-[#e4e4e7]">
                                                                {formatFullDate(event.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Enhanced Pagination */}
            {total > 0 && (
                <div className="px-6 py-4 border-t border-[#1e1e24]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Left side: Results info and page size */}
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-[#6b6b75]">
                                Showing <span className="text-[#e4e4e7] font-medium">{offset + 1}</span> to{" "}
                                <span className="text-[#e4e4e7] font-medium">
                                    {Math.min(offset + limit, total)}
                                </span>{" "}
                                of <span className="text-[#e4e4e7] font-medium">{total.toLocaleString()}</span> events
                            </div>

                            {/* Page size selector */}
                            {onLimitChange && (
                                <div className="flex items-center gap-2">
                                    <label htmlFor="pageSize" className="text-sm text-[#6b6b75]">
                                        Per page:
                                    </label>
                                    <select
                                        id="pageSize"
                                        value={limit}
                                        onChange={(e) => {
                                            onLimitChange(Number(e.target.value));
                                            onPageChange?.(0); // Reset to first page when changing limit
                                        }}
                                        className="px-3 py-1.5 text-sm text-[#e4e4e7] bg-[#18181e] border border-[#1e1e24] rounded-lg focus:outline-none focus:border-[#7c5eb3] cursor-pointer"
                                    >
                                        {PAGE_SIZE_OPTIONS.map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Right side: Pagination controls */}
                        <div className="flex items-center gap-2">
                            {/* First page */}
                            <button
                                onClick={() => onPageChange?.(0)}
                                disabled={currentPage === 1}
                                className="p-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] hover:bg-[#1e1e24] border border-[#1e1e24] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="First page"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Previous page */}
                            <button
                                onClick={() => onPageChange?.(Math.max(0, offset - limit))}
                                disabled={offset === 0}
                                className="p-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] hover:bg-[#1e1e24] border border-[#1e1e24] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Previous page"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {getPageNumbers(currentPage, totalPages).map((page, idx) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="px-2 text-[#6b6b75]">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => onPageChange?.((Number(page) - 1) * limit)}
                                            className={`min-w-[36px] h-9 px-3 text-sm rounded-lg transition-colors ${currentPage === page
                                                ? "bg-[#7c5eb3] text-white font-medium"
                                                : "text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] hover:bg-[#1e1e24] border border-[#1e1e24]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}
                            </div>

                            {/* Next page */}
                            <button
                                onClick={() => onPageChange?.(offset + limit)}
                                disabled={offset + limit >= total}
                                className="p-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] hover:bg-[#1e1e24] border border-[#1e1e24] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Next page"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Last page */}
                            <button
                                onClick={() => onPageChange?.((totalPages - 1) * limit)}
                                disabled={currentPage === totalPages}
                                className="p-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] hover:bg-[#1e1e24] border border-[#1e1e24] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Last page"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
