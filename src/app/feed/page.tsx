import { getPublicFeed } from "@/actions/feed";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { formatDate, getStarString } from "@/lib/utils";

export default async function FeedPage() {
    const { logs, total } = await getPublicFeed(1, 50);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 gradient-text">Activity Feed</h1>
            <p className="text-gray-400 mb-8">
                See what other developers are working on 🚀
            </p>

            {logs.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-5xl mb-4">🌍</div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        No public activity yet
                    </h3>
                    <p className="text-gray-400">
                        Be the first to share your progress!
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">{total} public logs</p>
                    {logs.map((log) => (
                        <Card key={log.id} className="hover:border-white/20 transition-colors">
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <Link href={`/users/${log.user.id}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm shrink-0">
                                            {log.user.avatarUrl ? (
                                                <img
                                                    src={log.user.avatarUrl}
                                                    alt={log.user.name}
                                                    className="w-full h-full rounded-full object-cover"
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
                                                className="font-medium text-white hover:text-indigo-400 transition-colors"
                                            >
                                                {log.user.name}
                                            </Link>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(log.date)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-2">
                                            {log.problemsSolved > 0 && (
                                                <>
                                                    Solved <span className="text-indigo-400 font-medium">{log.problemsSolved} problems</span> in{" "}
                                                </>
                                            )}
                                            {log.revisionVolume > 0 && log.problemsSolved === 0 && (
                                                <>Revised </>
                                            )}
                                            <span className="text-purple-400 font-medium">
                                                {log.topic.name}
                                            </span>
                                            {log.revisionVolume > 0 && (
                                                <span className="text-gray-400">
                                                    {" "}({log.revisionVolume} revisions)
                                                </span>
                                            )}
                                            {" "}{getStarString(log.stars)}
                                        </p>
                                        {log.notes && (
                                            <p className="text-sm text-gray-500 truncate">
                                                💬 {log.notes}
                                            </p>
                                        )}
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
