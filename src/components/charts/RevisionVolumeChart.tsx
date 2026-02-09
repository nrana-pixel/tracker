"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface RevisionVolumeChartProps {
    data: { date: string; revisions: number }[];
}

export function RevisionVolumeChart({ data }: RevisionVolumeChartProps) {
    const formattedData = data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    }));

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revisions"
                        stroke="url(#revisionGradient)"
                        strokeWidth={3}
                        dot={{ fill: "#34d399", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#6ee7b7" }}
                    />
                    <defs>
                        <linearGradient id="revisionGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#6ee7b7" />
                        </linearGradient>
                    </defs>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
