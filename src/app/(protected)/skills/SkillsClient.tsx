"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skills";
import { BackendSkill } from "@prisma/client";

interface SkillsClientProps {
    initialSkills: BackendSkill[];
}

export function SkillsClient({ initialSkills }: SkillsClientProps) {
    const [skills, setSkills] = useState(initialSkills);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [confidence, setConfidence] = useState(1);
    const [practiced, setPracticed] = useState(false);
    const [usedInProject, setUsedInProject] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("confidence", confidence.toString());
        formData.set("practiced", practiced.toString());
        formData.set("usedInProject", usedInProject.toString());

        const result = await createSkill(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setIsCreating(false);
            window.location.reload();
        }
        setIsLoading(false);
    }

    async function handleUpdate(skill: BackendSkill, updates: Partial<BackendSkill>) {
        const formData = new FormData();
        formData.set("skill", skill.skill);
        formData.set("confidence", (updates.confidence ?? skill.confidence).toString());
        formData.set("practiced", (updates.practiced ?? skill.practiced).toString());
        formData.set("usedInProject", (updates.usedInProject ?? skill.usedInProject).toString());

        await updateSkill(skill.id, formData);
        setSkills(
            skills.map((s) => (s.id === skill.id ? { ...s, ...updates } : s))
        );
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this skill?")) return;

        const result = await deleteSkill(id);
        if (result.success) {
            setSkills(skills.filter((s) => s.id !== id));
        }
    }

    const getConfidenceColor = (c: number) => {
        if (c <= 2) return "text-red-500";
        if (c <= 3) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold gradient-text">Backend Skills</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? "Cancel" : "+ New Skill"}
                </Button>
            </div>

            {isCreating && (
                <Card className="mb-6 animate-fade-in">
                    <CardHeader>
                        <CardTitle>💪 Add Backend Skill</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                name="skill"
                                label="Skill Name"
                                placeholder="e.g., Node.js, Docker, PostgreSQL"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confidence Level
                                </label>
                                <Slider value={confidence} onChange={setConfidence} min={1} max={5} />
                            </div>

                            <div className="flex gap-6">
                                <Toggle
                                    checked={practiced}
                                    onChange={setPracticed}
                                    label="Practiced"
                                />
                                <Toggle
                                    checked={usedInProject}
                                    onChange={setUsedInProject}
                                    label="Used in Project"
                                />
                            </div>

                            {error && <p className="text-sm text-red-400">{error}</p>}

                            <Button type="submit" isLoading={isLoading}>
                                Add Skill
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {skills.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-5xl mb-4">💪</div>
                    <h3 className="text-xl font-medium text-white mb-2">No skills yet</h3>
                    <p className="text-gray-400">
                        Add backend skills to track your confidence levels
                    </p>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                        <Card key={skill.id} className="group">
                            <CardHeader className="flex flex-row justify-between items-start">
                                <CardTitle className="flex items-center gap-2">
                                    <span
                                        className={`text-2xl font-bold ${getConfidenceColor(
                                            skill.confidence
                                        )}`}
                                    >
                                        {skill.confidence}
                                    </span>
                                    <span>/5</span>
                                </CardTitle>
                                <button
                                    onClick={() => handleDelete(skill.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                                >
                                    🗑️
                                </button>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-lg font-medium text-white mb-3">
                                    {skill.skill}
                                </h3>
                                <div className="space-y-3">
                                    <Slider
                                        value={skill.confidence}
                                        onChange={(c) => handleUpdate(skill, { confidence: c })}
                                        min={1}
                                        max={5}
                                        showValue={false}
                                    />
                                    <div className="flex gap-4">
                                        <Toggle
                                            checked={skill.practiced}
                                            onChange={(p) => handleUpdate(skill, { practiced: p })}
                                            label="Practiced"
                                        />
                                        <Toggle
                                            checked={skill.usedInProject}
                                            onChange={(u) => handleUpdate(skill, { usedInProject: u })}
                                            label="In Project"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
