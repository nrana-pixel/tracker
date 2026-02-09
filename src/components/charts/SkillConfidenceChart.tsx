"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icons } from "@/components/ui/Icons";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface SkillConfidenceChartProps {
    data: { skill: string; confidence: number }[];
}

export function SkillConfidenceChart({ data }: SkillConfidenceChartProps) {
    // Monochrome scale based on confidence
    const getColor = (confidence: number) => {
        // Higher confidence -> brighter white, lower -> dimmer (more transparent)
        // using white with opacity
        const opacity = 0.2 + (confidence / 5) * 0.8; // 0.36 to 1.0
        return `rgba(255, 255, 255, ${opacity})`;
    };

    return (
        <Card variant="glass" className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Icons.Skills className="h-4 w-4" />
                    Skill Confidence
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                            <XAxis
                                type="number"
                                domain={[0, 5]}
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                hide // Hide X axis for cleaner look since we have label on bar or tooltip
                            />
                            <YAxis
                                type="category"
                                dataKey="skill"
                                stroke="#a1a1aa" // zinc-400
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(9, 9, 11, 0.9)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                                formatter={(value) => [`${value}/5`, "Confidence"]}
                                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                            />
                            <Bar dataKey="confidence" radius={[0, 4, 4, 0]} barSize={20}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.confidence)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
