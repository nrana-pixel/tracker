import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats, getChartData } from "@/actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { WeeklyDSAChart } from "@/components/charts/WeeklyDSAChart";
import { RevisionVolumeChart } from "@/components/charts/RevisionVolumeChart";
import { SkillConfidenceChart } from "@/components/charts/SkillConfidenceChart";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const stats = await getDashboardStats();
    const chartData = await getChartData();

    if (!stats) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-gray-400">Failed to load dashboard</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">
                <span className="gradient-text">Dashboard</span>
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card variant="glass" className="text-center">
                    <div className="text-4xl mb-2">🔥</div>
                    <div className="text-3xl font-bold text-white">{stats.streak}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                </Card>

                <Card variant="glass" className="text-center">
                    <div className="text-4xl mb-2">💻</div>
                    <div className="text-3xl font-bold text-white">
                        {stats.weeklyProblems}
                    </div>
                    <div className="text-sm text-gray-400">Weekly Problems</div>
                </Card>

                <Card variant="glass" className="text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-3xl font-bold text-white">
                        {stats.weeklyRevisions}
                    </div>
                    <div className="text-sm text-gray-400">Weekly Revisions</div>
                </Card>

                <Card variant="glass" className="text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-3xl font-bold text-white">{stats.avgStars}</div>
                    <div className="text-sm text-gray-400">Avg Rating</div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>📈 Problems Solved (14 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {chartData?.dailyProgress && (
                            <WeeklyDSAChart data={chartData.dailyProgress} />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>📚 Revision Volume (14 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {chartData?.dailyProgress && (
                            <RevisionVolumeChart data={chartData.dailyProgress} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Skill Confidence */}
            {chartData?.skillConfidence && chartData.skillConfidence.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>💪 Backend Skills Confidence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SkillConfidenceChart data={chartData.skillConfidence} />
                    </CardContent>
                </Card>
            )}

            {/* Weak Topics & Low Confidence */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>🔴 Weak Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.weakTopics.length > 0 ? (
                            <ul className="space-y-2">
                                {stats.weakTopics.map((topic) => (
                                    <li
                                        key={topic.id}
                                        className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                                    >
                                        <span className="text-white">{topic.name}</span>
                                        <span className="text-sm text-gray-400">
                                            {topic.totalProblems} problems
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-4">
                                🎉 No weak topics! Keep it up!
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>⚠️ Skills Needing Focus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.lowConfidenceSkills.length > 0 ? (
                            <ul className="space-y-2">
                                {stats.lowConfidenceSkills.map((skill) => (
                                    <li
                                        key={skill.id}
                                        className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                                    >
                                        <span className="text-white">{skill.skill}</span>
                                        <span className="text-sm text-red-400">
                                            Confidence: {skill.confidence}/5
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-4">
                                ✨ All skills on track!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex gap-4 justify-center">
                <Link
                    href="/logs"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    📝 Log Progress
                </Link>
                <Link
                    href="/topics"
                    className="px-6 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-all"
                >
                    📚 Manage Topics
                </Link>
            </div>
        </div>
    );
}
