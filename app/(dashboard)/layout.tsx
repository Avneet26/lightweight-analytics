import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <SidebarProvider>
                <div className="flex min-h-screen bg-[#0c0c10]">
                    <Sidebar />
                    <DashboardContent>
                        <DashboardHeader />
                        <main className="flex-1 p-4 md:p-6 lg:p-8">
                            {children}
                        </main>
                    </DashboardContent>
                </div>
            </SidebarProvider>
        </SessionProvider>
    );
}
