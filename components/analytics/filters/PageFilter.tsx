"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useFilters } from "../FilterContext";

export function PageFilter() {
    const { filters, setFilter } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(filters.pageContains || "");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasPageFilter = filters.page || filters.pageContains;

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

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleApply = () => {
        if (inputValue.trim()) {
            setFilter("pageContains", inputValue.trim());
        } else {
            setFilter("pageContains", null);
        }
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleApply();
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const clearFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFilter("page", null);
        setFilter("pageContains", null);
        setInputValue("");
    };

    const getButtonLabel = () => {
        if (filters.page) return filters.page;
        if (filters.pageContains) return `*${filters.pageContains}*`;
        return "Page";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${hasPageFilter
                        ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                        : "bg-[#18181e] text-[#8a8a94] border border-[#1e1e24] hover:border-[#2e2e36] hover:text-[#e4e4e7]"
                    }
                `}
            >
                <Search className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{getButtonLabel()}</span>
                {hasPageFilter && (
                    <X className="w-4 h-4 hover:text-white flex-shrink-0" onClick={clearFilter} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#101014] border border-[#1e1e24] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3">
                        <p className="text-xs font-medium text-[#6b6b75] uppercase tracking-wider mb-2">
                            Filter by Page URL
                        </p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b75]" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="e.g. /pricing or blog"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-9 pr-3 py-2 bg-[#0c0c10] border border-[#1e1e24] rounded-lg text-sm text-[#e4e4e7] placeholder-[#6b6b75] focus:outline-none focus:border-[#7c5eb3]"
                            />
                        </div>
                        <p className="text-xs text-[#6b6b75] mt-2">
                            Matches pages containing this text
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-3 py-2 text-sm text-[#8a8a94] hover:text-[#e4e4e7] bg-[#18181e] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 px-3 py-2 text-sm text-white bg-[#7c5eb3] rounded-lg hover:bg-[#6b4fa3] transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
