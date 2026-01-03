"use client";

import { RefreshCw, X, Filter } from "lucide-react";
import { useFilters } from "./FilterContext";
import { DateRangePicker } from "./filters/DateRangePicker";
import { EventTypeFilter } from "./filters/EventTypeFilter";
import { DeviceFilter } from "./filters/DeviceFilter";
import { BrowserFilter } from "./filters/BrowserFilter";
import { PageFilter } from "./filters/PageFilter";

interface FilterBarProps {
    onRefresh?: () => void;
    isLoading?: boolean;
}

export function FilterBar({ onRefresh, isLoading }: FilterBarProps) {
    const { hasActiveFilters, activeFilterCount, clearFilters, applyFiltersToUrl } = useFilters();

    const handleApplyFilters = () => {
        applyFiltersToUrl();
        if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
                {/* Filter icon with count */}
                <div className="flex items-center gap-2 text-[#6b6b75]">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-[#7c5eb3]/20 text-[#b39ddb] text-xs font-medium rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-[#1e1e24]" />

                {/* Filter components */}
                <DateRangePicker />
                <EventTypeFilter />
                <DeviceFilter />
                <BrowserFilter />
                <PageFilter />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Clear filters button */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#f87171] hover:text-[#fca5a5] hover:bg-[#3d2020] rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear</span>
                        </button>
                    )}

                    {/* Apply button */}
                    <button
                        onClick={handleApplyFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7c5eb3] hover:bg-[#6b4fa3] rounded-lg transition-colors"
                    >
                        Apply Filters
                    </button>

                    {/* Refresh button */}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] hover:bg-[#1e1e24] border border-[#1e1e24] rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Active filters summary (optional - shows when filters are active) */}
            {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-[#1e1e24]">
                    <ActiveFiltersSummary />
                </div>
            )}
        </div>
    );
}

// Component to show active filters as tags
function ActiveFiltersSummary() {
    const { filters, clearFilter } = useFilters();

    const filterTags: { key: string; label: string; onClear: () => void }[] = [];

    if (filters.startDate || filters.endDate) {
        const dateLabel = filters.startDate && filters.endDate
            ? `${filters.startDate} to ${filters.endDate}`
            : filters.startDate
                ? `From ${filters.startDate}`
                : `Until ${filters.endDate}`;
        filterTags.push({
            key: "date",
            label: dateLabel,
            onClear: () => {
                clearFilter("startDate");
                clearFilter("endDate");
            },
        });
    }

    if (filters.types.length > 0) {
        filterTags.push({
            key: "types",
            label: `Types: ${filters.types.join(", ")}`,
            onClear: () => clearFilter("types"),
        });
    }

    if (filters.devices.length > 0) {
        filterTags.push({
            key: "devices",
            label: `Devices: ${filters.devices.join(", ")}`,
            onClear: () => clearFilter("devices"),
        });
    }

    if (filters.browsers.length > 0) {
        filterTags.push({
            key: "browsers",
            label: `Browsers: ${filters.browsers.join(", ")}`,
            onClear: () => clearFilter("browsers"),
        });
    }



    if (filters.pageContains) {
        filterTags.push({
            key: "page",
            label: `Page: *${filters.pageContains}*`,
            onClear: () => clearFilter("pageContains"),
        });
    }

    if (filters.eventName) {
        filterTags.push({
            key: "eventName",
            label: `Event: ${filters.eventName}`,
            onClear: () => clearFilter("eventName"),
        });
    }

    if (filters.referrer) {
        filterTags.push({
            key: "referrer",
            label: `Referrer: ${filters.referrer}`,
            onClear: () => clearFilter("referrer"),
        });
    }

    return (
        <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[#6b6b75]">Active:</span>
            {filterTags.map((tag) => (
                <span
                    key={tag.key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#7c5eb3]/10 text-[#b39ddb] text-xs rounded-md border border-[#7c5eb3]/20"
                >
                    {tag.label}
                    <button
                        onClick={tag.onClear}
                        className="hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
        </div>
    );
}
