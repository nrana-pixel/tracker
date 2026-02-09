"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ... existing handleSubmit ...
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
            <Card variant="glass" className="w-full max-w-md animate-fade-in">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                            <Icons.User className="w-8 h-8 text-zinc-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                    <p className="text-zinc-400 mt-2">
                        Sign in to continue tracking your progress
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-white hover:underline underline-offset-4 decoration-zinc-700 transition-all font-medium"
                        >
                            Create one
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
