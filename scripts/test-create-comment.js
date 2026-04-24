const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCreateComment() {
  try {
    console.log('🧪 Testing comment creation...');
    
    // Get first post
    const post = await prisma.newsFeedPost.findFirst();
    if (!post) {
      console.log('❌ No posts found');
      return;
    }
    console.log('📄 Testing with post:', post.id, post.content.substring(0, 50));
    
    // Get first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No users found');
      return;
    }
    console.log('👤 Testing with user:', user.id, user.username);
    
    // Try to create a test comment
    const comment = await prisma.postComment.create({
      data: {
        postId: post.id,
        userId: user.id,
        content: "Test comment from script"
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });
    
    console.log('✅ Comment created successfully:', comment.id);
    console.log('💬 Comment content:', comment.content);
    console.log('👤 Comment author:', comment.user.username);
    
    // Update post comment count
    await prisma.newsFeedPost.update({
      where: { id: post.id },
      data: { comments: { increment: 1 } }
    });
    console.log('📄 Post comment count updated');
    
  } catch (error) {
    console.error('❌ Test comment creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateComment();