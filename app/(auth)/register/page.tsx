"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, BarChart3 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
            } else {
                router.push("/login?registered=true");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0c0c10] relative">
            {/* Subtle gradient background - softer purple */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#7c5eb3]/5 via-transparent to-transparent pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5eb3] to-[#9b7ed9] flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-[#e4e4e7]">Analytics</span>
                </Link>

                {/* Card */}
                <div className="bg-[#101014] border border-[#1e1e24] rounded-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-[#e4e4e7]">Create an account</h1>
                        <p className="text-sm text-[#6b6b75] mt-2">Start tracking your analytics today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-lg bg-[#3d2020] border border-[#5c3030] text-[#f87171] text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<User className="w-4 h-4" />}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />

                        <div className="pt-2">
                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Create account
                            </Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#6b6b75]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#b39ddb] hover:text-[#c7b3e8] font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
