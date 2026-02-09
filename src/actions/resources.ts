"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ResourceType } from "@prisma/client";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Valid URL is required"),
  description: z.string().optional(),
  type: z.enum(["Documentation", "Video", "Article", "Course", "GitHub", "Other"]),
  topicId: z.string().optional(),
  isPublic: z.coerce.boolean(),
});

export async function getResources(topicId?: string) {
  const where = {
    isPublic: true,
    ...(topicId ? { topicId } : {}),
  };

  return prisma.resource.findMany({
    where,
    orderBy: [
      { upvotes: "desc" },
      { createdAt: "desc" },
    ],
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
    take: 50,
  });
}

export async function getMyResources() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.resource.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      topic: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function createResource(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = resourceSchema.parse({
      title: formData.get("title"),
      url: formData.get("url"),
      description: formData.get("description") || "",
      type: formData.get("type"),
      topicId: formData.get("topicId") || undefined,
      isPublic: formData.get("isPublic") === "true",
    });

    await prisma.resource.create({
      data: {
        userId: session.user.id,
        title: data.title,
        url: data.url,
        description: data.description,
        type: data.type as ResourceType,
        topicId: data.topicId,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to create resource" };
  }
}

export async function upvoteResource(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.resource.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch {
    return { error: "Failed to upvote resource" };
  }
}

export async function deleteResource(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.resource.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch {
    return { error: "Failed to delete resource" };
  }
}
