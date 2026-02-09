"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { updateProfile } from "@/actions/profile";

interface ProfileClientProps {
    profile: {
        id: string;
        name: string;
        email: string;
        bio: string | null;
        avatarUrl: string | null;
        isPublic: boolean;
        createdAt: Date;
    };
}

export function ProfileClient({ profile }: ProfileClientProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPublic, setIsPublic] = useState(profile.isPublic);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("isPublic", isPublic.toString());

        const result = await updateProfile(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setIsEditing(false);
            window.location.reload();
        }
        setIsLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Profile</h1>

            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                profile.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <CardTitle>{profile.name}</CardTitle>
                            <p className="text-sm text-gray-400">{profile.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                name="name"
                                label="Name"
                                defaultValue={profile.name}
                                required
                            />
                            <Input
                                name="bio"
                                label="Bio"
                                placeholder="Tell us about yourself..."
                                defaultValue={profile.bio || ""}
                            />
                            <Input
                                name="avatarUrl"
                                label="Avatar URL"
                                placeholder="https://..."
                                defaultValue={profile.avatarUrl || ""}
                            />
                            <Toggle
                                checked={isPublic}
                                onChange={setIsPublic}
                                label="Public Profile"
                            />
                            <p className="text-sm text-gray-500">
                                {isPublic
                                    ? "Your profile and public logs are visible to everyone"
                                    : "Your profile is hidden from the public feed"}
                            </p>

                            {error && <p className="text-sm text-red-400">{error}</p>}

                            <Button type="submit" isLoading={isLoading}>
                                Save Changes
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {profile.bio && (
                                <p className="text-gray-300">{profile.bio}</p>
                            )}
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${profile.isPublic
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-gray-500/20 text-gray-400"
                                        }`}
                                >
                                    {profile.isPublic ? "🌍 Public" : "🔒 Private"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Member since{" "}
                                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
