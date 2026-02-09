"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await registerUser(formData);

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/login?registered=true");
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
                    <div className="text-5xl mb-4">🎯</div>
                    <CardTitle className="text-2xl">Start Your Journey</CardTitle>
                    <p className="text-gray-400 mt-2">
                        Create an account to track your DSA & backend progress
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="name"
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            required
                        />
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
                            minLength={6}
                        />

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
