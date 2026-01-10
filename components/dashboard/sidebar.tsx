"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    BarChart3,
    FolderKanban,
    Settings,
    LogOut,
    Plus,
    ChevronRight,
    ChevronLeft,
    X
} from "lucide-react";
import { useSidebar } from "./sidebar-context";

const navigation = [
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className={`h-14 flex items-center border-b border-[#1e1e24] ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-5'}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-white" />
                </div>
                {!isCollapsed && (
                    <span className="text-base font-semibold text-[#e4e4e7] whitespace-nowrap">Analytics</span>
                )}
                {/* Mobile close button */}
                <button
                    onClick={closeMobile}
                    className="md:hidden ml-auto p-1.5 rounded-lg text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 p-3 space-y-1.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeMobile}
                            title={isCollapsed ? item.name : undefined}
                            className={`
                                flex items-center
                                ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'}
                                py-2.5 
                                rounded-lg 
                                text-sm font-medium 
                                transition-all duration-200
                                group
                                ${isActive
                                    ? "bg-[#7c5eb3]/10 text-[#b39ddb] border border-[#7c5eb3]/20"
                                    : "text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] border border-transparent"
                                }
                            `}
                        >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1">{item.name}</span>
                                    {isActive && <ChevronRight className="w-3 h-3" />}
                                </>
                            )}
                        </Link>
                    );
                })}

                {/* New Project Button */}
                <div className="pt-3 mt-3 border-t border-[#1e1e24]">
                    <Link
                        href="/projects/new"
                        onClick={closeMobile}
                        title={isCollapsed ? "New Project" : undefined}
                        className={`
                            flex items-center 
                            ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'}
                            py-2.5 rounded-lg text-sm font-medium 
                            text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] 
                            transition-all duration-200
                        `}
                    >
                        <Plus className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && <span>New Project</span>}
                    </Link>
                </div>
            </nav>

            {/* Collapse toggle - Desktop only */}
            <div className="hidden md:block p-3 border-t border-[#1e1e24]">
                <button
                    onClick={toggleCollapse}
                    className={`
                        flex items-center w-full
                        ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'}
                        py-2.5 rounded-lg text-sm font-medium
                        text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e]
                        transition-all duration-200
                    `}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* User section */}
            <div className={`p-3 border-t border-[#1e1e24] ${isCollapsed ? 'px-2' : 'px-3'}`}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 mb-2`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#e4e4e7] truncate">
                                {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-[#6b6b75] truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title={isCollapsed ? "Sign out" : undefined}
                    className={`
                        flex items-center w-full
                        ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'}
                        py-2 rounded-lg text-sm 
                        text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] 
                        transition-all duration-200
                    `}
                >
                    <LogOut className="w-4 h-4" />
                    {!isCollapsed && <span>Sign out</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMobile}
                />
            )}

            {/* Desktop sidebar */}
            <aside
                className={`
                    hidden md:flex flex-col
                    h-screen fixed left-0 top-0 
                    bg-[#101014] border-r border-[#1e1e24] 
                    z-50
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-16' : 'w-60'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Mobile sidebar */}
            <aside
                className={`
                    md:hidden flex flex-col
                    h-screen fixed left-0 top-0 
                    w-72 max-w-[80vw]
                    bg-[#101014] border-r border-[#1e1e24] 
                    z-50
                    transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
