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
    ChevronRight
} from "lucide-react";

const navigation = [
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside className="w-60 min-w-60 h-screen fixed left-0 top-0 bg-[#101014] border-r border-[#1e1e24] flex flex-col z-50">
            {/* Logo */}
            <div className="h-14 flex items-center gap-3 px-5 border-b border-[#1e1e24]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-[#e4e4e7]">Analytics</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center gap-3 
                px-4 py-2.5 
                rounded-lg 
                text-sm font-medium 
                transition-all duration-150
                ${isActive
                                    ? "bg-[#7c5eb3]/10 text-[#b39ddb] border border-[#7c5eb3]/20"
                                    : "text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] border border-transparent"
                                }
              `}
                        >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight className="w-3 h-3" />}
                        </Link>
                    );
                })}

                {/* New Project Button */}
                <div className="pt-4 mt-4 border-t border-[#1e1e24]">
                    <Link
                        href="/projects/new"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] transition-all duration-150"
                    >
                        <Plus className="w-4 h-4 flex-shrink-0" />
                        <span>New Project</span>
                    </Link>
                </div>
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-[#1e1e24]">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#e4e4e7] truncate">
                            {session?.user?.name || "User"}
                        </p>
                        <p className="text-xs text-[#6b6b75] truncate">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] transition-all duration-150"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
}
