"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icons } from "@/components/ui/Icons";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface RevisionVolumeChartProps {
    data: { date: string; revisions: number }[];
}

export function RevisionVolumeChart({ data }: RevisionVolumeChartProps) {
    const formattedData = data.map((item) => ({
        name: new Date(item.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
        revisions: item.revisions,
    }));

    return (
        <Card variant="glass" className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Icons.Topics className="h-4 w-4" />
                    Revision Volume
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedData}>
                            <defs>
                                <linearGradient id="revisionGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                                cursor={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revisions"
                                stroke="#ffffff"
                                fillOpacity={1}
                                fill="url(#revisionGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
