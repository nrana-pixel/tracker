"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getTopicLogs(topicId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const topic = await prisma.topic.findFirst({
    where: {
      id: topicId,
      userId: session.user.id,
    },
    include: {
      dailyLogs: {
        orderBy: { date: "desc" },
      },
    },
  });

  return topic;
}
