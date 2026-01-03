"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Monitor, Smartphone, Tablet } from "lucide-react";
import { useFilters } from "../FilterContext";

const deviceConfig = {
    desktop: {
        label: "Desktop",
        icon: Monitor,
    },
    mobile: {
        label: "Mobile",
        icon: Smartphone,
    },
    tablet: {
        label: "Tablet",
        icon: Tablet,
    },
};

export function DeviceFilter() {
    const { filters, filterOptions, setFilter } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedDevices = filters.devices;
    const availableDevices = filterOptions.devices.length > 0
        ? filterOptions.devices
        : Object.keys(deviceConfig);

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

    const toggleDevice = (device: string) => {
        if (selectedDevices.includes(device)) {
            setFilter("devices", selectedDevices.filter((d) => d !== device));
        } else {
            setFilter("devices", [...selectedDevices, device]);
        }
    };

    const clearDevices = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFilter("devices", []);
    };

    const getButtonLabel = () => {
        if (selectedDevices.length === 0) return "Device";
        if (selectedDevices.length === 1) {
            const config = deviceConfig[selectedDevices[0].toLowerCase() as keyof typeof deviceConfig];
            return config?.label || selectedDevices[0];
        }
        return `${selectedDevices.length} devices`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${selectedDevices.length > 0
                        ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                        : "bg-[#18181e] text-[#8a8a94] border border-[#1e1e24] hover:border-[#2e2e36] hover:text-[#e4e4e7]"
                    }
                `}
            >
                <Monitor className="w-4 h-4" />
                <span>{getButtonLabel()}</span>
                {selectedDevices.length > 0 ? (
                    <X className="w-4 h-4 hover:text-white" onClick={clearDevices} />
                ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#101014] border border-[#1e1e24] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2">
                        <p className="px-2 py-1 text-xs font-medium text-[#6b6b75] uppercase tracking-wider">
                            Devices
                        </p>
                        <div className="space-y-1 mt-1">
                            {availableDevices.map((device) => {
                                const normalizedDevice = device.toLowerCase();
                                const config = deviceConfig[normalizedDevice as keyof typeof deviceConfig] || {
                                    label: device,
                                    icon: Monitor,
                                };
                                const Icon = config.icon;
                                const isSelected = selectedDevices.some(
                                    (d) => d.toLowerCase() === normalizedDevice
                                );

                                return (
                                    <button
                                        key={device}
                                        onClick={() => toggleDevice(device)}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                            transition-all duration-200
                                            ${isSelected
                                                ? "bg-[#7c5eb3]/20 text-[#b39ddb] border border-[#7c5eb3]/30"
                                                : "text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e]"
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
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
