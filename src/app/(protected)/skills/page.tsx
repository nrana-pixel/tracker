import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSkills } from "@/actions/skills";
import { SkillsClient } from "./SkillsClient";

export default async function SkillsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const skills = await getSkills();

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <SkillsClient initialSkills={skills} />
        </div>
    );
}
