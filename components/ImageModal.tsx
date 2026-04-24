"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string | null;
  createdAt: Date;
}

interface Video {
  id: string;
  url: string;
  caption: string | null;
  createdAt: Date;
  userId: string;
  user: {
    username: string | null;
  };
  likes?: number;
  comments?: Comment[];
  isLiked?: boolean;
}

interface ImageModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  allVideos: Video[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export default function ImageModal({ video, isOpen, onClose, allVideos, currentIndex, onNavigate }: ImageModalProps) {
  const [comments, setComments] = useState<Comment[]>(video.comments || []);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(video.likes || 0);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: currentUser } = useUser();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentIndex < allVideos.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, currentIndex, onClose, onNavigate, allVideos.length]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < allVideos.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/video/${video.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/video/${video.id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/u/${video.user.username}?media=${video.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${video.user.username}'s media`,
          text: video.caption || "Check out this media on Witness",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  if (!isOpen) return null;

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(video.url);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex"
      onClick={(e) => {
        // Close modal when clicking on backdrop (not on content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Image counter */}
      {allVideos.length > 1 && (
        <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded z-10">
          {currentIndex + 1} / {allVideos.length}
        </div>
      )}

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-50 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>

      {/* Navigation arrows */}
      {allVideos.length > 1 && (
        <>
          {/* Previous button */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              ←
            </button>
          )}

          {/* Next button */}
          {currentIndex < allVideos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              →
            </button>
          )}
        </>
      )}

      {/* Main content */}
      <div className="flex w-full h-full">
        {/* Media section */}
        <div className="flex-1 flex items-center justify-center p-4">
          {isImage ? (
            <Image
              src={video.url}
              alt={video.caption || "Media"}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              priority
            />
          ) : (
            <video
              src={video.url}
              controls
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {video.user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold">{video.user.username}</p>
                <p className="text-xs text-gray-500">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Caption */}
          {video.caption && (
            <div className="p-4 border-b">
              <p className="text-sm">{video.caption}</p>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-b flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
              disabled={!currentUser}
            >
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span className="text-sm">{likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
            >
              <span>📤</span>
              <span className="text-sm">Share</span>
            </button>
          </div>

          {/* Comments */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    {(comment.username || "Anonymous")?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{comment.username || "Anonymous"}</span>{" "}
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment form */}
            {currentUser && (
              <form onSubmit={handleComment} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "..." : "Post"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}