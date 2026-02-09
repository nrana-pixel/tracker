import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TopicStatus = "weak" | "improving" | "strong";

export function calculateTopicStatus(
  easyCount: number,
  mediumCount: number
): TopicStatus {
  if (easyCount < 3) return "weak";
  if (easyCount >= 5 && mediumCount >= 5) return "strong";
  return "improving";
}

export function getStatusEmoji(status: TopicStatus): string {
  switch (status) {
    case "weak":
      return "🔴";
    case "improving":
      return "🟡";
    case "strong":
      return "🟢";
  }
}

export function getStatusColor(status: TopicStatus): string {
  switch (status) {
    case "weak":
      return "text-red-500";
    case "improving":
      return "text-yellow-500";
    case "strong":
      return "text-green-500";
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getStarString(stars: number): string {
  return "⭐".repeat(stars);
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  
  const sortedDates = [...dates]
    .map((d) => new Date(d.toDateString()))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  const today = new Date(new Date().toDateString());
  const latestLog = sortedDates[0];

  const daysDiff = Math.floor(
    (today.getTime() - latestLog.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff > 1) return 0;

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = Math.floor(
      (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
