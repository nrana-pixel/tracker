"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const logSchema = z.object({
  topicId: z.string().min(1, "Topic is required"),
  date: z.string(),
  energy: z.coerce.number().min(1).max(5),
  problemsSolved: z.coerce.number().min(0),
  revisionVolume: z.coerce.number().min(0),
  backendWork: z.string().optional(),
  techUsed: z.string().optional(),
  notes: z.string().optional(),
  problemUrls: z.string().optional(),
  stars: z.coerce.number().min(1).max(5),
  isPublic: z.coerce.boolean(),
});

export async function getDailyLogs(limit?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.dailyLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: limit,
    include: {
      topic: true,
    },
  });
}

export async function createDailyLog(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = logSchema.parse({
      topicId: formData.get("topicId"),
      date: formData.get("date") || new Date().toISOString(),
      energy: formData.get("energy"),
      problemsSolved: formData.get("problemsSolved"),
      revisionVolume: formData.get("revisionVolume"),
      backendWork: formData.get("backendWork") || "",
      techUsed: formData.get("techUsed") || "",
      notes: formData.get("notes") || "",
      problemUrls: formData.get("problemUrls") || "",
      stars: formData.get("stars"),
      isPublic: formData.get("isPublic") === "true",
    });

    const problemUrls = data.problemUrls
      ? data.problemUrls.split("\n").map(url => url.trim()).filter(url => url.length > 0)
      : [];

    await prisma.dailyLog.create({
      data: {
        userId: session.user.id,
        topicId: data.topicId,
        date: new Date(data.date),
        energy: data.energy,
        problemsSolved: data.problemsSolved,
        revisionVolume: data.revisionVolume,
        backendWork: data.backendWork,
        techUsed: data.techUsed,
        notes: data.notes,
        problemUrls,
        stars: data.stars,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/logs");
    revalidatePath("/dashboard");
    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to create log" };
  }
}

export async function updateDailyLog(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = logSchema.parse({
      topicId: formData.get("topicId"),
      date: formData.get("date"),
      energy: formData.get("energy"),
      problemsSolved: formData.get("problemsSolved"),
      revisionVolume: formData.get("revisionVolume"),
      backendWork: formData.get("backendWork") || "",
      techUsed: formData.get("techUsed") || "",
      notes: formData.get("notes") || "",
      problemUrls: formData.get("problemUrls") || "",
      stars: formData.get("stars"),
      isPublic: formData.get("isPublic") === "true",
    });

    const problemUrls = data.problemUrls
      ? data.problemUrls.split("\n").map(url => url.trim()).filter(url => url.length > 0)
      : [];

    await prisma.dailyLog.update({
      where: { id, userId: session.user.id },
      data: {
        topicId: data.topicId,
        date: new Date(data.date),
        energy: data.energy,
        problemsSolved: data.problemsSolved,
        revisionVolume: data.revisionVolume,
        backendWork: data.backendWork,
        techUsed: data.techUsed,
        notes: data.notes,
        problemUrls,
        stars: data.stars,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/logs");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to update log" };
  }
}

export async function deleteDailyLog(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.dailyLog.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/logs");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to delete log" };
  }
}
