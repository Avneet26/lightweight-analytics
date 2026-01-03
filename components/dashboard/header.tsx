"use client";

import { Button } from "@/components/ui/button";
import { Plus, HelpCircle } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
    return (
        <header className="h-14 border-b border-[#1e1e24] flex items-center justify-between px-8 bg-[#0c0c10] sticky top-0 z-40">
            <div>
                {/* Breadcrumb or page title can go here */}
            </div>
            <div className="flex items-center gap-3">
                <Link href="/docs" target="_blank">
                    <Button variant="ghost" size="sm">
                        <HelpCircle className="w-4 h-4" />
                        Docs
                    </Button>
                </Link>
                <Link href="/projects/new">
                    <Button size="sm">
                        <Plus className="w-4 h-4" />
                        New Project
                    </Button>
                </Link>
            </div>
        </header>
    );
}
