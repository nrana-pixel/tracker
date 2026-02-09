import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const profile = await getProfile();
    if (!profile) redirect("/login");

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <ProfileClient profile={profile} />
        </div>
    );
}
