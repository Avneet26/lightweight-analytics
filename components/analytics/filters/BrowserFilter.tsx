"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Globe } from "lucide-react";
import { useFilters } from "../FilterContext";

// Common browser icons/colors
const browserConfig: Record<string, { label: string; color: string }> = {
    chrome: { label: "Chrome", color: "#4285F4" },
    firefox: { label: "Firefox", color: "#FF7139" },
    safari: { label: "Safari", color: "#0FB5EE" },
    edge: { label: "Edge", color: "#0078D7" },
    opera: { label: "Opera", color: "#FF1B2D" },
    brave: { label: "Brave", color: "#FB542B" },
    samsung: { label: "Samsung Internet", color: "#1428A0" },
};

export function BrowserFilter() {
    const { filters, filterOptions, setFilter } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedBrowsers = filters.browsers;
    const availableBrowsers = filterOptions.browsers;

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

    const toggleBrowser = (browser: string) => {
        if (selectedBrowsers.includes(browser)) {
            setFilter("browsers", selectedBrowsers.filter((b) => b !== browser));
        } else {
            setFilter("browsers", [...selectedBrowsers, browser]);
        }
    };

    const clearBrowsers = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFilter("browsers", []);
    };

    const getButtonLabel = () => {
        if (selectedBrowsers.length === 0) return "Browser";
        if (selectedBrowsers.length === 1) {
            return selectedBrowsers[0];
        }
        return `${selectedBrowsers.length} browsers`;
    };

    const getBrowserConfig = (browser: string) => {
        const key = browser.toLowerCase();
        return browserConfig[key] || { label: browser, color: "#8a8a94" };
    };

    if (availableBrowsers.length === 0) {
        return null; // Don't render if no browsers available
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${selectedBrowsers.length > 0
                        ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                        : "bg-[#18181e] text-[#8a8a94] border border-[#1e1e24] hover:border-[#2e2e36] hover:text-[#e4e4e7]"
                    }
                `}
            >
                <Globe className="w-4 h-4" />
                <span>{getButtonLabel()}</span>
                {selectedBrowsers.length > 0 ? (
                    <X className="w-4 h-4 hover:text-white" onClick={clearBrowsers} />
                ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#101014] border border-[#1e1e24] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 max-h-64 overflow-y-auto">
                        <p className="px-2 py-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider">
                            Browsers
                        </p>
                        <div className="space-y-1 mt-1">
                            {availableBrowsers.map((browser) => {
                                const config = getBrowserConfig(browser);
                                const isSelected = selectedBrowsers.includes(browser);

                                return (
                                    <button
                                        key={browser}
                                        onClick={() => toggleBrowser(browser)}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                            transition-all duration-200
                                            ${isSelected
                                                ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                                                : "text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e]"
                                            }
                                        `}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: config.color }}
                                        />
                                        <span className="flex-1 text-left">{config.label}</span>
                                        {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-[#b39ddb]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
