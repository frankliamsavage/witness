import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NewsFeedType, PostType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log('API: userId from auth:', userId);
    
    if (!userId) {
      console.log('API: No userId - unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'RANDOM').toUpperCase();
    const feedType = searchParams.get('feedType');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const getCounts = searchParams.get('counts') === 'true';
    console.log('API: Request params - type:', type, 'feedType:', feedType, 'limit:', limit, 'offset:', offset);

    // Get user's database ID and location for filtering
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        id: true, 
        currentCity: true, 
        currentState: true,
        currentCountry: true 
      }
    });

    console.log('API: User found:', user?.id);

    if (!user) {
      console.log('API: User not found in database');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle "My Posts" feed type
    if (feedType === 'my-posts') {
      const posts = await prisma.newsFeedPost.findMany({
        where: { authorId: user.id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
          postVotes: true,
          pollVotes: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to prevent overwhelming response
      });

      const processedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        postType: post.postType,
        createdAt: post.createdAt.toISOString(),
        mediaUrls: post.imageUrls || [], // Using imageUrls from schema
        videoUrl: post.videoUrl,
        linkUrl: post.linkUrl,
        linkTitle: post.linkTitle,
        linkDescription: post.linkDescription,
        pollQuestion: post.title, // Using title as poll question
        pollOptions: post.pollOptions?.map((option, index) => ({
          id: `${post.id}-option-${index}`,
          text: option,
          votes: post.pollVotes?.filter(vote => vote.optionIndex === index).length || 0,
        })) || [],
        pollType: post.pollType,
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        postVotes: post.postVotes || [],
        pollVotes: post.pollVotes || [],
        author: {
          id: post.author.id,
          username: post.author.username,
          profilePicture: post.author.profilePicture,
        },
      }));

      return NextResponse.json({ posts: processedPosts });
    }

    let whereClause: Record<string, unknown> = {};
    
    // Get all posts first, then filter based on viewing user's preferences
    // No longer filter by feedType at database level since posts don't have predetermined categories
    
    switch (type) {
      case 'FRIENDS':
        // Get posts from friends only (accepted friendships)
        const friendships = await prisma.friendship.findMany({
          where: {
            OR: [
              { requesterId: user.id, status: 'ACCEPTED' },
              { addresseeId: user.id, status: 'ACCEPTED' }
            ]
          },
          select: { requesterId: true, addresseeId: true }
        });
        
        const friendIds = friendships.map(f => 
          f.requesterId === user.id ? f.addresseeId : f.requesterId
        );
        
        // Only show posts from friends (exclude user's own posts)
        whereClause = { 
          authorId: { in: friendIds }
        };
        break;
        
      case 'FOLLOWING':
        // Get posts from users you are following only
        const following = await prisma.follow.findMany({
          where: { followerId: user.id },
          select: { followingId: true }
        });
        
        const followingIds = following.map(f => f.followingId);
        
        // Only show posts from people you follow (exclude user's own posts)
        whereClause = { 
          authorId: { in: followingIds }
        };
        break;
        
      case 'LOCAL':
        // Will be filtered after getting posts with user data
        whereClause = {};
        break;
        
      case 'NATIONAL':
        // Will be filtered after getting posts with user data  
        whereClause = {};
        break;
        
      case 'POLLS':
        // Filter for only poll posts
        whereClause = { postType: 'POLL' };
        break;
        
      case 'IMAGES':
        // Filter for only image posts
        whereClause = { postType: 'IMAGE' };
        break;
        
      case 'VIDEOS':
        // Filter for only video posts
        whereClause = { postType: 'VIDEO' };
        break;
        
      default: // RANDOM
        // Get all posts
        whereClause = {};
        break;
    }

    // Get regular posts from NewsFeedPost table
    const newPosts = await prisma.newsFeedPost.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true,
            currentCity: true,
            currentState: true,
            currentCountry: true
          }
        },
        postVotes: {
          where: { userId: user.id },
          select: { voteType: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Get more initially for filtering
    });

    // Get legacy posts from old Post table (except for POLLS feed which should only show new posts)
    // Also respect FRIENDS and FOLLOWING filtering
    let legacyWhereClause: Record<string, unknown> = {};
    if (type === 'FRIENDS') {
      // For FRIENDS feed, only get legacy posts from friends
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { requesterId: user.id, status: 'ACCEPTED' },
            { addresseeId: user.id, status: 'ACCEPTED' }
          ]
        },
        select: { requesterId: true, addresseeId: true }
      });
      
      const friendIds = friendships.map(f => 
        f.requesterId === user.id ? f.addresseeId : f.requesterId
      );
      
      // Only show legacy posts from friends (exclude user's own posts)
      legacyWhereClause = { userId: { in: friendIds } };
    } else if (type === 'FOLLOWING') {
      // For FOLLOWING feed, only get legacy posts from followed users
      const following = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { followingId: true }
      });
      
      const followingIds = following.map(f => f.followingId);
      
      // Only show legacy posts from people you follow (exclude user's own posts)
      legacyWhereClause = { userId: { in: followingIds } };
    }
    
    const legacyPosts = type === 'POLLS' ? [] : await prisma.post.findMany({
      where: (type === 'FRIENDS' || type === 'FOLLOWING') ? legacyWhereClause : {},
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true,
            currentCity: true,
            currentState: true,
            currentCountry: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 25 // Get some legacy posts
    });

    // Transform legacy posts to match NewsFeedPost structure
    const transformedLegacyPosts = legacyPosts.map(post => ({
      id: `legacy_${post.id}`, // Prefix to avoid ID conflicts
      authorId: post.userId,
      title: null,
      content: post.content,
      postType: 'TEXT' as const,
      imageUrls: [],
      videoUrl: null,
      linkUrl: null,
      feedType: type as NewsFeedType,
      location: post.user.currentCity && post.user.currentState 
        ? `${post.user.currentCity}, ${post.user.currentState}`
        : post.user.currentCountry || null,
      tags: [],
      likes: 0,
      shares: 0,
      comments: 0,
      createdAt: post.createdAt,
      author: {
        username: post.user.username,
        profilePicture: post.user.profilePicture,
        isVerified: post.user.isVerified || false,
        currentCity: post.user.currentCity,
        currentState: post.user.currentState,
        currentCountry: post.user.currentCountry
      },
      postVotes: [] // Legacy posts don't have the new voting system
    }));

    // Combine both post types
    const posts = [...newPosts, ...transformedLegacyPosts];

    // Filter posts based on feed type and location after getting author data
    let filteredPosts = posts;
    
    if (type === 'LOCAL' && user.currentCity && user.currentState) {
      filteredPosts = posts.filter(post => 
        post.author?.currentCity === user.currentCity || 
        post.author?.currentState === user.currentState
      );
    } else if (type === 'NATIONAL' && user.currentCountry) {
      filteredPosts = posts.filter(post => 
        post.author?.currentCountry === user.currentCountry
      );
    }

    // Apply pagination with offset and limit
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    // Get friend IDs for filtering
    const friendships = (type === 'FRIENDS' || type === 'FOLLOWING') ? await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: user.id, status: 'ACCEPTED' },
          { addresseeId: user.id, status: 'ACCEPTED' }
        ]
      },
      select: { requesterId: true, addresseeId: true }
    }) : [];
    
    const friendIds = friendships.map(f => 
      f.requesterId === user.id ? f.addresseeId : f.requesterId
    );
    
    // Get following IDs for filtering
    const following = (type === 'FRIENDS' || type === 'FOLLOWING') ? await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true }
    }) : [];
    
    const followingIds = following.map(f => f.followingId);

    // Get videos as feed content with filtering
    let videoWhereClause: Record<string, unknown> = {};
    if (type === 'FRIENDS') {
      // Only show videos from friends (exclude user's own videos)
      videoWhereClause = { 
        userId: { in: friendIds }
      };
    } else if (type === 'FOLLOWING') {
      // Only show videos from people you follow (exclude user's own videos)
      videoWhereClause = { 
        userId: { in: followingIds }
      };
    } else if (type === 'LOCAL') {
      // For local, we'll filter after getting user data but include user's videos
      videoWhereClause = {};
    } else if (type === 'NATIONAL') {
      // For national, we'll filter after getting user data but include user's videos
      videoWhereClause = {};
    }
    // RANDOM has no filter - gets everyone's videos including user's own

    const videos = await prisma.video.findMany({
      where: videoWhereClause,
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true,
            currentCity: true,
            currentState: true,
            currentCountry: true
          }
        },
        likes: true,
        comments: true
      },
      orderBy: type === 'RANDOM' ? [{ createdAt: 'desc' }] : [{ createdAt: 'desc' }],
      take: type === 'RANDOM' ? 20 : 10 // More for random since it's from everyone
    });

    console.log(`API: Found ${videos.length} videos for feed type ${type}`);
    console.log('API: Video where clause:', videoWhereClause);
    console.log('API: User ID:', user.id);
    videos.forEach(video => {
      console.log(`API: Video ${video.id} by user ${video.userId} (${video.user?.username}) - ${video.caption || 'no caption'}`);
    });

    // Get users with profile pictures for photo feed with filtering
    let photoUserWhereClause: Record<string, unknown> = {
      profilePicture: { not: null },
      bannerImageUrls: { isEmpty: false }
    };
    
    if (type === 'FRIENDS') {
      photoUserWhereClause = {
        ...photoUserWhereClause,
        id: { in: friendIds }
      };
    } else if (type === 'FOLLOWING') {
      photoUserWhereClause = {
        ...photoUserWhereClause,
        id: { in: followingIds }
      };
    }
    // For LOCAL/NATIONAL, we'll filter after getting user data
    // RANDOM gets all users with photos

    const photoUsers = await prisma.user.findMany({
      where: photoUserWhereClause,
      select: {
        id: true,
        username: true,
        profilePicture: true,
        bannerImageUrls: true,
        isVerified: true,
        currentCity: true,
        currentState: true,
        currentCountry: true,
        createdAt: true
      },
      orderBy: type === 'RANDOM' ? [{ createdAt: 'desc' }] : [{ createdAt: 'desc' }],
      take: type === 'RANDOM' ? 15 : 8 // More for random
    });

    // Filter videos and photos for LOCAL/NATIONAL after getting user data
    let filteredVideos = videos;
    let filteredPhotoUsers = photoUsers;

    if (type === 'LOCAL' && user.currentCity && user.currentState) {
      filteredVideos = videos.filter(video => 
        video.userId === user.id || // Always include user's own videos
        video.user?.currentCity === user.currentCity || 
        video.user?.currentState === user.currentState
      );
      filteredPhotoUsers = photoUsers.filter(photoUser => 
        photoUser.id === user.id || // Always include user's own photos
        photoUser.currentCity === user.currentCity || 
        photoUser.currentState === user.currentState
      );
    } else if (type === 'NATIONAL' && user.currentCountry) {
      filteredVideos = videos.filter(video => 
        video.userId === user.id || // Always include user's own videos
        video.user?.currentCountry === user.currentCountry
      );
      filteredPhotoUsers = photoUsers.filter(photoUser => 
        photoUser.id === user.id || // Always include user's own photos
        photoUser.currentCountry === user.currentCountry
      );
    }

    // Transform filtered data
    const videoPosts = filteredVideos.map(video => {
      // Handle both new and old database records
      // For backward compatibility, also check file extension if mediaType doesn't exist
      const videoWithMediaType = video as typeof video & { mediaType?: string };
      const mediaType = videoWithMediaType.mediaType || 
        (/\.(jpg|jpeg|png|gif|webp)$/i.test(video.url) ? 'image' : 'video');
      const isImage = mediaType === 'image';
      
      const videoPost = {
        id: `video_${video.id}`,
        authorId: video.userId,
        title: null,
        content: video.caption || (isImage ? 'Shared an image' : 'Shared a video'),
        postType: isImage ? 'IMAGE' as const : 'VIDEO' as const,
        imageUrls: isImage ? [video.url] : [],
        videoUrl: isImage ? null : video.url,
        linkUrl: null,
        feedType: type as NewsFeedType,
        location: video.user?.currentCity && video.user?.currentState 
          ? `${video.user.currentCity}, ${video.user.currentState}`
          : video.user?.currentCountry || null,
        tags: [],
        likes: video.likes.length,
        shares: 0,
        comments: video.comments.length,
        createdAt: video.createdAt,
        author: {
          username: video.user?.username,
          profilePicture: video.user?.profilePicture,
          isVerified: video.user?.isVerified || false
        }
      };
      
      console.log(`API: Transformed video post ${videoPost.id} - ${videoPost.postType} - ${videoPost.content}`);
      return videoPost;
    });

    console.log(`API: Created ${videoPosts.length} video posts`);

    const photoPosts = filteredPhotoUsers.flatMap(user => 
      user.bannerImageUrls.slice(0, 2).map((imageUrl, index) => ({
        id: `photo_${user.id}_${index}`,
        authorId: user.id,
        title: null,
        content: 'Shared a photo',
        postType: 'IMAGE' as const,
        imageUrls: [imageUrl],
        videoUrl: null,
        linkUrl: `/u/${user.username}`,
        feedType: type as NewsFeedType,
        location: user.currentCity && user.currentState 
          ? `${user.currentCity}, ${user.currentState}`
          : user.currentCountry || null,
        tags: ['photo', 'gallery'],
        likes: Math.floor(Math.random() * 20), // Random likes for demo
        shares: 0,
        comments: Math.floor(Math.random() * 5),
        createdAt: user.createdAt,
        author: {
          username: user.username,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified
        }
      }))
    );

    // Combine posts - only include legacy video/photo posts if not in POLLS mode
    const allPosts = [
      ...paginatedPosts.map(post => ({
        ...post,
        postType: post.postType as PostType,
        feedType: type as NewsFeedType, // Use the requested feed type for display
        userVote: post.postVotes[0]?.voteType || null // User's current vote on this post
      })),
      // Only add legacy video and photo posts if not viewing POLLS feed
      ...(type === 'POLLS' ? [] : videoPosts),
      ...(type === 'POLLS' ? [] : photoPosts)
    ];

    // Sort posts based on feed type
    const finalPosts = [...allPosts];
    if (type === 'RANDOM') {
      // Shuffle array for random feed
      for (let i = finalPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalPosts[i], finalPosts[j]] = [finalPosts[j], finalPosts[i]];
      }
    } else {
      // Sort by creation date for other feeds
      finalPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    console.log('API: Final posts count:', finalPosts.length);
    console.log('API: Returning posts - offset:', offset, 'limit:', limit);
    
    // Get counts by post type if requested
    let counts = null;
    if (getCounts) {
      const countResults = await prisma.newsFeedPost.groupBy({
        by: ['postType'],
        _count: true,
        where: {} // Count all posts regardless of current filter
      });
      
      counts = {
        TOTAL: countResults.reduce((sum, item) => sum + item._count, 0),
        TEXT: countResults.find(item => item.postType === 'TEXT')?._count || 0,
        IMAGE: countResults.find(item => item.postType === 'IMAGE')?._count || 0,
        VIDEO: countResults.find(item => item.postType === 'VIDEO')?._count || 0,
        POLL: countResults.find(item => item.postType === 'POLL')?._count || 0,
        LINK: countResults.find(item => item.postType === 'LINK')?._count || 0
      };
    }
    
    return NextResponse.json({ success: true, posts: finalPosts, counts });
  } catch (error) {
    console.error('Error fetching news feed:', error);
    return NextResponse.json({ error: "Failed to fetch news feed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      title, 
      content, 
      postType = 'TEXT',
      imageUrls = [],
      videoUrl,
      linkUrl,
      tags = [],
      // Poll-specific fields
      pollOptions = [],
      pollType = null,
      fundingGoal = null,
      pollEndsAt = null,
      allowSolutions = false,
      allowFunding = false,
      issueLocation = null
    } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Get user's database ID and location
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        id: true, 
        username: true,
        currentCity: true, 
        currentState: true,
        currentCountry: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Require username to be set before posting
    if (!user.username || user.username.trim() === '') {
      return NextResponse.json({ 
        error: 'Please complete your profile setup by setting a username before posting.',
        redirectTo: '/dashboard/profile' 
      }, { status: 400 });
    }

    // Auto-determine location and feedType based on user's profile
    // Posts are stored with user location for filtering in feeds
    let location = null;
    if (user.currentCity && user.currentState) {
      location = `${user.currentCity}, ${user.currentState}`;
    } else if (user.currentCountry) {
      location = user.currentCountry;
    }

    const post = await prisma.newsFeedPost.create({
      data: {
        authorId: user.id,
        title: title || null,
        content,
        postType,
        feedType: 'RANDOM', // Default feedType - actual filtering happens in GET requests
        location,
        imageUrls,
        videoUrl: videoUrl || null,
        linkUrl: linkUrl || null,
        tags,
        // Poll-specific fields
        pollOptions,
        pollType,
        fundingGoal,
        pollEndsAt: pollEndsAt ? new Date(pollEndsAt) : null,
        allowSolutions,
        allowFunding,
        issueLocation
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Also create Video records for images/videos so they appear in profile Videos section
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        await prisma.video.create({
          data: {
            userId: user.id,
            url: imageUrl,
            caption: content,
            mediaType: 'image'
          }
        });
      }
    }

    if (videoUrl) {
      await prisma.video.create({
        data: {
          userId: user.id,
          url: videoUrl,
          caption: content,
          mediaType: 'video'
        }
      });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}