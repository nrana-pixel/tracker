"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getPublicFeed(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const logs = await prisma.dailyLog.findMany({
    where: {
      isPublic: true,
      user: { isPublic: true },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      topic: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  });

  const total = await prisma.dailyLog.count({
    where: {
      isPublic: true,
      user: { isPublic: true },
    },
  });

  return {
    logs,
    hasMore: skip + logs.length < total,
    total,
  };
}

export async function getPublicProfile(userId: string) {
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      isPublic: true,
      createdAt: true,
    },
  });

  if (!user) return null;
  if (!user.isPublic && !isOwner) return null;

  // Get public stats
  const stats = await prisma.dailyLog.aggregate({
    where: {
      userId,
      ...(isOwner ? {} : { isPublic: true }),
    },
    _sum: {
      problemsSolved: true,
      revisionVolume: true,
    },
    _count: true,
    _avg: {
      stars: true,
    },
  });

  // Get topic count
  const topicCount = await prisma.topic.count({
    where: { userId },
  });

  // Get recent public logs
  const recentLogs = await prisma.dailyLog.findMany({
    where: {
      userId,
      ...(isOwner ? {} : { isPublic: true }),
    },
    orderBy: { date: "desc" },
    take: 10,
    include: {
      topic: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  });

  return {
    user,
    stats: {
      totalProblems: stats._sum.problemsSolved || 0,
      totalRevisions: stats._sum.revisionVolume || 0,
      totalLogs: stats._count,
      avgStars: Math.round((stats._avg.stars || 0) * 10) / 10,
      topicCount,
    },
    recentLogs,
    isOwner,
  };
}
