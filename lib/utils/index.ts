import { type ClassValue, clsx } from "clsx";

// Simple cn utility (like Tailwind's cn helper)
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

// Generate a unique ID (UUID v4)
export function generateId(): string {
    return crypto.randomUUID();
}

// Generate API key for projects
export function generateApiKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "la_"; // prefix for "lightweight analytics"
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Format date for display
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Format number with commas
export function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-US").format(num);
}

// Format compact number (1.2K, 1.5M, etc.)
export function formatCompactNumber(num: number): string {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(num);
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
}

// Get date range for queries
export function getDateRange(range: "24h" | "7d" | "30d" | "90d"): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (range) {
        case "24h":
            start.setHours(start.getHours() - 24);
            break;
        case "7d":
            start.setDate(start.getDate() - 7);
            break;
        case "30d":
            start.setDate(start.getDate() - 30);
            break;
        case "90d":
            start.setDate(start.getDate() - 90);
            break;
    }

    return { start, end };
}

// Format date for database storage (YYYY-MM-DD)
export function formatDateForDb(date: Date): string {
    return date.toISOString().split("T")[0];
}

// Parse user agent to get device type
export function getDeviceType(userAgent: string): "desktop" | "mobile" | "tablet" {
    const ua = userAgent.toLowerCase();

    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        return "tablet";
    }

    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return "mobile";
    }

    return "desktop";
}

// Parse user agent to get browser name
export function getBrowserName(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("edg")) return "Edge";
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("opera") || ua.includes("opr")) return "Opera";

    return "Other";
}

// Parse user agent to get both device and browser info
export function parseUserAgent(userAgent: string): { device: string; browser: string } {
    return {
        device: getDeviceType(userAgent),
        browser: getBrowserName(userAgent),
    };
}
