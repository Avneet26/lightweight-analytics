"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Filter state interface
export interface FilterState {
    startDate: string | null;
    endDate: string | null;
    types: string[];
    eventName: string | null;
    page: string | null;
    pageContains: string | null;
    devices: string[];
    browsers: string[];
    countries: string[];
    sessionId: string | null;
    referrer: string | null;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

// Available filter options (from API)
export interface FilterOptions {
    types: string[];
    devices: string[];
    browsers: string[];
    countries: string[];
}

// Context value interface
interface FilterContextValue {
    filters: FilterState;
    filterOptions: FilterOptions;
    setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    clearFilters: () => void;
    clearFilter: (key: keyof FilterState) => void;
    setFilterOptions: (options: FilterOptions) => void;
    hasActiveFilters: boolean;
    activeFilterCount: number;
    applyFiltersToUrl: () => void;
}

// Default filter state
const defaultFilters: FilterState = {
    startDate: null,
    endDate: null,
    types: [],
    eventName: null,
    page: null,
    pageContains: null,
    devices: [],
    browsers: [],
    countries: [],
    sessionId: null,
    referrer: null,
    sortBy: "createdAt",
    sortOrder: "desc",
};

const defaultOptions: FilterOptions = {
    types: [],
    devices: [],
    browsers: [],
    countries: [],
};

// Create context
const FilterContext = createContext<FilterContextValue | null>(null);

// Provider component
export function FilterProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize filters from URL params
    const getInitialFilters = useCallback((): FilterState => {
        return {
            startDate: searchParams.get("startDate"),
            endDate: searchParams.get("endDate"),
            types: searchParams.get("type")?.split(",").filter(Boolean) || [],
            eventName: searchParams.get("name"),
            page: searchParams.get("page"),
            pageContains: searchParams.get("pageContains"),
            devices: searchParams.get("device")?.split(",").filter(Boolean) || [],
            browsers: searchParams.get("browser")?.split(",").filter(Boolean) || [],
            countries: searchParams.get("country")?.split(",").filter(Boolean) || [],
            sessionId: searchParams.get("sessionId"),
            referrer: searchParams.get("referrer"),
            sortBy: searchParams.get("sortBy") || "createdAt",
            sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
        };
    }, [searchParams]);

    const [filters, setFiltersState] = useState<FilterState>(getInitialFilters);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultOptions);

    // Set a single filter
    const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFiltersState((prev) => ({ ...prev, [key]: value }));
    }, []);

    // Set multiple filters at once
    const setFilters = useCallback((newFilters: Partial<FilterState>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFiltersState(defaultFilters);
    }, []);

    // Clear a specific filter
    const clearFilter = useCallback((key: keyof FilterState) => {
        setFiltersState((prev) => ({ ...prev, [key]: defaultFilters[key] }));
    }, []);

    // Apply filters to URL
    const applyFiltersToUrl = useCallback(() => {
        const params = new URLSearchParams();

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

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }, [filters, pathname, router]);

    // Calculate if there are active filters
    const hasActiveFilters =
        filters.startDate !== null ||
        filters.endDate !== null ||
        filters.types.length > 0 ||
        filters.eventName !== null ||
        filters.page !== null ||
        filters.pageContains !== null ||
        filters.devices.length > 0 ||
        filters.browsers.length > 0 ||
        filters.countries.length > 0 ||
        filters.sessionId !== null ||
        filters.referrer !== null;

    // Count active filters
    const activeFilterCount = [
        filters.startDate || filters.endDate ? 1 : 0,
        filters.types.length > 0 ? 1 : 0,
        filters.eventName ? 1 : 0,
        filters.page || filters.pageContains ? 1 : 0,
        filters.devices.length > 0 ? 1 : 0,
        filters.browsers.length > 0 ? 1 : 0,
        filters.countries.length > 0 ? 1 : 0,
        filters.sessionId ? 1 : 0,
        filters.referrer ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <FilterContext.Provider
            value={{
                filters,
                filterOptions,
                setFilter,
                setFilters,
                clearFilters,
                clearFilter,
                setFilterOptions,
                hasActiveFilters,
                activeFilterCount,
                applyFiltersToUrl,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

// Hook to use filter context
export function useFilters() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
}
