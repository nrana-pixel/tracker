import { getPublicProfile } from "@/actions/feed";
import { Card, CardContent } from "@/components/ui/Card";
import { notFound } from "next/navigation";
import { formatDate, getStarString } from "@/lib/utils";
import Link from "next/link";

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
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
            {/* Profile Header */}
            <Card className="mb-8">
                <CardContent className="flex flex-col md:flex-row items-center gap-6 py-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
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
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                        {user.bio && <p className="text-gray-400 mt-1">{user.bio}</p>}
                        <p className="text-sm text-gray-500 mt-2">
                            Member since{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        {isOwner && (
                            <Link
                                href="/profile"
                                className="inline-block mt-2 text-sm text-indigo-400 hover:underline"
                            >
                                Edit Profile →
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card variant="glass" className="text-center p-4">
                    <div className="text-2xl font-bold text-white">
                        {stats.totalProblems}
                    </div>
                    <div className="text-xs text-gray-400">Problems</div>
                </Card>
                <Card variant="glass" className="text-center p-4">
                    <div className="text-2xl font-bold text-white">
                        {stats.totalRevisions}
                    </div>
                    <div className="text-xs text-gray-400">Revisions</div>
                </Card>
                <Card variant="glass" className="text-center p-4">
                    <div className="text-2xl font-bold text-white">{stats.totalLogs}</div>
                    <div className="text-xs text-gray-400">Logs</div>
                </Card>
                <Card variant="glass" className="text-center p-4">
                    <div className="text-2xl font-bold text-white">{stats.avgStars}</div>
                    <div className="text-xs text-gray-400">Avg Rating</div>
                </Card>
            </div>

            {/* Recent Activity */}
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            {recentLogs.length === 0 ? (
                <Card className="text-center py-8">
                    <p className="text-gray-400">No public activity</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {recentLogs.map((log) => (
                        <Card key={log.id}>
                            <CardContent className="flex justify-between items-center">
                                <div>
                                    <span className="text-white">{log.topic.name}</span>
                                    <span className="text-gray-500 text-sm ml-3">
                                        {log.problemsSolved} problems · {log.revisionVolume}{" "}
                                        revisions
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>{getStarString(log.stars)}</span>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(log.date)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
