const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkVideoDatabase() {
  try {
    console.log('🔍 Checking video database...\n');
    
    // Get all videos
    const allVideos = await prisma.video.findMany({
      include: {
        user: {
          select: {
            username: true,
            clerkId: true
          }
        }
      }
    });
    
    console.log(`📹 Total Videos in database: ${allVideos.length}`);
    allVideos.forEach((video, index) => {
      console.log(`  ${index + 1}. ID: ${video.id}`);
      console.log(`     URL: ${video.url}`);
      console.log(`     Caption: ${video.caption || 'No caption'}`);
      console.log(`     Media Type: ${video.mediaType}`);
      console.log(`     User: ${video.user?.username || 'Unknown'} (${video.user?.clerkId || 'No clerkId'})`);
      console.log(`     Created: ${video.createdAt}`);
      console.log('');
    });
    
    // Get all NewsFeedPosts with videos
    const videoNewsFeedPosts = await prisma.newsFeedPost.findMany({
      where: {
        OR: [
          { postType: 'VIDEO' },
          { videoUrl: { not: null } }
        ]
      },
      include: {
        author: {
          select: {
            username: true,
            clerkId: true
          }
        }
      }
    });
    
    console.log(`📰 NewsFeedPosts with videos: ${videoNewsFeedPosts.length}`);
    videoNewsFeedPosts.forEach((post, index) => {
      console.log(`  ${index + 1}. ID: ${post.id}`);
      console.log(`     Content: ${post.content}`);
      console.log(`     Post Type: ${post.postType}`);
      console.log(`     Video URL: ${post.videoUrl || 'No video URL'}`);
      console.log(`     Author: ${post.author?.username || 'Unknown'} (${post.author?.clerkId || 'No clerkId'})`);
      console.log(`     Created: ${post.createdAt}`);
      console.log('');
    });
    
    // Get all NewsFeedPosts to see what we have
    const allNewsFeedPosts = await prisma.newsFeedPost.findMany({
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });
    
    console.log(`📝 Total NewsFeedPosts: ${allNewsFeedPosts.length}`);
    const postTypes = {};
    allNewsFeedPosts.forEach(post => {
      postTypes[post.postType] = (postTypes[post.postType] || 0) + 1;
    });
    console.log('Post type breakdown:', postTypes);
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVideoDatabase();