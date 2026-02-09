import { getPublicProfile } from "@/actions/feed";
import { Card, CardContent } from "@/components/ui/Card";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";

interface Props {
    params: { id: string };
}

export default async function UserProfilePage({ params }: Props) {
    const data = await getPublicProfile(params.id);

    if (!data) {
        notFound();
    }

    const { user, stats, recentLogs, isOwner } = data;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in space-y-8">
            {/* Profile Header */}
            <Card variant="glass" className="mb-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-800/50 to-transparent pointer-events-none" />
                <CardContent className="flex flex-col md:flex-row items-center gap-6 py-8 relative pt-12">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                                {user.bio && <p className="text-zinc-400 mb-2 max-w-md">{user.bio}</p>}
                                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1.5">
                                        <Icons.Calendar className="w-3.5 h-3.5" />
                                        Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                            {isOwner && (
                                <Link
                                    href="/profile"
                                    className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
                                >
                                    Edit Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="glass" className="text-center p-6 hover:border-zinc-700 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1">
                        {stats.totalProblems}
                    </div>
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Problems</div>
                </Card>
                <Card variant="glass" className="text-center p-6 hover:border-zinc-700 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1">
                        {stats.totalRevisions}
                    </div>
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Revisions</div>
                </Card>
                <Card variant="glass" className="text-center p-6 hover:border-zinc-700 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalLogs}</div>
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Logs</div>
                </Card>
                <Card variant="glass" className="text-center p-6 hover:border-zinc-700 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1">{stats.avgStars}</div>
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Avg Rating</div>
                </Card>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Icons.Trending className="w-5 h-5 text-zinc-400" />
                    Recent Activity
                </h2>
                {recentLogs.length === 0 ? (
                    <Card variant="glass" className="text-center py-12 border-dashed border-zinc-800">
                        <Icons.Logs className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-500">No public activity yet</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {recentLogs.map((log: any) => (
                            <Card key={log.id} variant="glass" className="hover:border-zinc-700 transition-colors group">
                                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                                            <Icons.Topics className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-white font-medium block">{log.topic.name}</span>
                                            <span className="text-zinc-500 text-xs flex items-center gap-2">
                                                {formatDate(log.date)}
                                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                                {log.problemsSolved} problems
                                                {log.revisionVolume > 0 && ` · ${log.revisionVolume} revisions`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Icons.Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < log.stars ? "fill-white text-white" : "text-zinc-800"}`}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
