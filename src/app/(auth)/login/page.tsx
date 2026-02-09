"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card variant="glass" className="w-full max-w-md animate-fade-in">
                <CardHeader className="text-center">
                    <div className="text-5xl mb-4">🚀</div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <p className="text-gray-400 mt-2">
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

                    <p className="mt-6 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Create one
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
