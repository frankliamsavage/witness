import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import ProfileContent from "./ProfileContent";

interface NewsFeedPost {
  id: string;
  title: string | null;
  content: string;
  imageUrls: string[];
  videoUrl: string | null;
  createdAt: Date;
  authorId: string;
  postVotes: { id: string; userId: string; voteType: string }[];
  pollVotes: { id: string; userId: string; optionIndex: number }[];
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId: currentUserId } = await auth();

  // Fetch user with all profile data and visibility settings
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      videos: { 
        orderBy: [
          { isPinned: "desc" }, // Pinned videos first
          { pinnedAt: "desc" }, // Then by pin date
          { createdAt: "desc" } // Finally by creation date
        ]
      },
      posts: { orderBy: { createdAt: "desc" } }, // Old posts table
      authoredPosts: { // New posts from NewsFeedPost table
        orderBy: { createdAt: "desc" },
        include: {
          postVotes: true,
          pollVotes: true,
        }
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  // Get current user info if authenticated
  let currentUser = null;
  let friendshipStatus = 'none';
  let isFollowing = false;
  
  if (currentUserId) {
    currentUser = await prisma.user.findUnique({
      where: { clerkId: currentUserId },
    });
    
    // Check friendship status if viewing another user's profile
    if (currentUser && currentUser.id !== user.id) {
      // Check if there's an existing friendship
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: currentUser.id, addresseeId: user.id },
            { requesterId: user.id, addresseeId: currentUser.id }
          ]
        }
      });
      
      if (friendship) {
        if (friendship.status === 'ACCEPTED') {
          friendshipStatus = 'friends';
        } else if (friendship.status === 'PENDING') {
          friendshipStatus = 'pending';
        }
      }
      
      // Check follow status
      const followRelation = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: user.id
          }
        }
      });
      
      isFollowing = !!followRelation;
    }
  }

  const isOwner = currentUser?.id === user.id;

  // Process videos to include user info (likes/comments will be added after migration)
  const processedVideos = user.videos.map((video: { id: string; url: string; caption: string | null; createdAt: Date; userId: string }) => ({
    ...video,
    user: { username: user.username },
    likes: 0, // Temporary - will be populated after migration
    isLiked: false, // Temporary - will be populated after migration
    comments: [], // Temporary - will be populated after migration
  }));

  // Process new posts from NewsFeedPost table and convert them to the same format as old posts
  const processedNewPosts = user.authoredPosts.map((post: NewsFeedPost) => {
    // Convert images from NewsFeedPost to video format for compatibility
    const mediaItems = [];
    
    // Add images as video items (for display compatibility)
    if (post.imageUrls && post.imageUrls.length > 0) {
      post.imageUrls.forEach((url: string) => {
        mediaItems.push({
          id: `${post.id}-img-${Math.random()}`,
          url: url,
          caption: post.title || post.content.substring(0, 100) + "...",
          createdAt: post.createdAt,
          userId: post.authorId,
          user: { username: user.username },
          likes: 0,
          isLiked: false,
          comments: [],
          isPinned: false,
          pinnedAt: null,
        });
      });
    }
    
    // Add video if exists
    if (post.videoUrl) {
      mediaItems.push({
        id: `${post.id}-vid`,
        url: post.videoUrl,
        caption: post.title || post.content.substring(0, 100) + "...",
        createdAt: post.createdAt,
        userId: post.authorId,
        user: { username: user.username },
        likes: 0,
        isLiked: false,
        comments: [],
        isPinned: false,
        pinnedAt: null,
      });
    }
    
    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      userId: post.authorId,
      mediaItems: mediaItems,
    };
  });

  // Combine old posts with new posts
  const allPosts = [
    ...user.posts,
    ...processedNewPosts
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Combine old videos with media from new posts
  const allVideos = [
    ...processedVideos,
    ...processedNewPosts.flatMap(post => post.mediaItems)
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const processedUser = {
    ...user,
    videos: allVideos,
    posts: allPosts
  };

  return <ProfileContent 
    user={processedUser} 
    isOwner={isOwner} 
    initialFriendshipStatus={friendshipStatus}
    initialIsFollowing={isFollowing}
  />;
}
