"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

const navItems = [
    { href: "/dashboard", label: "Dashboard", Icon: Icons.Dashboard },
    { href: "/topics", label: "Topics", Icon: Icons.Topics },
    { href: "/logs", label: "Logs", Icon: Icons.Logs },
    { href: "/skills", label: "Skills", Icon: Icons.Skills },
    { href: "/resources", label: "Resources", Icon: Icons.Doc },
    { href: "/analytics", label: "Analytics", Icon: Icons.Analytics },
    { href: "/feed", label: "Feed", Icon: Icons.Feed },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-lg font-semibold tracking-tight text-white flex items-center gap-2"
                        >
                            <Icons.Trending className="w-5 h-5" />
                            <span>Tracker</span>
                        </Link>

                        {session && (
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2",
                                            pathname === item.href
                                                ? "bg-white text-black font-medium"
                                                : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                                        )}
                                    >
                                        <item.Icon className="w-4 h-4" />
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
                                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <Icons.User className="w-4 h-4" />
                                    {session.user.name}
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    <Icons.Logout className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile nav */}
            {session && (
                <div className="md:hidden border-t border-white/[0.08] px-4 py-3 overflow-x-auto bg-black/90 backdrop-blur-xl">
                    <div className="flex gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2",
                                    pathname === item.href
                                        ? "bg-white text-black"
                                        : "text-zinc-400 hover:text-white"
                                )}
                            >
                                <item.Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
