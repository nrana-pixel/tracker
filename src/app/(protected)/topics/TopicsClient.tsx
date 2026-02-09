"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createTopic, deleteTopic } from "@/actions/topics";
import { Topic, Category } from "@prisma/client";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";

interface TopicsClientProps {
    initialTopics: (Topic & { _count: { dailyLogs: number } })[];
}

export function TopicsClient({ initialTopics }: TopicsClientProps) {
    const [topics, setTopics] = useState(initialTopics);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await createTopic(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setIsCreating(false);
            window.location.reload();
        }
        setIsLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this topic? All logs will be removed.")) return;

        const result = await deleteTopic(id);
        if (result.success) {
            setTopics(topics.filter((t) => t.id !== id));
        }
    }

    const getCategoryIcon = (category: Category) => {
        switch (category) {
            case "DSA":
                return <Icons.Trending className="w-3.5 h-3.5" />;
            case "Backend":
                return <Icons.Database className="w-3.5 h-3.5" />;
            default:
                return <Icons.Bookmark className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Topics</h1>
                    <p className="text-zinc-400">Manage your learning paths</p>
                </div>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? (
                        <>
                            <Icons.Close className="w-4 h-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Icons.Add className="w-4 h-4 mr-2" />
                            New Topic
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Card className="animate-fade-in border-zinc-800 bg-zinc-900/50">
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <Input
                                    name="name"
                                    label="Topic Name"
                                    placeholder="e.g., Arrays, REST APIs"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    name="category"
                                    label="Category"
                                    options={[
                                        { value: "DSA", label: "DSA" },
                                        { value: "Backend", label: "Backend" },
                                        { value: "Custom", label: "Custom" },
                                    ]}
                                />
                            </div>
                            <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                                Create Topic
                            </Button>
                        </form>
                        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                    </CardContent>
                </Card>
            )}

            {topics.length === 0 ? (
                <Card className="text-center py-16 border-dashed border-zinc-800 bg-transparent">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-zinc-900">
                            <Icons.Topics className="w-8 h-8 text-zinc-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No topics yet</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                        Create your first topic to start tracking your learning progress.
                    </p>
                    <Button onClick={() => setIsCreating(true)} variant="secondary">
                        Create Topic
                    </Button>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map((topic) => (
                        <Card key={topic.id} variant="glass" className="group hover:border-zinc-700 transition-colors">
                            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                                <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-white/[0.05] text-zinc-300 border border-white/[0.05]">
                                        {getCategoryIcon(topic.category)}
                                        {topic.category}
                                    </span>
                                    <Link href={`/topics/${topic.id}`} className="block group-hover:text-white transition-colors">
                                        <CardTitle className="text-xl mt-2">{topic.name}</CardTitle>
                                    </Link>
                                </div>
                                <button
                                    onClick={() => handleDelete(topic.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-500"
                                >
                                    <Icons.Delete className="w-4 h-4" />
                                </button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-zinc-500">
                                    <Icons.Logs className="w-4 h-4 mr-2" />
                                    {topic._count.dailyLogs} logs recorded
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
