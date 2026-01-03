"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import { useFilters } from "../FilterContext";

interface DateRange {
    startDate: string | null;
    endDate: string | null;
}

interface PresetRange {
    label: string;
    getValue: () => DateRange;
}

const presetRanges: PresetRange[] = [
    {
        label: "Today",
        getValue: () => {
            const today = new Date().toISOString().split("T")[0];
            return { startDate: today, endDate: today };
        },
    },
    {
        label: "Yesterday",
        getValue: () => {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
            return { startDate: yesterday, endDate: yesterday };
        },
    },
    {
        label: "Last 7 days",
        getValue: () => {
            const end = new Date().toISOString().split("T")[0];
            const start = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Last 30 days",
        getValue: () => {
            const end = new Date().toISOString().split("T")[0];
            const start = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Last 90 days",
        getValue: () => {
            const end = new Date().toISOString().split("T")[0];
            const start = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
            return { startDate: start, endDate: end };
        },
    },
    {
        label: "This month",
        getValue: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
            const end = now.toISOString().split("T")[0];
            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Last month",
        getValue: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
            const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];
            return { startDate: start, endDate: end };
        },
    },
];

function formatDateRange(startDate: string | null, endDate: string | null): string {
    if (!startDate && !endDate) return "All time";

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    if (startDate && endDate) {
        if (startDate === endDate) {
            return formatDate(startDate);
        }
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    if (startDate) return `From ${formatDate(startDate)}`;
    if (endDate) return `Until ${formatDate(endDate)}`;

    return "All time";
}

export function DateRangePicker() {
    const { filters, setFilters, clearFilter } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [customStart, setCustomStart] = useState(filters.startDate || "");
    const [customEnd, setCustomEnd] = useState(filters.endDate || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasDateFilter = filters.startDate || filters.endDate;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePresetClick = (preset: PresetRange) => {
        const range = preset.getValue();
        setFilters(range);
        setIsOpen(false);
        setShowCustom(false);
    };

    const handleCustomApply = () => {
        setFilters({
            startDate: customStart || null,
            endDate: customEnd || null,
        });
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearFilter("startDate");
        clearFilter("endDate");
        setCustomStart("");
        setCustomEnd("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${hasDateFilter
                        ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                        : "bg-[#18181e] text-[#8a8a94] border border-[#1e1e24] hover:border-[#2e2e36] hover:text-[#e4e4e7]"
                    }
                `}
            >
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(filters.startDate, filters.endDate)}</span>
                {hasDateFilter ? (
                    <X className="w-4 h-4 hover:text-white" onClick={handleClear} />
                ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#101014] border border-[#1e1e24] rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Preset ranges */}
                    <div className="p-2 border-b border-[#1e1e24]">
                        <p className="px-2 py-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider">
                            Quick Select
                        </p>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            {presetRanges.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePresetClick(preset)}
                                    className="px-3 py-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] rounded-lg transition-colors text-left"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom range */}
                    <div className="p-3">
                        <button
                            onClick={() => setShowCustom(!showCustom)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] rounded-lg transition-colors"
                        >
                            <span>Custom Range</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCustom ? "rotate-180" : ""}`} />
                        </button>

                        {showCustom && (
                            <div className="mt-3 space-y-3">
                                <div>
                                    <label className="block text-xs text-[#6b6b75] mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0c0c10] border border-[#1e1e24] rounded-lg text-sm text-[#e4e4e7] focus:outline-none focus:border-[#7c5eb3]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6b6b75] mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0c0c10] border border-[#1e1e24] rounded-lg text-sm text-[#e4e4e7] focus:outline-none focus:border-[#7c5eb3]"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomApply}
                                    className="w-full px-3 py-2 bg-[#7c5eb3] text-white text-sm font-medium rounded-lg hover:bg-[#6b4fa3] transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
