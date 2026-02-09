"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
            <Card variant="glass" className="w-full max-w-md animate-fade-in">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                            <Icons.Add className="w-8 h-8 text-zinc-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-white">Start Your Journey</CardTitle>
                    <p className="text-zinc-400 mt-2">
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

                    <p className="mt-8 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-white hover:underline underline-offset-4 decoration-zinc-700 transition-all font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
