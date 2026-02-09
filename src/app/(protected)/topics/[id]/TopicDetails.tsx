"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate, getStarString } from "@/lib/utils";
import { deleteDailyLog } from "@/actions/logs";
import { Icons } from "@/components/ui/Icons";
import Link from "next/link";

interface Log {
    id: string;
    date: Date;
    problemsSolved: number;
    revisionVolume: number;
    energy: number;
    stars: number;
    notes: string | null;
    problemUrls: string[];
    backendWork: string | null;
    techUsed: string | null;
}

interface Topic {
    id: string;
    name: string;
    category: string;
    dailyLogs: Log[];
}

export default function TopicDetails({ topic }: { topic: Topic }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this log?")) return;
        setDeletingId(id);
        await deleteDailyLog(id);
        setDeletingId(null);
        router.refresh();
    };

    const allProblemUrls = topic.dailyLogs
        .flatMap((log) => log.problemUrls || [])
        .filter((url) => url.length > 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/topics" className="text-zinc-400 hover:text-white transition-colors">
                            <Icons.ArrowRight className="w-4 h-4 rotate-180" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{topic.name}</h1>
                    </div>
                    <p className="text-zinc-400 ml-6">
                        {topic.category} • {topic.dailyLogs.length} logs
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/resources?topicId=${topic.id}`}>
                        <Button variant="secondary">
                            <Icons.Doc className="w-4 h-4 mr-2" />
                            Resources
                        </Button>
                    </Link>
                    <Link href="/logs">
                        <Button>
                            <Icons.Add className="w-4 h-4 mr-2" />
                            Log Progress
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content - Logs */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Icons.Logs className="w-5 h-5" />
                        History
                    </h2>

                    {topic.dailyLogs.length === 0 ? (
                        <Card className="text-center py-12 border-dashed border-zinc-800 bg-transparent">
                            <p className="text-zinc-500">No logs recorded for this topic.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {topic.dailyLogs.map((log) => (
                                <Card key={log.id} variant="glass" className="group hover:border-zinc-700 transition-colors">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Icons.Calendar className="w-4 h-4" />
                                                <span className="text-sm">{formatDate(log.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-yellow-500/80">
                                                    <Icons.Star className="w-4 h-4 fill-current" />
                                                    <span className="font-bold">{log.stars}</span>
                                                </div>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
                                                    onClick={() => handleDelete(log.id)}
                                                    isLoading={deletingId === log.id}
                                                >
                                                    <Icons.Delete className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white/[0.03] rounded-lg p-3">
                                                <span className="text-xs text-zinc-500 block mb-1">Problems</span>
                                                <div className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <Icons.Check className="w-4 h-4 text-emerald-500/80" />
                                                    {log.problemsSolved}
                                                </div>
                                            </div>
                                            <div className="bg-white/[0.03] rounded-lg p-3">
                                                <span className="text-xs text-zinc-500 block mb-1">Revisions</span>
                                                <div className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <Icons.Topics className="w-4 h-4 text-blue-500/80" />
                                                    {log.revisionVolume}
                                                </div>
                                            </div>
                                        </div>

                                        {log.notes && (
                                            <p className="text-sm text-zinc-300 italic mb-4 border-l-2 border-zinc-700 pl-3">
                                                {log.notes}
                                            </p>
                                        )}

                                        {log.problemUrls && log.problemUrls.length > 0 && (
                                            <div className="space-y-1">
                                                {log.problemUrls.map((url, i) => (
                                                    <a
                                                        key={i}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 truncate"
                                                    >
                                                        <Icons.Link className="w-3 h-3 mr-1.5" />
                                                        {url}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar - Problem URLs */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Icons.Link className="w-5 h-5" />
                        Problem Bank
                    </h2>

                    <Card variant="glass" className="h-fit">
                        <CardContent className="p-4">
                            {allProblemUrls.map((url, i) => (
                                <div key={i} className="flex items-start gap-2 mb-3 last:mb-0 group">
                                    <Icons.Check className="w-3.5 h-3.5 text-emerald-500/50 mt-1 shrink-0 group-hover:text-emerald-500 transition-colors" />
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-zinc-400 hover:text-white break-all transition-colors line-clamp-2"
                                    >
                                        {url}
                                    </a>
                                </div>
                            ))}
                            {allProblemUrls.length === 0 && (
                                <p className="text-sm text-zinc-500 text-center py-4">
                                    No problems solved yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
