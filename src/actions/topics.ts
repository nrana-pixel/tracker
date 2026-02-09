"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Category } from "@prisma/client";

const topicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
  category: z.enum(["DSA", "Backend", "Custom"]),
});

export async function getTopics() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.topic.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { dailyLogs: true },
      },
    },
  });
}

export async function createTopic(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = topicSchema.parse({
      name: formData.get("name"),
      category: formData.get("category"),
    });

    await prisma.topic.create({
      data: {
        userId: session.user.id,
        name: data.name,
        category: data.category as Category,
      },
    });

    revalidatePath("/topics");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Topic already exists" };
  }
}

export async function updateTopic(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = topicSchema.parse({
      name: formData.get("name"),
      category: formData.get("category"),
    });

    await prisma.topic.update({
      where: { id, userId: session.user.id },
      data: {
        name: data.name,
        category: data.category as Category,
      },
    });

    revalidatePath("/topics");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to update topic" };
  }
}

export async function deleteTopic(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.topic.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/topics");
    return { success: true };
  } catch {
    return { error: "Failed to delete topic" };
  }
}
