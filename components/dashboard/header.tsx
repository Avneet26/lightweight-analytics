"use client";

import { Button } from "@/components/ui/button";
import { Plus, HelpCircle, Menu, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "./sidebar-context";

export function DashboardHeader() {
    const { toggleMobile } = useSidebar();

    return (
        <header className="h-14 border-b border-[#1e1e24] flex items-center justify-between px-4 md:px-8 bg-[#0c0c10] sticky top-0 z-40">
            <div className="flex items-center gap-3">
                {/* Mobile menu toggle */}
                <button
                    onClick={toggleMobile}
                    className="md:hidden p-2 -ml-2 rounded-lg text-[#8a8a94] hover:text-[#e4e4e7] hover:bg-[#18181e] transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Mobile logo */}
                <div className="md:hidden flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
                        <BarChart3 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#e4e4e7]">Analytics</span>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <Link href="/docs" target="_blank">
                    <Button variant="ghost" size="sm">
                        <HelpCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Docs</span>
                    </Button>
                </Link>
                <Link href="/projects/new">
                    <Button size="sm">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Project</span>
                    </Button>
                </Link>
            </div>
        </header>
    );
}
