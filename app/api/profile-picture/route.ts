import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Profile picture upload started");
    const { userId } = await auth();
    if (!userId) {
      console.log("No userId found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User authenticated:", userId);

    const formData = await request.formData();
    const file = formData.get("profilePicture") as File;
    console.log("File received:", file?.name, file?.size, file?.type);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Validate file size (should be compressed by client)
    const maxSize = 5 * 1024 * 1024; // 5MB (after client compression)
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large after compression. Please try a smaller image." },
        { status: 400 }
      );
    }

    // Convert to base64 data URL and compress if needed
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    console.log("File converted to base64, original size:", file.size, "base64 size:", dataUrl.length);

    return NextResponse.json({ 
      success: true, 
      url: dataUrl,
      message: "Profile picture uploaded successfully" 
    });

  } catch (error) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since we're using base64 data URLs, there's no file to delete
    // The profile picture removal is handled by the profile update
    return NextResponse.json({ 
      success: true, 
      message: "Profile picture removed successfully" 
    });

  } catch (error) {
    console.error("Profile picture delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove profile picture" },
      { status: 500 }
    );
  }
}