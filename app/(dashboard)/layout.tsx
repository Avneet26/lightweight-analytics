import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="flex min-h-screen bg-[#0c0c10]">
                <Sidebar />
                <div className="flex-1 ml-60 min-h-screen flex flex-col">
                    <DashboardHeader />
                    <main className="flex-1 p-8">
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    );
}
