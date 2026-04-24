'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { checkAdminStatus, deleteVideoAction, deletePostAction } from '@/app/actions/adminActions';
import SwipeFeed from '@/components/SwipeFeed';

type NewsFeedPost = {
  id: string;
  authorId: string;
  title: string | null;
  content: string;
  postType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'TESTIMONY' | 'LINK' | 'POLL';
  imageUrls: string[];
  videoUrl: string | null;
  linkUrl: string | null;
  feedType: 'RANDOM' | 'FRIENDS' | 'LOCAL' | 'NATIONAL';
  location: string | null;
  tags: string[];
  likes: number; // Keep for backward compatibility
  upvotes: number;
  downvotes: number;
  shares: number;
  comments: number;
  createdAt: Date;
  updatedAt?: Date;
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null;
  author: {
    username: string | null;
    profilePicture: string | null;
    isVerified: boolean;
  };
  // Poll-specific fields
  pollOptions?: string[];
  pollType?: string | null;
  pollEndsAt?: string | null;
  issueLocation?: string | null;
  fundingGoal?: number | null;
  allowSolutions?: boolean;
  allowFunding?: boolean;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string | null;
    profilePicture: string | null;
    isVerified: boolean;
  };
};

type FeedType = 'RANDOM' | 'FRIENDS' | 'FOLLOWING' | 'LOCAL' | 'NATIONAL' | 'POLLS' | 'IMAGES' | 'VIDEOS';

export default function NewsFeedPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<NewsFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedType>('RANDOM');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [topComments, setTopComments] = useState<{ [key: string]: Comment[] }>({});
  const [currentUserInfo, setCurrentUserInfo] = useState<Record<string, { id: string; userId: string; isAdmin: boolean }>>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  
  // Solution proposal states
  const [showSolutionForm, setShowSolutionForm] = useState<Set<string>>(new Set());
  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [pollVotes, setPollVotes] = useState<Record<string, Record<number, number>>>({});
  const [commentReactions, setCommentReactions] = useState<Record<string, { agreeCount: number; disagreeCount: number; userReaction: string | null }>>({});
  const [postCounts, setPostCounts] = useState<{ TOTAL: number; TEXT: number; IMAGE: number; VIDEO: number; POLL: number; LINK: number } | null>(null);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    if (user) {
      loadPosts();
      checkUserAdminStatus();
    }
  }, [user, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load top comments for posts that have comments
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => {
        if (post.comments > 0 && !topComments[post.id]) {
          loadTopComments(post.id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  async function loadTopComments(postId: string) {
    try {
      const response = await fetch(`/api/newsfeed/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        console.log('loadTopComments response:', { postId, commentsCount: data.comments?.length });
        // Get top 3 comments (by creation order for now, can add upvotes later)
        const top3 = data.comments.slice(0, 3);
        setTopComments(prev => ({ ...prev, [postId]: top3 }));
        console.log('Set top comments for post:', postId, top3);
        
        // Store current user info for delete permissions
        if (data.currentUser) {
          setCurrentUserInfo(prev => ({ ...prev, [postId]: data.currentUser }));
        }
        
        // Set reaction data for all comments
        data.comments.forEach((comment: any) => {
          setCommentReactions(prev => ({
            ...prev,
            [comment.id]: {
              agreeCount: comment.reactionCounts?.agreeCount || 0,
              disagreeCount: comment.reactionCounts?.disagreeCount || 0,
              userReaction: comment.userReaction
            }
          }));
        });
      } else {
        console.error('Failed to load top comments:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Failed to load top comments for post', postId, ':', error);
    }
  }

  async function checkUserAdminStatus() {
    try {
      const status = await checkAdminStatus();
      setIsAdmin(status.isAdmin);
      
      if (status.isAdmin) {
        console.log('✅ Admin access confirmed:', { username: status.username });
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    }
  }

  async function loadPosts() {
    setLoading(true);
    try {
      console.log('Loading posts with activeTab:', activeTab);
      const response = await fetch(`/api/newsfeed?type=${activeTab}&counts=true`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Posts loaded:', data);
        setPosts(data.posts || []);
        
        // Set post counts if returned
        if (data.counts) {
          setPostCounts(data.counts);
        }
      } else {
        console.error('Failed to load posts:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
    setLoading(false);
  }

  async function handleVote(postId: string, voteType: 'UPVOTE' | 'DOWNVOTE') {
    try {
      const response = await fetch(`/api/newsfeed/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                upvotes: data.upvotes, 
                downvotes: data.downvotes,
                userVote: data.userVote
              }
            : post
        ));
      } else {
        const errorData = await response.json();
        console.error('Vote failed:', errorData.error);
        alert('Failed to vote: ' + errorData.error);
      }
    } catch (error) {
      console.error('Failed to vote on post:', error);
      alert('Failed to vote on post. Please try again.');
    }
  }

  async function handleShare(postId: string) {
    try {
      const response = await fetch(`/api/newsfeed/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update share count in UI
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, shares: data.shares }
            : post
        ));

        // Try to use Web Share API if available
        if (navigator.share) {
          await navigator.share({
            title: data.title,
            text: data.description,
            url: data.shareUrl,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(data.shareUrl);
          alert('Share link copied to clipboard!');
        }
      } else {
        const errorData = await response.json();
        console.error('Share failed:', errorData.error);
        alert('Failed to share: ' + errorData.error);
      }
    } catch (error) {
      console.error('Failed to share post:', error);
      // If clipboard API also fails, show the URL in an alert
      alert('Failed to share. You can manually copy this URL to share the post.');
    }
  }

  async function handlePollVote(postId: string, optionIndex: number) {
    try {
      const response = await fetch(`/api/newsfeed/${postId}/vote-poll`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update poll vote counts
        setPollVotes(prev => ({
          ...prev,
          [postId]: data.voteResults.reduce((acc: Record<number, number>, result: { option: string; votes: number }, index: number) => {
            acc[index] = result.votes;
            return acc;
          }, {})
        }));
      }
    } catch (error) {
      console.error('Failed to vote on poll:', error);
    }
  }

  async function toggleComments(postId: string) {
    const isShowing = showComments[postId];
    
    if (!isShowing && !comments[postId]) {
      // Load comments
      try {
        const response = await fetch(`/api/newsfeed/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(prev => ({ ...prev, [postId]: data.comments }));
          
          // Set reaction data for all comments
          data.comments.forEach((comment: any) => {
            setCommentReactions(prev => ({
              ...prev,
              [comment.id]: {
                agreeCount: comment.reactionCounts?.agreeCount || 0,
                disagreeCount: comment.reactionCounts?.disagreeCount || 0,
                userReaction: comment.userReaction
              }
            }));
          });
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
    
    setShowComments(prev => ({ ...prev, [postId]: !isShowing }));
  }

  async function addComment(postId: string) {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(`/api/newsfeed/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add to comments list if expanded
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment]
        }));
        
        // Clear input
        setNewComment(prev => ({ ...prev, [postId]: '' }));
        
        // Update comment count in posts
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, comments: post.comments + 1 }
            : post
        ));
        
        // Refresh top comments to show the new comment
        await loadTopComments(postId);
        
      } else {
        const errorData = await response.text();
        console.error('Failed to post comment:', response.status, errorData);
        alert('Failed to post comment. Please try again.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment. Please try again.');
    }
  }

  async function deleteComment(postId: string, commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/newsfeed/${postId}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });
      
      if (response.ok) {
        // Remove from top comments
        setTopComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.filter(comment => comment.id !== commentId) || []
        }));
        
        // Remove from full comments list if expanded
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.filter(comment => comment.id !== commentId) || []
        }));
        
        // Update comment count in posts
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, comments: Math.max(0, post.comments - 1) }
            : post
        ));
        
        // Refresh top comments to maintain proper display
        await loadTopComments(postId);
        
      } else {
        const errorData = await response.text();
        console.error('Failed to delete comment:', response.status, errorData);
        alert('Failed to delete comment. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment. Please try again.');
    }
  }

  async function handleCommentReaction(postId: string, commentId: string, reactionType: 'AGREE' | 'DISAGREE') {
    try {
      const response = await fetch(`/api/newsfeed/${postId}/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCommentReactions(prev => ({
          ...prev,
          [commentId]: data.reactions
        }));
      } else {
        console.error('Failed to handle reaction:', response.status);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  }

  function openReportModal(postId: string) {
    setShowReportModal(postId);
    setReportReason('');
    setReportDescription('');
  }

  // Function to capture screenshot of the post
  async function capturePostScreenshot(postId: string): Promise<string | null> {
    try {
      const postElement = document.querySelector(`[data-post-id="${postId}"]`);
      if (!postElement) {
        console.warn('Post element not found for screenshot');
        return null;
      }

      // Use html2canvas to capture the post
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(postElement as HTMLElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 0.8 // Reduce size for storage
      });

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          } else {
            resolve(null);
          }
        }, 'image/jpeg', 0.8);
      });
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      return null;
    }
  }

  async function submitReport() {
    if (!showReportModal || !reportReason.trim()) {
      alert('Please select a violation type.');
      return;
    }

    // Show loading state
    const submitButton = document.querySelector('[data-submit-report]') as HTMLButtonElement;
    const originalText = submitButton?.textContent || 'Submit Report';
    if (submitButton) submitButton.textContent = 'Capturing evidence...';

    try {
      // Capture screenshot of the post
      const screenshotDataUrl = await capturePostScreenshot(showReportModal);
      
      if (submitButton) submitButton.textContent = 'Submitting report...';

      const response = await fetch(`/api/newsfeed/${showReportModal}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: reportReason,
          description: reportDescription.trim(),
          screenshot: screenshotDataUrl
        })
      });

      if (response.ok) {
        alert('Report submitted successfully with evidence screenshot. We will review this content.');
        setShowReportModal(null);
        setReportReason('');
        setReportDescription('');
      } else {
        const errorData = await response.text();
        console.error('Failed to submit report:', errorData);
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      // Reset button text
      const submitButton = document.querySelector('[data-submit-report]') as HTMLButtonElement;
      if (submitButton) submitButton.textContent = originalText;
    }
  }

  async function startEditPost(postId: string, currentTitle: string | null, currentContent: string) {
    setEditingPost(postId);
    setEditTitle(currentTitle || '');
    setEditContent(currentContent);
  }

  async function savePostEdit(postId: string) {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/newsfeed/${postId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle.trim() || null, 
          content: editContent.trim() 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                title: data.post.title,
                content: data.post.content,
                updatedAt: new Date(data.post.updatedAt)
              }
            : post
        ));
        cancelPostEdit();
      }
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  }

  function cancelPostEdit() {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
  }

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 250) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  function toggleSolutionForm(postId: string) {
    const newSet = new Set(showSolutionForm);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
    }
    setShowSolutionForm(newSet);
    setSolutionTitle('');
    setSolutionDescription('');
  }

  async function submitSolutionProposal(postId: string) {
    if (!solutionTitle.trim() || !solutionDescription.trim()) {
      alert('Please provide both title and description for your solution');
      return;
    }

    try {
      const response = await fetch(`/api/newsfeed/${postId}/propose-solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solutionTitle: solutionTitle.trim(),
          solutionDescription: solutionDescription.trim()
        })
      });

      if (response.ok) {
        await response.json();
        alert('Solution proposal submitted successfully!');
        toggleSolutionForm(postId);
        // Refresh posts to show the new solution
        loadPosts();
      } else {
        const error = await response.json();
        alert(`Failed to submit solution: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
      alert('Failed to submit solution. Please try again.');
    }
  }

  async function handleAdminDelete(postId: string, postType: string) {
    if (!isAdmin) {
      alert('Access denied. Only administrators can delete content.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete this ${postType.toLowerCase()}? This action cannot be undone.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      let result;
      
      // Check if this is a video from the videos table or a regular newsfeed post
      if (postId.startsWith('video_')) {
        // Extract actual video ID (remove 'video_' prefix)
        const actualVideoId = postId.replace('video_', '');
        result = await deleteVideoAction(actualVideoId);
      } else if (postId.startsWith('photo_')) {
        // These are generated from user profiles, not deletable directly
        alert('Profile photos cannot be deleted from the news feed. Please moderate them from the user\'s profile page.');
        return;
      } else {
        // Regular news feed post
        result = await deletePostAction(postId);
      }

      if (result.success) {
        alert(result.message);
        // Remove the deleted post from the current view
        setPosts(prev => prev.filter(post => post.id !== postId));
        console.log('✅ Content deleted by admin:', result);
      } else {
        alert(result.error || 'Failed to delete content');
        console.error('❌ Admin deletion failed:', result);
      }
    } catch (error) {
      console.error('❌ Error during admin deletion:', error);
      alert('An error occurred while deleting the content. Please try again.');
    }
  }

  const getTabIcon = (tab: FeedType) => {
    switch (tab) {
      case 'RANDOM': return '🎲';
      case 'FRIENDS': return '👥';
      case 'FOLLOWING': return '👁️';
      case 'LOCAL': return '📍';
      case 'NATIONAL': return '🌍';
      case 'POLLS': return '🗳️';
      case 'IMAGES': return '🖼️';
      case 'VIDEOS': return '🎥';
      default: return '📰';
    }
  };

  const getTabCount = (tab: FeedType) => {
    if (!postCounts) return '';
    
    switch (tab) {
      case 'IMAGES': return postCounts.IMAGE > 0 ? ` (${postCounts.IMAGE})` : '';
      case 'VIDEOS': return postCounts.VIDEO > 0 ? ` (${postCounts.VIDEO})` : '';
      case 'POLLS': return postCounts.POLL > 0 ? ` (${postCounts.POLL})` : '';
      default: return '';
    }
  };

  const getTabLabel = (tab: FeedType) => {
    switch (tab) {
      case 'RANDOM': return 'Random';
      case 'FRIENDS': return 'Friends';
      case 'FOLLOWING': return 'Following';
      case 'LOCAL': return 'Local';
      case 'NATIONAL': return 'National';
      case 'POLLS': return 'Polls';
      case 'IMAGES': return 'Images';
      case 'VIDEOS': return 'Videos';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return '📝';
      case 'IMAGE': return '🖼️';
      case 'VIDEO': return '🎥';
      case 'TESTIMONY': return '📖';
      case 'LINK': return '🔗';
      case 'POLL': return '🗳️';
      default: return '📄';
    }
  };

  if (!user) {
    return <div>Please sign in to access the news feed.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
              <span>📰</span>
              News Feed
              {isAdmin && (
                <span className="text-sm bg-red-600 text-white px-2 py-1 rounded-full font-normal">
                  ADMIN
                </span>
              )}
            </h1>
            <div className="flex items-center gap-3">
              {/* Swipe Mode Toggle - only show for Random feed */}
              {activeTab === 'RANDOM' && (
                <button
                  onClick={() => setIsSwipeMode(!isSwipeMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSwipeMode 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                  title={isSwipeMode ? 'Switch to traditional feed' : 'Switch to swipe mode'}
                >
                  {isSwipeMode ? '📱 Swipe Mode' : '📋 List Mode'}
                </button>
              )}
              <Link
                href="/dashboard/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ✨ Create Post
              </Link>
            </div>
          </div>
          <p className="text-slate-600 mt-2">
            Discover content from different communities and connections. &quot;Friends&quot; shows posts from accepted friends, &quot;Following&quot; shows posts from people you follow.
            {isAdmin && (
              <span className="block text-red-600 font-medium mt-1">
                🛡️ Admin Mode: You can delete inappropriate content
              </span>
            )}
          </p>
        </div>

        {/* Feed Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-wrap justify-center gap-2">
            {(['RANDOM', 'FRIENDS', 'FOLLOWING', 'LOCAL', 'NATIONAL', 'POLLS', 'IMAGES', 'VIDEOS'] as FeedType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <span className="mr-2">{getTabIcon(tab)}</span>
                {getTabLabel(tab)}{getTabCount(tab)}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {isSwipeMode && activeTab === 'RANDOM' ? (
          <SwipeFeed feedType={activeTab} />
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-600 text-lg">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white/80 rounded-xl">
                <div className="text-8xl mb-6">📪</div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">No posts yet</h3>
                <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
                  Be the first to share something interesting in the {activeTab.toLowerCase()} feed!
                </p>
                <Link 
                  href="/dashboard/profile"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="text-xl">✨</span>
                  Create First Post
                </Link>
              </div>
            ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                data-post-id={post.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                      <span className="text-slate-700 font-bold text-lg">
                        {post.author.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">
                          {post.author.username || 'Unknown User'}
                        </span>
                        {post.author.isVerified && (
                          <span className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{getPostTypeIcon(post.postType)}</span>
                        <span>{post.postType.toLowerCase()}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.updatedAt && new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime() && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">edited</span>
                          </>
                        )}
                        {post.location && (
                          <>
                            <span>•</span>
                            <span>📍 {post.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      {post.feedType.toLowerCase()}
                    </span>
                    {user && post.author.username === user.username && post.postType === 'TEXT' && !post.id.startsWith('video_') && !post.id.startsWith('photo_') && (
                      <button
                        onClick={() => startEditPost(post.id, post.title, post.content)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full text-xs font-medium transition-colors ml-1 flex items-center gap-1"
                        title="Edit this post"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleAdminDelete(post.id, post.postType)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-full text-xs font-medium transition-colors ml-1 flex items-center gap-1"
                        title={`Delete this ${post.postType.toLowerCase()}`}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  {editingPost === post.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Post title (optional)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => savePostEdit(post.id)}
                          disabled={!editContent.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={cancelPostEdit}
                          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Video Posts: Video first, then truncated text */}
                      {post.postType === 'VIDEO' && post.videoUrl ? (
                        <>
                          {post.title && (
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                          )}
                          
                          {/* Video Content First */}
                          <div className="mb-4">
                            <video controls className="w-full rounded-lg">
                              <source src={post.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>

                          {/* Truncated Text Content */}
                          <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {expandedPosts.has(post.id) ? post.content : truncateText(post.content)}
                            </p>
                            {post.content.length > 250 && (
                              <button
                                onClick={() => togglePostExpansion(post.id)}
                                className="text-blue-600 hover:text-blue-800 font-medium mt-2 text-sm"
                              >
                                {expandedPosts.has(post.id) ? 'Show Less' : 'Show More'}
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Image Posts: Images first, then full text */}
                          {post.imageUrls.length > 0 && (
                            <>
                              {post.title && (
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                              )}
                              
                              {/* Images First */}
                              <div className="mb-4 grid grid-cols-2 gap-2">
                                {post.imageUrls.slice(0, 4).map((url, index) => (
                                  <Image 
                                    key={index}
                                    src={url} 
                                    alt="Post image"
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover w-full h-48"
                                  />
                                ))}
                              </div>

                              {/* Full Text Content */}
                              <div className="prose prose-slate max-w-none">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                  {post.content}
                                </p>
                              </div>
                            </>
                          )}

                          {/* Text/Other Posts: Standard layout (title, content, then media if any) */}
                          {post.imageUrls.length === 0 && !post.videoUrl && (
                            <>
                              {post.title && (
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                              )}
                              <div className="prose prose-slate max-w-none">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                  {post.content}
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* Link Content (for all post types) */}
                      {post.linkUrl && (
                        <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                          <a 
                            href={post.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            🔗 {post.linkUrl}
                          </a>
                        </div>
                      )}

                      {/* Poll Display for POLL type posts */}
                      {post.postType === 'POLL' && post.pollOptions && post.pollOptions.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="border-t border-slate-200 pt-4">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              🗳️ Poll Options
                              {post.pollEndsAt && new Date(post.pollEndsAt) > new Date() && (
                                <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                  Ends {new Date(post.pollEndsAt).toLocaleDateString()}
                                </span>
                              )}
                              {post.pollEndsAt && new Date(post.pollEndsAt) <= new Date() && (
                                <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                  Poll Ended
                                </span>
                              )}
                            </h4>
                            <div className="space-y-2">
                              {post.pollOptions.map((option, index) => (
                                <div key={index} className="border border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <span className="text-slate-800 font-medium">{option}</span>
                                      {pollVotes[post.id] && (
                                        <div className="text-sm text-slate-600 mt-1">
                                          {pollVotes[post.id][index] || 0} votes
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handlePollVote(post.id, index)}
                                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors"
                                      disabled={!!(post.pollEndsAt && new Date(post.pollEndsAt) <= new Date())}
                                    >
                                      Vote
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Poll Metadata */}
                            <div className="mt-3 text-sm text-slate-600 space-y-1">
                              {post.issueLocation && (
                                <div className="flex items-center gap-2">
                                  <span>📍</span>
                                  <span className="font-medium">Location:</span>
                                  <span>{post.issueLocation}</span>
                                </div>
                              )}
                              {post.pollType && (
                                <div className="flex items-center gap-2">
                                  <span>📊</span>
                                  <span className="font-medium">Poll Type:</span>
                                  <span className="capitalize">{post.pollType.replace('_', ' ')}</span>
                                </div>
                              )}
                              {post.fundingGoal && (
                                <div className="flex items-center gap-2">
                                  <span>💰</span>
                                  <span className="font-medium">Funding Goal:</span>
                                  <span>${post.fundingGoal.toLocaleString()}</span>
                                </div>
                              )}
                              {post.allowSolutions && (
                                <div className="flex items-center gap-2 text-green-600">
                                  <span>💡</span>
                                  <button
                                    onClick={() => toggleSolutionForm(post.id)}
                                    className="font-medium hover:underline"
                                  >
                                    Propose a solution
                                  </button>
                                </div>
                              )}
                              {post.allowFunding && (
                                <div className="flex items-center gap-2 text-purple-600">
                                  <span>💳</span>
                                  <span>Funding enabled</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Solution Proposal Form */}
                      {showSolutionForm.has(post.id) && (
                        <div className="mt-4 border-t border-slate-200 pt-4">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            💡 Propose a Solution
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Solution Title
                              </label>
                              <input
                                type="text"
                                value={solutionTitle}
                                onChange={(e) => setSolutionTitle(e.target.value)}
                                placeholder="Brief title for your solution"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Detailed Description
                              </label>
                              <textarea
                                value={solutionDescription}
                                onChange={(e) => setSolutionDescription(e.target.value)}
                                placeholder="Explain your solution in detail. How would this address the issue?"
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => submitSolutionProposal(post.id)}
                                disabled={!solutionTitle.trim() || !solutionDescription.trim()}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                Submit Solution
                              </button>
                              <button
                                onClick={() => toggleSolutionForm(post.id)}
                                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Post Actions */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Voting buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleVote(post.id, 'UPVOTE')}
                          disabled={post.id.startsWith('legacy_')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                            post.id.startsWith('legacy_')
                              ? 'text-slate-400 cursor-not-allowed opacity-50'
                              : post.userVote === 'UPVOTE' 
                                ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                                : 'text-slate-600 hover:bg-green-50 hover:text-green-600'
                          }`}
                          title={post.id.startsWith('legacy_') ? 'Legacy posts do not support voting' : 'Upvote this post'}
                        >
                          <span>👍</span>
                          <span className="text-sm font-medium">{post.upvotes || 0}</span>
                        </button>
                        <button
                          onClick={() => handleVote(post.id, 'DOWNVOTE')}
                          disabled={post.id.startsWith('legacy_')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                            post.id.startsWith('legacy_')
                              ? 'text-slate-400 cursor-not-allowed opacity-50'
                              : post.userVote === 'DOWNVOTE' 
                                ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                                : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                          title={post.id.startsWith('legacy_') ? 'Legacy posts do not support voting' : 'Downvote this post'}
                        >
                          <span>👎</span>
                          <span className="text-sm font-medium">{post.downvotes || 0}</span>
                        </button>
                      </div>
                      
                      {/* Comments button */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          showComments[post.id] 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <span>💬</span>
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                      
                      {/* Shares */}
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>🔄</span>
                        <span className="text-sm font-medium">{post.shares}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors text-sm"
                      >
                        <span>🔗</span> Share
                      </button>
                      <button 
                        onClick={() => openReportModal(post.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors text-sm"
                        title="Report legal violation"
                      >
                        <span>🚨</span> Report
                      </button>
                    </div>
                  </div>

                  {/* Top Comments (Always Visible) */}
                  {post.comments > 0 && topComments[post.id] && topComments[post.id].length > 0 && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="space-y-2">
                        {topComments[post.id].map((comment) => (
                          <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                                  <span className="text-slate-700 font-bold text-xs">
                                    {comment.user.username?.[0]?.toUpperCase() || '?'}
                                  </span>
                                </div>
                                <span className="font-medium text-slate-700 text-sm">
                                  {comment.user.username || 'Anonymous'}
                                </span>
                                <span className="text-slate-400 text-xs">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {currentUserInfo[post.id] && (
                                currentUserInfo[post.id].userId === (comment.user as any).clerkId || 
                                currentUserInfo[post.id].isAdmin
                              ) && (
                                <button
                                  onClick={() => deleteComment(post.id, comment.id)}
                                  className="text-red-500 hover:text-red-700 text-lg font-bold w-6 h-6 flex items-center justify-center"
                                  title="Delete comment"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm">{comment.content}</p>
                            
                            {/* Reaction buttons */}
                            <div className="flex items-center gap-4 mt-2">
                              <button
                                onClick={() => handleCommentReaction(post.id, comment.id, 'AGREE')}
                                className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md transition-colors ${
                                  commentReactions[comment.id]?.userReaction === 'AGREE' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'text-slate-500 hover:bg-green-50 hover:text-green-600'
                                }`}
                              >
                                👍 Agree {commentReactions[comment.id]?.agreeCount || 0}
                              </button>
                              <button
                                onClick={() => handleCommentReaction(post.id, comment.id, 'DISAGREE')}
                                className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md transition-colors ${
                                  commentReactions[comment.id]?.userReaction === 'DISAGREE' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'text-slate-500 hover:bg-red-50 hover:text-red-600'
                                }`}
                              >
                                👎 Disagree {commentReactions[comment.id]?.disagreeCount || 0}
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Show more comments button if there are more than 3 */}
                        {post.comments > 3 && !showComments[post.id] && (
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View all {post.comments} comments
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add Comment Form (Always Visible) */}
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => {
                          setNewComment(prev => ({ 
                            ...prev, 
                            [post.id]: e.target.value 
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            addComment(post.id);
                          }
                        }}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addComment(post.id);
                        }}
                        disabled={!newComment[post.id]?.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Expanded Comments Section (When "View all" is clicked) */}
                  {showComments[post.id] && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-slate-900">All Comments ({post.comments})</h4>
                        <button
                          onClick={() => setShowComments(prev => ({ ...prev, [post.id]: false }))}
                          className="text-slate-400 hover:text-slate-600 text-sm"
                        >
                          Hide
                        </button>
                      </div>

                      {/* All Comments List */}
                      <div className="space-y-3">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                                  <span className="text-slate-700 font-bold text-sm">
                                    {comment.user.username?.[0]?.toUpperCase() || '?'}
                                  </span>
                                </div>
                                <span className="font-medium text-slate-700">
                                  {comment.user.username || 'Anonymous'}
                                </span>
                                {comment.user.isVerified && (
                                  <span className="text-blue-500 text-sm">✓</span>
                                )}
                                <span className="text-slate-400 text-sm">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {currentUserInfo[post.id] && (
                                currentUserInfo[post.id].userId === (comment.user as any).clerkId || 
                                currentUserInfo[post.id].isAdmin
                              ) && (
                                <button
                                  onClick={() => deleteComment(post.id, comment.id)}
                                  className="text-red-500 hover:text-red-700 text-lg font-bold w-6 h-6 flex items-center justify-center"
                                  title="Delete comment"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <p className="text-slate-600">{comment.content}</p>
                            
                            {/* Reaction buttons */}
                            <div className="flex items-center gap-4 mt-3">
                              <button
                                onClick={() => handleCommentReaction(post.id, comment.id, 'AGREE')}
                                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-colors ${
                                  commentReactions[comment.id]?.userReaction === 'AGREE' 
                                    ? 'bg-green-100 text-green-700 font-medium' 
                                    : 'text-slate-500 hover:bg-green-50 hover:text-green-600'
                                }`}
                              >
                                👍 Agree {commentReactions[comment.id]?.agreeCount || 0}
                              </button>
                              <button
                                onClick={() => handleCommentReaction(post.id, comment.id, 'DISAGREE')}
                                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-colors ${
                                  commentReactions[comment.id]?.userReaction === 'DISAGREE' 
                                    ? 'bg-red-100 text-red-700 font-medium' 
                                    : 'text-slate-500 hover:bg-red-50 hover:text-red-600'
                                }`}
                              >
                                👎 Disagree {commentReactions[comment.id]?.disagreeCount || 0}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
          </div>
        )}
      </div>
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              🚨 Report Legal Violation
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This platform supports free speech. Only report content that violates laws, 
              not content you disagree with.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type of Legal Violation *
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select violation type...</option>
                <option value="harassment">Criminal Harassment/Threats</option>
                <option value="doxxing">Doxxing/Publishing Private Info</option>
                <option value="defamation">Defamation/Libel</option>
                <option value="copyright">Copyright Infringement</option>
                <option value="fraud">Fraud/Scam</option>
                <option value="child_safety">Child Safety Violation</option>
                <option value="terrorism">Terrorism/Violence Incitement</option>
                <option value="spam">Spam/Malware</option>
                <option value="other">Other Legal Violation</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Provide specific details about the legal violation..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowReportModal(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={!reportReason.trim()}
                data-submit-report
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}