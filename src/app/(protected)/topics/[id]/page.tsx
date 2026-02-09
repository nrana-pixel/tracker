import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TopicDetails from "./TopicDetails";

export default async function TopicPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const topic = await prisma.topic.findUnique({
        where: {
            id: params.id,
            userId: session.user.id,
        },
        include: {
            dailyLogs: {
                orderBy: { date: "desc" },
            },
        },
    });

    if (!topic) notFound();

    return <TopicDetails topic={topic} />;
}
