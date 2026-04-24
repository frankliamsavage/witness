import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Get all videos by this user
    const videos = await prisma.video.findMany({
      where: { userId: user.id }
    });

    // Get all NewsFeedPosts by this user
    const newsFeedPosts = await prisma.newsFeedPost.findMany({
      where: { authorId: user.id }
    });

    // Check which videos already have corresponding NewsFeedPosts
    const existingPosts = await prisma.newsFeedPost.findMany({
      where: {
        authorId: user.id,
        OR: [
          { videoUrl: { in: videos.map(v => v.url) } },
          { imageUrls: { hasSome: videos.map(v => v.url) } }
        ]
      }
    });

    const existingUrls = new Set([
      ...existingPosts.map(p => p.videoUrl).filter(Boolean),
      ...existingPosts.flatMap(p => p.imageUrls)
    ]);

    const videosNeedingMigration = videos.filter(v => !existingUrls.has(v.url));

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
      totalVideos: videos.length,
      totalNewsFeedPosts: newsFeedPosts.length,
      videosWithNewsFeedPost: existingPosts.length,
      videosNeedingMigration: videosNeedingMigration.length,
      videos: videos.map(v => ({
        id: v.id,
        url: v.url,
        caption: v.caption,
        createdAt: v.createdAt,
        hasNewsFeedPost: existingUrls.has(v.url)
      })),
      newsFeedPosts: newsFeedPosts.map(p => ({
        id: p.id,
        content: p.content,
        postType: p.postType,
        videoUrl: p.videoUrl,
        imageUrls: p.imageUrls,
        createdAt: p.createdAt
      }))
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Status check error:", errorMsg);
    return NextResponse.json(
      { error: "Status check failed: " + errorMsg },
      { status: 500 }
    );
  }
}

export async function POST() {
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

    // Get all videos by this user that don't have corresponding NewsFeedPosts
    const videos = await prisma.video.findMany({
      where: {
        userId: user.id
      }
    });

    // Check which videos already have NewsFeedPosts
    const existingPosts = await prisma.newsFeedPost.findMany({
      where: {
        authorId: user.id,
        OR: [
          { videoUrl: { in: videos.map(v => v.url) } },
          { imageUrls: { hasSome: videos.map(v => v.url) } }
        ]
      }
    });

    const existingUrls = new Set([
      ...existingPosts.map(p => p.videoUrl).filter(Boolean),
      ...existingPosts.flatMap(p => p.imageUrls)
    ]);

    // Create NewsFeedPosts for videos that don't have them
    const newPosts = [];
    for (const video of videos) {
      if (!existingUrls.has(video.url)) {
        // Handle both new and old database records
        const videoWithMediaType = video as typeof video & { mediaType?: string };
        const mediaType = videoWithMediaType.mediaType || 
          (/\.(jpg|jpeg|png|gif|webp)$/i.test(video.url) ? 'image' : 'video');
        const isImage = mediaType === 'image';

        const newPost = await prisma.newsFeedPost.create({
          data: {
            authorId: user.id,
            title: null,
            content: video.caption || (isImage ? 'Shared an image' : 'Shared a video'),
            postType: isImage ? 'IMAGE' : 'VIDEO',
            imageUrls: isImage ? [video.url] : [],
            videoUrl: isImage ? null : video.url,
            feedType: 'RANDOM',
            tags: [mediaType, 'migrated'],
            upvotes: 0,
            downvotes: 0,
            shares: 0,
            comments: 0,
            createdAt: video.createdAt, // Preserve original creation date
            updatedAt: video.createdAt
          }
        });
        newPosts.push(newPost);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${newPosts.length} videos to newsfeed posts`,
      migratedPosts: newPosts.length,
      totalVideos: videos.length
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Migration error:", errorMsg);
    return NextResponse.json(
      { error: "Migration failed: " + errorMsg },
      { status: 500 }
    );
  }
}