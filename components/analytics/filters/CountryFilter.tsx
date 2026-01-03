"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, MapPin, Search } from "lucide-react";
import { useFilters } from "../FilterContext";

// Country code to name mapping (common countries)
const countryNames: Record<string, string> = {
    US: "United States",
    IN: "India",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    BR: "Brazil",
    JP: "Japan",
    CN: "China",
    RU: "Russia",
    KR: "South Korea",
    MX: "Mexico",
    ES: "Spain",
    IT: "Italy",
    NL: "Netherlands",
    PL: "Poland",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    CH: "Switzerland",
    AT: "Austria",
    BE: "Belgium",
    IE: "Ireland",
    NZ: "New Zealand",
    SG: "Singapore",
    HK: "Hong Kong",
    AE: "UAE",
    ZA: "South Africa",
    PH: "Philippines",
    ID: "Indonesia",
    MY: "Malaysia",
    TH: "Thailand",
    VN: "Vietnam",
    PK: "Pakistan",
    BD: "Bangladesh",
    NG: "Nigeria",
    EG: "Egypt",
    AR: "Argentina",
    CL: "Chile",
    CO: "Colombia",
    PE: "Peru",
    VE: "Venezuela",
};

export function CountryFilter() {
    const { filters, filterOptions, setFilter } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCountries = filters.countries;
    const availableCountries = filterOptions.countries;

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

    const toggleCountry = (country: string) => {
        if (selectedCountries.includes(country)) {
            setFilter("countries", selectedCountries.filter((c) => c !== country));
        } else {
            setFilter("countries", [...selectedCountries, country]);
        }
    };

    const clearCountries = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFilter("countries", []);
    };

    const getButtonLabel = () => {
        if (selectedCountries.length === 0) return "Country";
        if (selectedCountries.length === 1) {
            return countryNames[selectedCountries[0]] || selectedCountries[0];
        }
        return `${selectedCountries.length} countries`;
    };

    const getCountryName = (code: string) => {
        return countryNames[code] || code;
    };

    // Filter countries based on search
    const filteredCountries = availableCountries.filter((country) => {
        const name = getCountryName(country).toLowerCase();
        const code = country.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || code.includes(query);
    });

    if (availableCountries.length === 0) {
        return null; // Don't render if no countries available
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${selectedCountries.length > 0
                        ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                        : "bg-[#18181e] text-[#8a8a94] border border-[#1e1e24] hover:border-[#2e2e36] hover:text-[#e4e4e7]"
                    }
                `}
            >
                <MapPin className="w-4 h-4" />
                <span>{getButtonLabel()}</span>
                {selectedCountries.length > 0 ? (
                    <X className="w-4 h-4 hover:text-white" onClick={clearCountries} />
                ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-[#101014] border border-[#1e1e24] rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-[#1e1e24]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b75]" />
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-[#0c0c10] border border-[#1e1e24] rounded-lg text-sm text-[#e4e4e7] placeholder-[#6b6b75] focus:outline-none focus:border-[#7c5eb3]"
                            />
                        </div>
                    </div>

                    <div className="p-2 max-h-64 overflow-y-auto">
                        {filteredCountries.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-[#6b6b75]">No countries found</p>
                        ) : (
                            <div className="space-y-1">
                                {filteredCountries.map((country) => {
                                    const isSelected = selectedCountries.includes(country);

                                    return (
                                        <button
                                            key={country}
                                            onClick={() => toggleCountry(country)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                                transition-all duration-200
                                                ${isSelected
                                                    ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                                                    : "text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e]"
                                                }
                                            `}
                                        >
                                            <span className="text-base">{getFlagEmoji(country)}</span>
                                            <span className="flex-1 text-left">{getCountryName(country)}</span>
                                            <span className="text-xs text-[#6b6b75]">{country}</span>
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-[#b39ddb]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
