"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/* ---------------- Identity ---------------- */
export async function saveIdentityAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const data = {
    legalName: formData.get("legalName")?.toString().trim() || null,
    birthPlace: formData.get("birthPlace")?.toString().trim() || null,
    currentCity: formData.get("currentCity")?.toString().trim() || null,
    currentState: formData.get("currentState")?.toString().trim() || null,
    currentCountry: formData.get("currentCountry")?.toString().trim() || null,
    maritalStatus: formData.get("maritalStatus")?.toString().trim() || null,
    dateOfBirth: (() => {
      const v = formData.get("dateOfBirth")?.toString() || "";
      return v ? new Date(v) : null;
    })(),
  };

  await prisma.user.update({
    where: { clerkId: userId },
    data,
  });

  revalidatePath("/dashboard/profile");
}

/* ---------------- Bio ---------------- */
export async function saveBioAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const bio = (formData.get("bio")?.toString() || "").slice(0, 1000);
  const tagline = formData.get("tagline")?.toString() || null;

  await prisma.user.update({
    where: { clerkId: userId },
    data: { bio, tagline },
  });

  revalidatePath("/dashboard/profile");
}

/* ---------------- Banner ---------------- */
export async function saveBannerAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const bannerType = formData.get("bannerType")?.toString() || null;
  const bannerVideoUrl = formData.get("bannerVideoUrl")?.toString().trim() || null;

  const imgs = (formData.get("bannerImageUrls")?.toString() || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      bannerType: bannerType ? (bannerType as any) : null,
      bannerVideoUrl: bannerVideoUrl || null,
      bannerImageUrls: imgs,
    },
  });

  revalidatePath("/dashboard/profile");
}

/* ---------------- Photos ---------------- */
export async function addPhotoUrlAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!me) throw new Error("User record not found");

  const url = formData.get("photoUrl")?.toString().trim();
  if (!url) return;

  await prisma.video.create({
    data: { userId: me.id, url, caption: "Uploaded image" },
  });

  revalidatePath("/dashboard/profile");
}

/* ---------------- Posts ---------------- */
export async function addPostAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!me) throw new Error("User record not found");

  const content = (formData.get("content")?.toString() || "").trim();
  if (!content) return;

  await prisma.post.create({
    data: { userId: me.id, content },
  });

  revalidatePath("/dashboard/profile");
}

/* ---------------- Delete Post ---------------- */
export async function deletePostAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const postId = formData.get("postId")?.toString();
  if (!postId) throw new Error("Missing postId");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  // Verify ownership before deleting
  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!me || post.userId !== me.id) throw new Error("Unauthorized");

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/dashboard/profile");
}
