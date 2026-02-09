import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getChartData } from "@/actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { WeeklyDSAChart } from "@/components/charts/WeeklyDSAChart";
import { RevisionVolumeChart } from "@/components/charts/RevisionVolumeChart";
import { SkillConfidenceChart } from "@/components/charts/SkillConfidenceChart";

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const chartData = await getChartData();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Analytics</h1>

            {!chartData ? (
                <Card className="text-center py-12">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        No data yet
                    </h3>
                    <p className="text-gray-400">
                        Start logging your progress to see analytics
                    </p>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>📈 Problems Solved (Last 14 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WeeklyDSAChart data={chartData.dailyProgress} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>📚 Revision Volume (Last 14 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RevisionVolumeChart data={chartData.dailyProgress} />
                        </CardContent>
                    </Card>

                    {chartData.skillConfidence.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>💪 Backend Skills Confidence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SkillConfidenceChart data={chartData.skillConfidence} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card variant="glass" className="text-center">
                            <div className="text-3xl font-bold text-white">
                                {chartData.dailyProgress.reduce((s, d) => s + d.problems, 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Problems (14d)</div>
                        </Card>
                        <Card variant="glass" className="text-center">
                            <div className="text-3xl font-bold text-white">
                                {chartData.dailyProgress.reduce((s, d) => s + d.revisions, 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Revisions (14d)</div>
                        </Card>
                        <Card variant="glass" className="text-center">
                            <div className="text-3xl font-bold text-white">
                                {chartData.skillConfidence.length}
                            </div>
                            <div className="text-sm text-gray-400">Skills Tracked</div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
