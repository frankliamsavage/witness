'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

type SwipeFeedPost = {
  id: string;
  authorId: string;
  title: string | null;
  content: string;
  postType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'TESTIMONY' | 'LINK' | 'POLL';
  imageUrls: string[];
  videoUrl: string | null;
  linkUrl: string | null;
  feedType: string;
  location: string | null;
  tags: string[];
  upvotes: number;
  downvotes: number;
  shares: number;
  comments: number;
  createdAt: Date;
  author: {
    username: string;
    profilePicture: string | null;
    isVerified: boolean;
  };
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null;
};

interface SwipeFeedProps {
  feedType?: string;
}

export default function SwipeFeed({ feedType = 'RANDOM' }: SwipeFeedProps) {
  const { user } = useUser();
  const [posts, setPosts] = useState<SwipeFeedPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Load initial posts
  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/newsfeed?type=${feedType}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [feedType]);

  // Load more posts when approaching the end
  const loadMorePosts = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/newsfeed?type=${feedType}&limit=10&offset=${posts.length}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [feedType, posts.length, loadingMore]);

  // Initialize
  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, loadPosts]);

  // Handle navigation
  const goToNext = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (posts.length > 0) {
      // Loop back to start (mobius loop)
      setCurrentIndex(0);
    }
    
    // Load more posts when near the end
    if (currentIndex >= posts.length - 3) {
      loadMorePosts();
    }
  }, [currentIndex, posts.length, loadMorePosts]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (posts.length > 0) {
      // Loop to end (mobius loop)
      setCurrentIndex(posts.length - 1);
    }
  }, [currentIndex, posts.length]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe) {
      goToNext();
    } else if (isDownSwipe) {
      goToPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Vote handler
  const handleVote = async (postId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
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
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading swipe feed...</p>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <p className="text-slate-600">No posts available</p>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Current Post */}
      <div className="absolute inset-0 flex flex-col">
        {/* Post Content Area */}
        <div className="flex-1 relative">
          {/* Background based on post type */}
          <div className="absolute inset-0">
            {currentPost.videoUrl ? (
              <video
                className="w-full h-full object-cover"
                src={currentPost.videoUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : currentPost.imageUrls.length > 0 ? (
              <Image
                src={currentPost.imageUrls[0]}
                alt="Post image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
            )}
            
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={currentPost.author.profilePicture || '/default-avatar.png'}
                alt={currentPost.author.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">
                  @{currentPost.author.username}
                  {currentPost.author.isVerified && <span className="ml-1">✓</span>}
                </p>
                <p className="text-xs text-white/80">
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Title */}
            {currentPost.title && (
              <h3 className="text-lg font-bold mb-2">{currentPost.title}</h3>
            )}

            {/* Post Content */}
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              {currentPost.content}
            </p>

            {/* Tags */}
            {currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {currentPost.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-4">
          {/* Upvote */}
          <button
            onClick={() => handleVote(currentPost.id, 'UPVOTE')}
            className={`flex flex-col items-center p-2 rounded-full transition-colors ${
              currentPost.userVote === 'UPVOTE' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <span className="text-xl">👍</span>
            <span className="text-xs mt-1">{currentPost.upvotes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={() => handleVote(currentPost.id, 'DOWNVOTE')}
            className={`flex flex-col items-center p-2 rounded-full transition-colors ${
              currentPost.userVote === 'DOWNVOTE' 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <span className="text-xl">👎</span>
            <span className="text-xs mt-1">{currentPost.downvotes}</span>
          </button>

          {/* Comments */}
          <button className="flex flex-col items-center p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
            <span className="text-xl">💬</span>
            <span className="text-xs mt-1">{currentPost.comments}</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
            <span className="text-xl">📤</span>
            <span className="text-xs mt-1">{currentPost.shares}</span>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 left-4 right-20 flex gap-1">
          {posts.slice(0, 10).map((_, index) => (
            <div
              key={index}
              className={`h-0.5 flex-1 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation Hints */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white/60 text-xs">
          <p>Swipe up/down or use arrow keys</p>
          <p className="text-xs mt-1">{currentIndex + 1} of {posts.length}</p>
        </div>
      </div>
    </div>
  );
}