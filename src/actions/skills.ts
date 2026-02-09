"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const skillSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
  practiced: z.coerce.boolean(),
  usedInProject: z.coerce.boolean(),
  confidence: z.coerce.number().min(1).max(5),
});

export async function getSkills() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.backendSkill.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSkill(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = skillSchema.parse({
      skill: formData.get("skill"),
      practiced: formData.get("practiced") === "true",
      usedInProject: formData.get("usedInProject") === "true",
      confidence: formData.get("confidence"),
    });

    await prisma.backendSkill.create({
      data: {
        userId: session.user.id,
        skill: data.skill,
        practiced: data.practiced,
        usedInProject: data.usedInProject,
        confidence: data.confidence,
      },
    });

    revalidatePath("/skills");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Skill already exists" };
  }
}

export async function updateSkill(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const data = skillSchema.parse({
      skill: formData.get("skill"),
      practiced: formData.get("practiced") === "true",
      usedInProject: formData.get("usedInProject") === "true",
      confidence: formData.get("confidence"),
    });

    await prisma.backendSkill.update({
      where: { id, userId: session.user.id },
      data: {
        skill: data.skill,
        practiced: data.practiced,
        usedInProject: data.usedInProject,
        confidence: data.confidence,
      },
    });

    revalidatePath("/skills");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Failed to update skill" };
  }
}

export async function deleteSkill(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.backendSkill.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/skills");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to delete skill" };
  }
}
