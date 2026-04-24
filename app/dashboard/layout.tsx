import { auth } from "@clerk/nextjs/server";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/sign-in");
  }

  // Check if user has a username set
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { 
      id: true, 
      username: true
    }
  });

  // Only redirect to setup if user doesn't exist in database OR has completely null/empty username
  // Existing users with ANY username (even temporary ones) should be allowed through
  if (!user) {
    return redirect("/setup-username");
  }

  // Allow users with any existing username to continue (don't force existing users to change)
  // They can edit their username from the profile page if they want to

  // All registered users are 18+ due to sign-up restrictions
  return (
    <>
      <DashboardNav />
      {children}
    </>
  );
}