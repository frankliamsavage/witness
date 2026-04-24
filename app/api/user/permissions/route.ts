import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkProfilePermissions } from "@/lib/profilePermissions";

export async function GET(request: NextRequest) {
  try {
    // Check user permissions (function gets userId from auth internally)
    const permissions = await checkProfilePermissions();
    
    if (!permissions.allowed) {
      return NextResponse.json(
        { error: permissions.reason }, 
        { status: 401 }
      );
    }
    
    // Extract user data if available
    const user = permissions.user;
    
    return NextResponse.json({
      canCreateProfile: user?.canCreateProfile ?? true,
      contentModerationLevel: user?.contentModerationLevel ?? 'standard',
      ageVerificationStatus: user?.ageVerified ?? false,
      dateOfBirth: user?.dateOfBirth ?? null
    });
    
  } catch (error) {
    console.error("Error checking user permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}