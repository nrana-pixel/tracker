"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createResource } from "@/actions/resources";
import { useRouter } from "next/navigation";
import { Toggle } from "@/components/ui/Toggle";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" isLoading={pending} className="w-full">
            Share Resource
        </Button>
    );
}

export default function AddResourcePage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    async function clientAction(formData: FormData) {
        formData.set("isPublic", isPublic.toString());
        const result = await createResource(formData);
        if (result.error) {
            setError(result.error);
        } else {
            router.push("/resources");
            router.refresh();
        }
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Share Resource</h1>

            <Card className="p-6">
                <form action={clientAction} className="space-y-6">
                    <Input
                        name="title"
                        label="Title"
                        placeholder="e.g., Ultimate React Guide"
                        required
                    />

                    <Input
                        name="url"
                        label="URL"
                        placeholder="https://..."
                        type="url"
                        required
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            placeholder="Why is this resource helpful?"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Type</label>
                        <select
                            name="type"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Documentation">Documentation</option>
                            <option value="Video">Video</option>
                            <option value="Article">Article</option>
                            <option value="Course">Course</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <Toggle
                        label="Public Resource"
                        checked={isPublic}
                        onChange={setIsPublic}
                    />
                    <p className="text-xs text-gray-500">
                        Public resources are visible to everyone in the community.
                    </p>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <SubmitButton />
                </form>
            </Card>
        </div>
    );
}
