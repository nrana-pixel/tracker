import Link from "next/link";
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
import { Icons } from "@/components/ui/Icons";

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Daily Logs</h1>
                    <p className="text-zinc-400">Track your daily progress</p>
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
                            New Log
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Card className="animate-fade-in border-zinc-800 bg-zinc-900/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icons.Logs className="w-5 h-5" />
                            Log Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topics.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-zinc-400 mb-4">
                                    Create a topic first before logging progress.
                                </p>
                                <Link href="/topics">
                                    <Button variant="secondary">Go to Topics</Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
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

                                <div className="grid md:grid-cols-2 gap-6">
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

                                <div className="grid md:grid-cols-2 gap-6">
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">
                                        Problem URLs (one per line)
                                    </label>
                                    <textarea
                                        name="problemUrls"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20 min-h-[80px] placeholder:text-zinc-600"
                                        placeholder="https://leetcode.com/ problems/two-sum..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-4">
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
                                        <label className="block text-sm font-medium text-zinc-400 mb-4">
                                            Day Rating
                                        </label>
                                        <StarRating value={stars} onChange={setStars} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
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
                <Card className="text-center py-16 border-dashed border-zinc-800 bg-transparent">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-zinc-900">
                            <Icons.Logs className="w-8 h-8 text-zinc-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No logs yet</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto">
                        Start logging your daily progress to track growth
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <Card key={log.id} variant="glass" className="group hover:border-zinc-700 transition-colors">
                            <CardContent className="flex flex-col md:flex-row gap-6 p-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-white/[0.08] text-white border border-white/[0.05]">
                                            <Icons.Topics className="w-3.5 h-3.5 text-zinc-400" />
                                            {log.topic.name}
                                        </span>
                                        <span className="flex items-center text-sm text-zinc-500">
                                            <Icons.Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {formatDate(log.date)}
                                        </span>
                                        {!log.isPublic && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400">
                                                <Icons.Lock className="w-3 h-3" />
                                                Private
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center text-sm text-zinc-400">
                                            <Icons.Check className="w-4 h-4 mr-2 text-emerald-500/80" />
                                            {log.problemsSolved} problems
                                        </div>
                                        <div className="flex items-center text-sm text-zinc-400">
                                            <Icons.Topics className="w-4 h-4 mr-2 text-blue-500/80" />
                                            {log.revisionVolume} revisions
                                        </div>
                                        <div className="flex items-center text-sm text-zinc-400">
                                            <Icons.Energy className="w-4 h-4 mr-2 text-yellow-500/80" />
                                            Energy: {log.energy}/5
                                        </div>
                                        {log.techUsed && (
                                            <div className="flex items-center text-sm text-zinc-400">
                                                <Icons.Cpu className="w-4 h-4 mr-2 text-purple-500/80" />
                                                {log.techUsed}
                                            </div>
                                        )}
                                    </div>

                                    {log.problemUrls && log.problemUrls.length > 0 && (
                                        <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/[0.05]">
                                            {log.problemUrls.map((url: string, i: number) => (
                                                <a
                                                    key={i}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-xs text-zinc-400 hover:text-white transition-colors group/link truncate"
                                                >
                                                    <Icons.Link className="w-3 h-3 mr-2 text-zinc-600 group-hover/link:text-zinc-300" />
                                                    {url}
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {log.notes && (
                                        <p className="text-sm text-zinc-400 italic border-l-2 border-zinc-800 pl-3">
                                            {log.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col items-center justify-between gap-4 border-t md:border-t-0 md:border-l border-white/[0.05] pt-4 md:pt-0 md:pl-6 pl-0">
                                    <div className="flex items-center gap-1 text-yellow-500/80">
                                        <Icons.Star className="w-5 h-5 fill-current" />
                                        <span className="text-lg font-bold text-white">{log.stars}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-500"
                                        title="Delete log"
                                    >
                                        <Icons.Delete className="w-4 h-4" />
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
