"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateStreak } from "@/lib/utils";

export async function getDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Get all logs for streak calculation
  const allLogs = await prisma.dailyLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  // Calculate streak
  const streak = calculateStreak(allLogs.map((l) => l.date));

  // Get weekly stats (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyLogs = await prisma.dailyLog.findMany({
    where: {
      userId,
      date: { gte: weekAgo },
    },
  });

  const weeklyProblems = weeklyLogs.reduce(
    (sum, log) => sum + log.problemsSolved,
    0
  );
  const weeklyRevisions = weeklyLogs.reduce(
    (sum, log) => sum + log.revisionVolume,
    0
  );
  const avgStars =
    weeklyLogs.length > 0
      ? weeklyLogs.reduce((sum, log) => sum + log.stars, 0) / weeklyLogs.length
      : 0;

  // Get weak topics (less than 3 logs or low problems solved)
  const topicsWithLogs = await prisma.topic.findMany({
    where: { userId },
    include: {
      dailyLogs: {
        select: { problemsSolved: true },
      },
    },
  });

  const weakTopics = topicsWithLogs
    .map((topic) => ({
      id: topic.id,
      name: topic.name,
      category: topic.category,
      totalProblems: topic.dailyLogs.reduce((sum, l) => sum + l.problemsSolved, 0),
      logCount: topic.dailyLogs.length,
    }))
    .filter((t) => t.totalProblems < 5)
    .slice(0, 5);

  // Get low confidence skills
  const lowConfidenceSkills = await prisma.backendSkill.findMany({
    where: {
      userId,
      confidence: { lt: 3 },
    },
    take: 5,
  });

  return {
    streak,
    weeklyProblems,
    weeklyRevisions,
    avgStars: Math.round(avgStars * 10) / 10,
    totalLogs: allLogs.length,
    weakTopics,
    lowConfidenceSkills,
  };
}

export async function getChartData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const logs = await prisma.dailyLog.findMany({
    where: {
      userId,
      date: { gte: twoWeeksAgo },
    },
    orderBy: { date: "asc" },
  });

  // Group by date
  const dailyData: Record<
    string,
    { date: string; problems: number; revisions: number }
  > = {};

  logs.forEach((log) => {
    const dateStr = log.date.toISOString().split("T")[0];
    if (!dailyData[dateStr]) {
      dailyData[dateStr] = { date: dateStr, problems: 0, revisions: 0 };
    }
    dailyData[dateStr].problems += log.problemsSolved;
    dailyData[dateStr].revisions += log.revisionVolume;
  });

  // Fill in missing dates
  const result = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    result.push(
      dailyData[dateStr] || { date: dateStr, problems: 0, revisions: 0 }
    );
  }

  // Get skill confidence for bar chart
  const skills = await prisma.backendSkill.findMany({
    where: { userId },
    select: { skill: true, confidence: true },
  });

  return {
    dailyProgress: result,
    skillConfidence: skills,
  };
}
