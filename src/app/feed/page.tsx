import { getPublicFeed } from "@/actions/feed";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";

interface FeedLog {
    id: string;
    user: {
        id: string;
        name: string;
        avatarUrl: string | null;
    };
    date: Date;
    problemsSolved: number;
    revisionVolume: number;
    topic: {
        name: string;
    };
    stars: number;
    notes: string | null;
}

export default async function FeedPage() {
    const { logs, total } = await getPublicFeed(1, 50);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Activity Feed</h1>
                    <p className="text-zinc-400">
                        See what other developers are working on
                    </p>
                </div>
            </div>

            {logs.length === 0 ? (
                <Card variant="glass" className="text-center py-16 border-dashed border-zinc-800">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                            <Icons.Feed className="w-8 h-8 text-zinc-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        No public activity yet
                    </h3>
                    <p className="text-zinc-500">
                        Be the first to share your progress!
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-zinc-500">{total} public logs</p>
                    {logs.map((log: FeedLog) => (
                        <Card key={log.id} variant="glass" className="hover:border-zinc-700 transition-colors group">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <Link href={`/users/${log.user.id}`}>
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-medium text-white shrink-0 overflow-hidden">
                                            {log.user.avatarUrl ? (
                                                <img
                                                    src={log.user.avatarUrl}
                                                    alt={log.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                log.user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                href={`/users/${log.user.id}`}
                                                className="font-medium text-white hover:text-zinc-300 transition-colors"
                                            >
                                                {log.user.name}
                                            </Link>
                                            <span className="text-zinc-600">•</span>
                                            <span className="text-sm text-zinc-500">
                                                {formatDate(log.date)}
                                            </span>
                                        </div>
                                        <div className="text-zinc-300 mb-3 leading-relaxed">
                                            {log.problemsSolved > 0 && (
                                                <span className="inline-flex items-center gap-1.5 mr-2 text-white font-medium">
                                                    <Icons.Check className="w-4 h-4 text-emerald-500/80" />
                                                    Solved {log.problemsSolved} problems
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm bg-white/[0.05] border border-white/[0.05] text-zinc-300">
                                                <Icons.Topics className="w-3 h-3 text-zinc-400" />
                                                {log.topic.name}
                                            </span>
                                        </div>

                                        {log.notes && (
                                            <p className="text-sm text-zinc-400 mb-3 bg-black/20 p-3 rounded-lg border border-white/[0.03]">
                                                {log.notes}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Icons.Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < log.stars ? "fill-white text-white" : "text-zinc-800"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
