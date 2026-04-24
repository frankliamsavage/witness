import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the database user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Require username to be set before uploading content
    if (!user.username || user.username.trim() === '') {
      return NextResponse.json({ 
        error: 'Please complete your profile setup by setting a username before uploading content.',
        redirectTo: '/dashboard/profile' 
      }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;
    const caption = formData.get("caption") as string | null;

    const uploadedFile = file || videoFile;
    if (!uploadedFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine media type based on file type
    const isImage = uploadedFile.type.startsWith('image/');
    const isVideo = uploadedFile.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "File must be an image or video" }, { status: 400 });
    }

    const mediaType = isImage ? 'image' : 'video';

    // Upload to Vercel Blob
    const blob = await put(uploadedFile.name, uploadedFile, {
      access: "public",
      addRandomSuffix: true,
    });

    // Save to database with correct userId and media type
    const videoCreateData = {
      userId: user.id,
      url: blob.url,
      caption: caption || null,
      ...(mediaType && { mediaType }), // Only include mediaType if it's defined
    };

    await prisma.video.create({
      data: videoCreateData,
    });

    // Also create a NewsFeedPost for proper newsfeed integration
    await prisma.newsFeedPost.create({
      data: {
        authorId: user.id,
        title: null,
        content: caption || (isImage ? 'Shared an image' : 'Shared a video'),
        postType: isImage ? 'IMAGE' : 'VIDEO',
        imageUrls: isImage ? [blob.url] : [],
        videoUrl: isVideo ? blob.url : null,
        feedType: 'RANDOM', // Default to RANDOM feed
        tags: [mediaType, 'upload'],
        upvotes: 0,
        downvotes: 0,
        shares: 0,
        comments: 0
      }
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Upload error:", errorMsg);
    return NextResponse.json(
      { error: "Upload failed: " + errorMsg },
      { status: 500 }
    );
  }
}
