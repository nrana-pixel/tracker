"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface SkillConfidenceChartProps {
    data: { skill: string; confidence: number }[];
}

export function SkillConfidenceChart({ data }: SkillConfidenceChartProps) {
    const getColor = (confidence: number) => {
        if (confidence <= 2) return "#ef4444";
        if (confidence <= 3) return "#eab308";
        return "#22c55e";
    };

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        type="number"
                        domain={[0, 5]}
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="skill"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                        width={100}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                        formatter={(value) => [`${value}/5`, "Confidence"]}
                    />
                    <Bar dataKey="confidence" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.confidence)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
