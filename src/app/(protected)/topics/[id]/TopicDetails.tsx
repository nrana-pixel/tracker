"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate, getStarString } from "@/lib/utils";
import { deleteDailyLog } from "@/actions/logs";

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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">{topic.name}</h1>
                    <p className="text-gray-400 mt-1">{topic.category}</p>
                </div>
                <Button variant="secondary" onClick={() => router.back()}>
                    Back to Topics
                </Button>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">History ({topic.dailyLogs.length} logs)</h2>

                {topic.dailyLogs.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-400">No logs for this topic yet.</p>
                    </Card>
                ) : (
                    topic.dailyLogs.map((log) => (
                        <Card key={log.id} className="relative group">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">
                                            {formatDate(log.date)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStarString(log.stars)}
                                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                                Energy: {log.energy}/5
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(log.id)}
                                        isLoading={deletingId === log.id}
                                    >
                                        Delete
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    {log.problemsSolved > 0 && (
                                        <div className="bg-white/5 rounded p-3">
                                            <div className="text-sm text-gray-400">Problems Solved</div>
                                            <div className="text-xl font-bold text-white">{log.problemsSolved}</div>
                                        </div>
                                    )}
                                    {log.revisionVolume > 0 && (
                                        <div className="bg-white/5 rounded p-3">
                                            <div className="text-sm text-gray-400">Revisions</div>
                                            <div className="text-xl font-bold text-white">{log.revisionVolume}</div>
                                        </div>
                                    )}
                                </div>

                                {log.notes && (
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-400 mb-1">Notes</div>
                                        <p className="text-gray-200 bg-black/20 p-3 rounded">{log.notes}</p>
                                    </div>
                                )}

                                {log.problemUrls && log.problemUrls.length > 0 && (
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-400 mb-1">Problem Links</div>
                                        <ul className="list-disc list-inside space-y-1">
                                            {log.problemUrls.map((url, idx) => (
                                                <li key={idx}>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-400 hover:text-indigo-300 hover:underline truncate inline-block max-w-full align-bottom"
                                                    >
                                                        {url}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {(log.backendWork || log.techUsed) && (
                                    <div className="border-t border-white/10 pt-4 mt-4">
                                        {log.backendWork && (
                                            <div className="mb-2">
                                                <span className="text-gray-400 text-sm">Update: </span>
                                                <span className="text-gray-200">{log.backendWork}</span>
                                            </div>
                                        )}
                                        {log.techUsed && (
                                            <div>
                                                <span className="text-gray-400 text-sm">Tech: </span>
                                                <span className="text-indigo-300 text-sm font-mono">{log.techUsed}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
