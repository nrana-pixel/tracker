import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats, getChartData } from "@/actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { WeeklyDSAChart } from "@/components/charts/WeeklyDSAChart";
import { RevisionVolumeChart } from "@/components/charts/RevisionVolumeChart";
import { SkillConfidenceChart } from "@/components/charts/SkillConfidenceChart";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const stats = await getDashboardStats();
    const chartData = await getChartData();

    if (!stats) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-zinc-500">Failed to load dashboard</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                        Dashboard
                    </h1>
                    <p className="text-zinc-400">
                        Welcome back, {session.user?.name}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/logs">
                        <Button>
                            <Icons.Logs className="mr-2 h-4 w-4" />
                            Log Progress
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="glass" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                            <Icons.Energy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Streak</p>
                            <h3 className="text-2xl font-bold text-white">{stats.streak}</h3>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                            <Icons.Trending className="w-6 h-6 text-white" />
                            <Icons.Logs className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Problems</p>
                            <h3 className="text-2xl font-bold text-white">
                                {stats.weeklyProblems}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                            <Icons.Topics className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Revisions</p>
                            <h3 className="text-2xl font-bold text-white">
                                {stats.weeklyRevisions}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                            <Icons.Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Avg Rating</p>
                            <h3 className="text-2xl font-bold text-white">{stats.avgStars}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                    {chartData?.dailyProgress && (
                        <WeeklyDSAChart data={chartData.dailyProgress} />
                    )}
                </div>

                <div className="h-[300px]">
                    {chartData?.dailyProgress && (
                        <RevisionVolumeChart data={chartData.dailyProgress} />
                    )}
                </div>
            </div>

            {/* Skill Confidence */}
            {chartData?.skillConfidence && chartData.skillConfidence.length > 0 && (
                <div className="h-[300px]">
                    <SkillConfidenceChart data={chartData.skillConfidence} />
                </div>
            )}

            {/* Weak Topics & Low Confidence */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card variant="glass" className="p-6">
                    <div className="flex items-center text-zinc-500 mb-6 gap-2">
                        <Icons.Alert className="w-5 h-5 text-red-400/80" />
                        <h3 className="font-medium text-white">Weak Topics</h3>
                    </div>
                    <CardContent className="p-0">
                        {stats.weakTopics.length > 0 ? (
                            <ul className="space-y-3">
                                {stats.weakTopics.map((topic: any) => (
                                    <li
                                        key={topic.id}
                                        className="flex justify-between items-center p-3 rounded-md bg-white/[0.03] border border-white/[0.05]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icons.Topics className="w-4 h-4 text-zinc-500" />
                                            <span className="text-zinc-200">{topic.name}</span>
                                        </div>
                                        <span className="text-xs text-zinc-500 bg-white/[0.05] px-2 py-1 rounded">
                                            {topic.totalProblems} problems
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-zinc-500 flex flex-col items-center gap-2">
                                <Icons.Check className="w-8 h-8 text-emerald-500/50" />
                                <p>No weak topics found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card variant="glass" className="p-6">
                    <div className="flex items-center text-zinc-500 mb-6 gap-2">
                        <Icons.Alert className="w-5 h-5 text-yellow-500/80" />
                        <h3 className="font-medium text-white">Focus Areas</h3>
                    </div>
                    <CardContent className="p-0">
                        {stats.lowConfidenceSkills.length > 0 ? (
                            <ul className="space-y-3">
                                {stats.lowConfidenceSkills.map((skill: any) => (
                                    <li
                                        key={skill.id}
                                        className="flex justify-between items-center p-3 rounded-md bg-white/[0.03] border border-white/[0.05]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icons.Skills className="w-4 h-4 text-zinc-500" />
                                            <span className="text-zinc-200">{skill.skill}</span>
                                        </div>
                                        <span className="text-xs text-red-400 font-medium">
                                            {skill.confidence}/5
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-zinc-500 flex flex-col items-center gap-2">
                                <Icons.Check className="w-8 h-8 text-emerald-500/50" />
                                <p>All skills on track</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
