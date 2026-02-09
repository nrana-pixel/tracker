import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTopics } from "@/actions/topics";
import { getDailyLogs } from "@/actions/logs";
import { LogsClient } from "./LogsClient";

export default async function LogsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const [topics, logs] = await Promise.all([getTopics(), getDailyLogs()]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <LogsClient topics={topics} initialLogs={logs} />
        </div>
    );
}
