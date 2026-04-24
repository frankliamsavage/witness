"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMediaAction(mediaId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Not authenticated" };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify ownership and delete
    const media = await prisma.video.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.userId !== user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.video.delete({
      where: { id: mediaId },
    });

    revalidatePath(`/u/${user.username}`);
    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return { error: "Failed to delete media" };
  }
}