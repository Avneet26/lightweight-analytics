"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, LogOut } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="max-w-2xl space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-[#e4e4e7]">Settings</h1>
                <p className="text-sm text-[#6b6b75] mt-1">Manage your account settings</p>
            </div>

            {/* Profile Section */}
            <div className="bg-[#101014] border border-[#1e1e24] rounded-xl">
                <div className="px-6 py-4 border-b border-[#1e1e24]">
                    <h2 className="text-lg font-semibold text-[#e4e4e7]">Profile</h2>
                    <p className="text-sm text-[#6b6b75]">Your account information</p>
                </div>
                <div className="p-6 space-y-5">
                    <Input
                        label="Name"
                        type="text"
                        value={session?.user?.name || ""}
                        disabled
                        icon={<User className="w-4 h-4" />}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={session?.user?.email || ""}
                        disabled
                        icon={<Mail className="w-4 h-4" />}
                    />
                    <p className="text-xs text-[#6b6b75]">
                        Profile editing coming soon
                    </p>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#101014] border border-[#3d2020] rounded-xl">
                <div className="px-6 py-4 border-b border-[#3d2020]">
                    <h2 className="text-lg font-semibold text-[#f87171]">Danger Zone</h2>
                    <p className="text-sm text-[#6b6b75]">Irreversible actions</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-[#e4e4e7]">Sign out</p>
                            <p className="text-sm text-[#6b6b75]">Sign out of your account on this device</p>
                        </div>
                        <Button variant="danger" onClick={handleSignOut} isLoading={isLoading}>
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
