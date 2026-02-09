"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  isPublic: z.coerce.boolean(),
});

export async function getProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      isPublic: true,
      createdAt: true,
    },
  });
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = profileSchema.parse({
      name: formData.get("name"),
      bio: formData.get("bio") || "",
      avatarUrl: formData.get("avatarUrl") || "",
      isPublic: formData.get("isPublic") === "true",
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        avatarUrl: data.avatarUrl || null,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to update profile" };
  }
}
