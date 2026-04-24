/**
 * Weekly Digest Script
 * Run this script weekly (via cron job) to send digest emails to all users who have it enabled
 */

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma
const prisma = new PrismaClient();

async function runWeeklyDigest() {
  console.log('🚀 Starting Weekly Digest Job...');
  console.log('📅 Date:', new Date().toISOString());
  
  try {
    // Get all users who have weekly digest enabled
    // Note: This assumes the notificationSettings field exists in your User model
    // For now, we'll simulate this since the field may not be in the database yet
    
    console.log('👥 Finding users with weekly digest enabled...');
    
    // In production, this would be:
    // const users = await prisma.user.findMany({
    //   where: {
    //     notificationSettings: {
    //       path: ['weeklyDigest'],
    //       equals: true
    //     }
    //   }
    // });
    
    // For testing, let's get a few users and simulate they have it enabled
    const allUsers = await prisma.user.findMany({
      take: 5, // Limit for testing
      include: {
        authoredPosts: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          },
          include: {
            votes: true,
            comments: true
          }
        },
        receivedVotes: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }
      }
    });
    
    console.log(`📊 Found ${allUsers.length} users to process`);
    
    const results = [];
    
    for (const user of allUsers) {
      try {
        console.log(`📧 Processing user: ${user.clerkId}`);
        
        // Calculate weekly stats
        const weeklyStats = calculateWeeklyStats(user);
        
        // Generate email content
        const emailData = {
          user: {
            id: user.clerkId,
            email: user.email || `${user.clerkId}@example.com`,
            name: user.firstName || 'Witness User'
          },
          stats: weeklyStats,
          topPosts: getTopPosts(user.authoredPosts),
          recentActivity: getRecentActivity(user)
        };
        
        // Generate HTML email
        const emailHtml = generateWeeklyDigestEmail(emailData);
        
        // In production, send the email here:
        // await sendEmail({
        //   to: emailData.user.email,
        //   subject: 'Your Weekly Digest - Witness',
        //   html: emailHtml
        // });
        
        console.log(`✅ Weekly digest prepared for ${user.clerkId}`);
        results.push({
          userId: user.clerkId,
          email: emailData.user.email,
          status: 'success',
          stats: weeklyStats
        });
        
      } catch (userError) {
        console.error(`❌ Failed to process user ${user.clerkId}:`, userError);
        results.push({
          userId: user.clerkId,
          status: 'error',
          error: userError.message
        });
      }
    }
    
    // Summary
    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;
    
    console.log('📈 Weekly Digest Job Complete!');
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total Processed: ${results.length}`);
    
    return {
      success: true,
      processed: results.length,
      successful,
      failed,
      results
    };
    
  } catch (error) {
    console.error('💥 Weekly digest job failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function calculateWeeklyStats(user) {
  const newPosts = user.authoredPosts.length;
  const newLikes = user.receivedVotes.filter(vote => vote.voteType === 'LIKE').length;
  const newComments = user.authoredPosts.reduce((total, post) => total + post.comments.length, 0);
  
  return {
    newPosts,
    newLikes,
    newComments,
    newFollowers: Math.floor(Math.random() * 5), // Simulated for now
    postsViewed: Math.floor(Math.random() * 50) + 10 // Simulated for now
  };
}

function getTopPosts(posts) {
  return posts
    .map(post => ({
      id: post.id,
      title: post.title || 'Untitled Post',
      likes: post.votes.filter(vote => vote.voteType === 'LIKE').length,
      comments: post.comments.length,
      createdAt: post.createdAt
    }))
    .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 3);
}

function getRecentActivity(user) {
  const activities = [];
  
  // Add some sample activities (in production, this would be real data)
  if (user.receivedVotes.length > 0) {
    activities.push({
      type: 'like',
      user: 'Anonymous User',
      postTitle: 'Your recent post',
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  user.authoredPosts.forEach(post => {
    if (post.comments.length > 0) {
      activities.push({
        type: 'comment',
        user: 'Community Member',
        postTitle: post.title || 'Your post',
        comment: 'Great insight, thanks for sharing!',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }
  });
  
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
}

function generateWeeklyDigestEmail(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Weekly Digest - Witness</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; margin: 20px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-box { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 12px; padding: 20px; text-align: center; }
        .stat-number { font-size: 28px; font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .stat-label { font-size: 14px; color: #6c757d; }
        .post-item { border-bottom: 1px solid #eee; padding: 20px 0; }
        .post-item:last-child { border-bottom: none; }
        .activity-item { background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 6px; padding: 15px; margin: 12px 0; }
        .cta-button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; }
        .unsubscribe { color: #6c757d; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Your Weekly Digest</h1>
            <p>Here's what happened on Witness this week</p>
        </div>
        
        <div class="content">
            <h2>👋 Hi ${data.user.name}!</h2>
            <p>Here's your personalized weekly summary of activity on Witness:</p>
            
            <h3>📊 Your Week in Numbers</h3>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-number">${data.stats.newPosts}</div>
                    <div class="stat-label">New Posts</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${data.stats.newLikes}</div>
                    <div class="stat-label">New Likes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${data.stats.newComments}</div>
                    <div class="stat-label">New Comments</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${data.stats.newFollowers}</div>
                    <div class="stat-label">New Followers</div>
                </div>
            </div>
            
            ${data.topPosts.length > 0 ? `
            <h3>🔥 Your Top Posts This Week</h3>
            ${data.topPosts.map(post => `
                <div class="post-item">
                    <h4>${post.title}</h4>
                    <p>❤️ ${post.likes} likes • 💬 ${post.comments} comments</p>
                    <small style="color: #6c757d;">Posted ${new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('')}
            ` : '<p>No new posts this week. Share your testimony to engage the community! 📝</p>'}
            
            ${data.recentActivity.length > 0 ? `
            <h3>🎉 Recent Activity</h3>
            ${data.recentActivity.map(activity => `
                <div class="activity-item">
                    ${activity.type === 'like' 
                        ? `❤️ <strong>${activity.user}</strong> liked your post "${activity.postTitle}"`
                        : `💬 <strong>${activity.user}</strong> commented on "${activity.postTitle}": "${activity.comment}"`
                    }
                    <br><small style="color: #6c757d;">${new Date(activity.timestamp).toLocaleDateString()}</small>
                </div>
            `).join('')}
            ` : '<p>No recent activity. Stay active to see your engagement here! 🚀</p>'}
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://witnessproject.net/dashboard" class="cta-button">
                    📱 Visit Your Dashboard
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>You're receiving this weekly digest because you enabled it in your notification settings.</p>
            <p>
                <a href="https://witnessproject.net/dashboard/settings" class="unsubscribe">Manage email preferences</a> • 
                <a href="#" class="unsubscribe">Unsubscribe</a>
            </p>
            <small>© 2025 Witness Project. All rights reserved.</small>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// Run if called directly
if (require.main === module) {
  runWeeklyDigest()
    .then(result => {
      console.log('✅ Script completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { runWeeklyDigest, generateWeeklyDigestEmail };