"use client";

import { useSidebar } from "./sidebar-context";

interface DashboardContentProps {
    children: React.ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div
            className={`
                flex-1 min-h-screen flex flex-col
                transition-all duration-300 ease-in-out
                ml-0 md:ml-16
                ${!isCollapsed ? 'md:ml-60' : 'md:ml-16'}
            `}
        >
            {children}
        </div>
    );
}
