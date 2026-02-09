import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTopics } from "@/actions/topics";
import { TopicsClient } from "./TopicsClient";

export default async function TopicsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const topics = await getTopics();

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <TopicsClient initialTopics={topics} />
        </div>
    );
}
