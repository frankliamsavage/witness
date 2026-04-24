import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function ensureUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return { userId, user };
}
