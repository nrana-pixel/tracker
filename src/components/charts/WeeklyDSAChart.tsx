"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icons } from "@/components/ui/Icons";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface WeeklyDSAChartProps {
    data: { date: string; problems: number }[];
}

export function WeeklyDSAChart({ data }: WeeklyDSAChartProps) {
    const formattedData = data.map((item) => ({
        name: new Date(item.date).toLocaleDateString("en-US", { weekday: 'short' }),
        problems: item.problems,
    }));

    return (
        <Card variant="glass" className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Icons.Analytics className="h-4 w-4" />
                    Weekly Progress
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedData}>
                            <XAxis
                                dataKey="name"
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                            />
                            <Bar
                                dataKey="problems"
                                fill="#ffffff"
                                radius={[4, 4, 0, 0]}
                                className="fill-white"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
