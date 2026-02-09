"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StarRating } from "@/components/ui/StarRating";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { createDailyLog, deleteDailyLog } from "@/actions/logs";
import { Topic, DailyLog } from "@prisma/client";
import { formatDate, getStarString } from "@/lib/utils";

interface LogsClientProps {
    topics: Topic[];
    initialLogs: (DailyLog & { topic: Topic })[];
}

export function LogsClient({ topics, initialLogs }: LogsClientProps) {
    const [logs, setLogs] = useState(initialLogs);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [stars, setStars] = useState(3);
    const [energy, setEnergy] = useState(3);
    const [isPublic, setIsPublic] = useState(true);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("stars", stars.toString());
        formData.set("energy", energy.toString());
        formData.set("isPublic", isPublic.toString());

        const result = await createDailyLog(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setIsCreating(false);
            window.location.reload();
        }
        setIsLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this log?")) return;

        const result = await deleteDailyLog(id);
        if (result.success) {
            setLogs(logs.filter((l) => l.id !== id));
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold gradient-text">Daily Logs</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? "Cancel" : "+ New Log"}
                </Button>
            </div>

            {isCreating && (
                <Card className="mb-6 animate-fade-in">
                    <CardHeader>
                        <CardTitle>📝 Log Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topics.length === 0 ? (
                            <p className="text-gray-400">
                                Create a topic first before logging progress.
                            </p>
                        ) : (
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Select
                                        name="topicId"
                                        label="Topic"
                                        options={topics.map((t) => ({
                                            value: t.id,
                                            label: t.name,
                                        }))}
                                        required
                                    />
                                    <Input
                                        name="date"
                                        type="date"
                                        label="Date"
                                        defaultValue={new Date().toISOString().split("T")[0]}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        name="problemsSolved"
                                        type="number"
                                        label="Problems Solved"
                                        min={0}
                                        defaultValue={0}
                                    />
                                    <Input
                                        name="revisionVolume"
                                        type="number"
                                        label="Revision Volume"
                                        min={0}
                                        defaultValue={0}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        name="backendWork"
                                        label="Backend Work"
                                        placeholder="What backend work did you do?"
                                    />
                                    <Input
                                        name="techUsed"
                                        label="Tech Used"
                                        placeholder="e.g., Node.js, PostgreSQL"
                                    />
                                </div>

                                <Input
                                    name="notes"
                                    label="Notes"
                                    placeholder="Any additional notes..."
                                />

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">
                                        Problem URLs (one per line)
                                    </label>
                                    <textarea
                                        name="problemUrls"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                        placeholder="https://leetcode.com/ problems/two-sum..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Energy Level
                                        </label>
                                        <Slider
                                            value={energy}
                                            onChange={setEnergy}
                                            min={1}
                                            max={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Day Rating
                                        </label>
                                        <StarRating value={stars} onChange={setStars} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <Toggle
                                        checked={isPublic}
                                        onChange={setIsPublic}
                                        label="Show in public feed"
                                    />
                                    <Button type="submit" isLoading={isLoading}>
                                        Save Log
                                    </Button>
                                </div>

                                {error && <p className="text-sm text-red-400">{error}</p>}
                            </form>
                        )}
                    </CardContent>
                </Card>
            )}

            {logs.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-xl font-medium text-white mb-2">No logs yet</h3>
                    <p className="text-gray-400">
                        Start logging your daily progress to track growth
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <Card key={log.id} className="group">
                            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-lg font-medium text-white">
                                            {log.topic.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(log.date)}
                                        </span>
                                        {!log.isPublic && (
                                            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
                                                Private
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span>💻 {log.problemsSolved} problems</span>
                                        <span>📚 {log.revisionVolume} revisions</span>
                                        <span>⚡ Energy: {log.energy}/5</span>
                                        {log.techUsed && <span>🔧 {log.techUsed}</span>}
                                    </div>
                                    {log.problemUrls && log.problemUrls.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {log.problemUrls.map((url: string, i: number) => (
                                                <a
                                                    key={i}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-xs text-indigo-400 hover:underline truncate"
                                                >
                                                    🔗 {url}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {log.notes && (
                                        <p className="mt-2 text-sm text-gray-500">{log.notes}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg">{getStarString(log.stars)}</span>
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
