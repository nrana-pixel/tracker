"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/topics", label: "Topics", icon: "📚" },
    { href: "/logs", label: "Daily Logs", icon: "📝" },
    { href: "/skills", label: "Skills", icon: "💪" },
    { href: "/analytics", label: "Analytics", icon: "📈" },
    { href: "/feed", label: "Activity Feed", icon: "🌍" },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                        >
                            🚀 DSA Tracker
                        </Link>

                        {session && (
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                            pathname === item.href
                                                ? "bg-white/10 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <span className="mr-1">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    👤 {session.user.name}
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile nav */}
            {session && (
                <div className="md:hidden border-t border-white/10 px-4 py-2 overflow-x-auto">
                    <div className="flex gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                {item.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
