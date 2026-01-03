"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Eye, MousePointerClick, Zap } from "lucide-react";
import { useFilters } from "../FilterContext";

const eventTypeConfig = {
    pageview: {
        label: "Page Views",
        icon: Eye,
        color: "text-[#6fcf97]",
        bg: "bg-[#1a3a2a]",
        border: "border-[#2a4a3a]",
    },
    click: {
        label: "Clicks",
        icon: MousePointerClick,
        color: "text-[#f5a623]",
        bg: "bg-[#3a2a1a]",
        border: "border-[#4a3a2a]",
    },
    custom: {
        label: "Custom Events",
        icon: Zap,
        color: "text-[#b39ddb]",
        bg: "bg-[#7c5eb3]/10",
        border: "border-[#7c5eb3]/20",
    },
};

export function EventTypeFilter() {
    const { filters, filterOptions, setFilter } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedTypes = filters.types;
    const availableTypes = filterOptions.types.length > 0
        ? filterOptions.types
        : Object.keys(eventTypeConfig);

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

    const toggleType = (type: string) => {
        if (selectedTypes.includes(type)) {
            setFilter("types", selectedTypes.filter((t) => t !== type));
        } else {
            setFilter("types", [...selectedTypes, type]);
        }
    };

    const clearTypes = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFilter("types", []);
    };

    const getButtonLabel = () => {
        if (selectedTypes.length === 0) return "Event Type";
        if (selectedTypes.length === 1) {
            const config = eventTypeConfig[selectedTypes[0] as keyof typeof eventTypeConfig];
            return config?.label || selectedTypes[0];
        }
        return `${selectedTypes.length} types`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${selectedTypes.length > 0
                        ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                        : "bg-[#18181e] text-[#8a8a94] border border-[#1e1e24] hover:border-[#2e2e36] hover:text-[#e4e4e7]"
                    }
                `}
            >
                <Zap className="w-4 h-4" />
                <span>{getButtonLabel()}</span>
                {selectedTypes.length > 0 ? (
                    <X className="w-4 h-4 hover:text-white" onClick={clearTypes} />
                ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#101014] border border-[#1e1e24] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2">
                        <p className="px-2 py-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider">
                            Event Types
                        </p>
                        <div className="space-y-1 mt-1">
                            {availableTypes.map((type) => {
                                const config = eventTypeConfig[type as keyof typeof eventTypeConfig] || {
                                    label: type,
                                    icon: Zap,
                                    color: "text-[#8a8a94]",
                                    bg: "bg-[#18181e]",
                                    border: "border-[#2e2e36]",
                                };
                                const Icon = config.icon;
                                const isSelected = selectedTypes.includes(type);

                                return (
                                    <button
                                        key={type}
                                        onClick={() => toggleType(type)}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                            transition-all duration-200
                                            ${isSelected
                                                ? `${config.bg} ${config.color} ${config.border} border`
                                                : "text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e]"
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="flex-1 text-left">{config.label}</span>
                                        {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-current" />
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
