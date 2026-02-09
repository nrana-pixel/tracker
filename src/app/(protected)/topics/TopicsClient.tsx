"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createTopic, deleteTopic } from "@/actions/topics";
import { Topic, Category } from "@prisma/client";

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
            // Refresh topics
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

    const getCategoryEmoji = (category: Category) => {
        switch (category) {
            case "DSA":
                return "🧮";
            case "Backend":
                return "⚙️";
            default:
                return "📌";
        }
    };

    const getCategoryColor = (category: Category) => {
        switch (category) {
            case "DSA":
                return "bg-blue-500/20 text-blue-400";
            case "Backend":
                return "bg-green-500/20 text-green-400";
            default:
                return "bg-purple-500/20 text-purple-400";
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold gradient-text">Topics</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? "Cancel" : "+ New Topic"}
                </Button>
            </div>

            {isCreating && (
                <Card className="mb-6 animate-fade-in">
                    <CardContent>
                        <form onSubmit={handleCreate} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    name="name"
                                    label="Topic Name"
                                    placeholder="e.g., Arrays, REST APIs"
                                    required
                                />
                            </div>
                            <div className="w-40">
                                <Select
                                    name="category"
                                    label="Category"
                                    options={[
                                        { value: "DSA", label: "🧮 DSA" },
                                        { value: "Backend", label: "⚙️ Backend" },
                                        { value: "Custom", label: "📌 Custom" },
                                    ]}
                                />
                            </div>
                            <Button type="submit" isLoading={isLoading}>
                                Create
                            </Button>
                        </form>
                        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                    </CardContent>
                </Card>
            )}

            {topics.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-xl font-medium text-white mb-2">No topics yet</h3>
                    <p className="text-gray-400">
                        Create your first topic to start tracking progress
                    </p>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map((topic) => (
                        <Card key={topic.id} className="group">
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getCategoryColor(
                                            topic.category
                                        )}`}
                                    >
                                        {getCategoryEmoji(topic.category)} {topic.category}
                                    </span>
                                    <CardTitle>{topic.name}</CardTitle>
                                </div>
                                <button
                                    onClick={() => handleDelete(topic.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                                >
                                    🗑️
                                </button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-400">
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
