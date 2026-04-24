"use client";

import { deleteMediaAction } from "@/app/actions/deleteMediaAction";
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";

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
  isLiked?: boolean;
  isPinned?: boolean;
  pinnedAt?: Date | null;
  comments?: Array<{
    id: string;
    content: string;
    userId: string;
    username: string | null;
    createdAt: Date;
  }>;
}

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
}

interface User {
  id: string;
  username: string | null;
  bio: string | null;
  tagline: string | null;
  profilePicture: string | null;
  legalName: string | null;
  dateOfBirth: Date | null;
  birthPlace: string | null;
  currentCity: string | null;
  currentState: string | null;
  currentCountry: string | null;
  maritalStatus: string | null;
  phoneNumber: string | null;
  email: string | null;
  // Professional Information
  occupation: string | null;
  employer: string | null;
  education: string | null;
  // Government IDs
  socialSecurity: string | null;
  driversLicense: string | null;
  passport: string | null;
  // Additional Information
  previousAddresses: string | null;
  militaryService: string | null;
  criminalHistory: string | null;
  isVerified: boolean;
  videos: Video[];
  posts: Post[];
  // Visibility settings
  showUsername: boolean;
  showTagline: boolean;
  showBio: boolean;
  showLegalName: boolean;
  showDateOfBirth: boolean;
  showBirthPlace: boolean;
  showCurrentCity: boolean;
  showCurrentState: boolean;
  showCurrentCountry: boolean;
  showMaritalStatus: boolean;
  showBasicInfo: boolean;
  showContactInfo: boolean;
  showProfessionalInfo: boolean;
  showGovernmentIds: boolean;
  showAdditionalInfo: boolean;
}

export default function ProfileContent({ 
  user, 
  isOwner, 
  initialFriendshipStatus = 'none',
  initialIsFollowing = false 
}: { 
  user: User; 
  isOwner: boolean; 
  initialFriendshipStatus?: string;
  initialIsFollowing?: boolean;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos' | 'posts'>('posts');
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [pinnedVideos, setPinnedVideos] = useState<Set<string>>(new Set());
  const [pinningVideo, setPinningVideo] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  
  // Friend and Follow states
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'friends'>(initialFriendshipStatus as 'none' | 'pending' | 'friends');
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [sendingFriendRequest, setSendingFriendRequest] = useState(false);
  const [followingUser, setFollowingUser] = useState(false);

  // Initialize pinned videos state
  useEffect(() => {
    if (user?.videos) {
      const pinned = new Set(
        user.videos
          .filter((video: Video) => video.isPinned)
          .map((video: Video) => video.id)
      );
      setPinnedVideos(pinned);
    }
  }, [user?.videos]);

  // Handle video pinning
  const handlePinVideo = async (videoId: string, currentlyPinned: boolean) => {
    if (pinningVideo) return;
    
    try {
      setPinningVideo(videoId);
      
      const response = await fetch('/api/video/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          isPinned: !currentlyPinned
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to update pin status');
        return;
      }

      // Update local state
      const newPinnedVideos = new Set(pinnedVideos);
      if (currentlyPinned) {
        newPinnedVideos.delete(videoId);
      } else {
        newPinnedVideos.add(videoId);
      }
      setPinnedVideos(newPinnedVideos);
      
      // Refresh the page to update the user data
      window.location.reload();
      
    } catch (error) {
      console.error('Error pinning video:', error);
      alert('Failed to update pin status');
    } finally {
      setPinningVideo(null);
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      setDeletingPost(postId);
      
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to delete post');
        return;
      }

      // Refresh the page to update the posts
      window.location.reload();
      
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeletingPost(null);
    }
  };

  async function handleDelete(mediaId: string) {
    if (!confirm("Delete this media?")) return;
    
    setDeleting(mediaId);
    const result = await deleteMediaAction(mediaId);
    setDeleting(null);
    
    if (result.success) {
      window.location.reload();
    }
  }

  const handleNavigate = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
    const newVideo = user.videos[newIndex];
    const videoWithUser = { ...newVideo, user: { username: user.username } };
    setSelectedVideo(videoWithUser);
  };

  // Handle friend request
  const handleSendFriendRequest = async () => {
    if (sendingFriendRequest || friendshipStatus !== 'none') return;
    
    try {
      setSendingFriendRequest(true);
      
      const response = await fetch('/api/friends/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendId: user.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to send friend request');
        return;
      }

      setFriendshipStatus('pending');
      
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    } finally {
      setSendingFriendRequest(false);
    }
  };

  // Handle follow toggle
  const handleToggleFollow = async () => {
    if (followingUser) return;
    
    try {
      setFollowingUser(true);
      
      const response = await fetch('/api/friends/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          action: isFollowing ? 'unfollow' : 'follow'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to update follow status');
        return;
      }

      setIsFollowing(!isFollowing);
      
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status');
    } finally {
      setFollowingUser(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-pink-400 py-12 px-6 text-center">
        <h1 className="text-4xl font-bold text-white">{user.username}</h1>
        <p className="text-white opacity-90">{user.tagline || "Bearing witness to truth."}</p>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Action Buttons - only show if not viewing own profile */}
        {!isOwner && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleSendFriendRequest()}
              disabled={sendingFriendRequest}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {sendingFriendRequest ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>👥</span>
              )}
              {friendshipStatus === 'none' && 'Send Friend Request'}
              {friendshipStatus === 'pending' && 'Friend Request Sent'}
              {friendshipStatus === 'friends' && 'Friends ✓'}
            </button>
            
            <button
              onClick={() => handleToggleFollow()}
              disabled={followingUser}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {followingUser ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{isFollowing ? '✓' : '+'}</span>
              )}
              {isFollowing ? 'Following' : 'Stay Up to Date'}
            </button>
            
            <button
              onClick={() => {
                const reportUrl = `/report-user?userId=${user.id}&username=${user.username}`;
                window.location.href = reportUrl;
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>🚨</span>
              Report User
            </button>
          </div>
        )}

        {/* Identity Verification Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-xl flex items-center">
              Identity
              {user.isVerified && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  ✓ Verified
                </span>
              )}
            </h2>
            {!user.isVerified && isOwner && (
              <button className="text-blue-500 text-sm hover:underline">
                Get Verified
              </button>
            )}
          </div>

          {/* Layout matching the mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Left Column: Profile Picture + Personal Info */}
            <div className="lg:col-span-1">
              {/* Profile Picture */}
              <div className="mb-6 flex justify-center lg:justify-start">
                {user.profilePicture ? (
                  <div className="relative">
                    <Image
                      src={user.profilePicture}
                      alt={`${user.username || user.legalName || 'User'}'s profile`}
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                      priority
                      onError={(e) => {
                        console.error('Failed to load profile picture:', user.profilePicture);
                        // Hide the image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-30 h-30 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                    <span className="text-white text-3xl font-bold">
                      {(user.username?.[0] || user.legalName?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-3">
                {(user.showLegalName && user.legalName) || 
                 (user.showDateOfBirth && user.dateOfBirth) || 
                 (user.showBirthPlace && user.birthPlace) ||
                 (user.showCurrentCity && user.currentCity) ||
                 (user.showCurrentState && user.currentState) ||
                 (user.showCurrentCountry && user.currentCountry) ||
                 (user.showMaritalStatus && user.maritalStatus) ? (
                  <>
                    {user.showLegalName && user.legalName && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Legal Name:</span><br/>{user.legalName}</p>
                    )}
                    {user.showDateOfBirth && user.dateOfBirth && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Date of Birth:</span><br/>{new Date(user.dateOfBirth).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                    )}
                    {/* Location - show if any location fields are visible */}
                    {((user.showCurrentCity && user.currentCity) || 
                      (user.showCurrentState && user.currentState) || 
                      (user.showCurrentCountry && user.currentCountry)) && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-600">Location:</span><br/>
                        {[
                          user.showCurrentCity && user.currentCity,
                          user.showCurrentState && user.currentState,
                          user.showCurrentCountry && user.currentCountry
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {user.showBirthPlace && user.birthPlace && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Birth Place:</span><br/>{user.birthPlace}</p>
                    )}
                    {user.showMaritalStatus && user.maritalStatus && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Marital Status:</span><br/>{user.maritalStatus}</p>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic text-sm">
                    {isOwner 
                      ? "Complete your identity verification to become a verified witness" 
                      : "This user has not completed identity verification"
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Biography + Professional Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biography */}
              {(user.showBio && user.bio) || isOwner ? (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Biography</h3>
                  {user.showBio && user.bio ? (
                    <p className="text-gray-700 leading-relaxed text-sm">{user.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      {isOwner ? "Add a biography to tell your story" : "Biography is private"}
                    </p>
                  )}
                </div>
              ) : null}

              {/* Professional Information */}
              {user.showProfessionalInfo && (user.occupation || user.employer || user.education) && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Professional Information</h3>
                  <div className="space-y-3">
                    {user.occupation && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Occupation:</span><br/>{user.occupation}</p>
                    )}
                    {user.employer && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Employer:</span><br/>{user.employer}</p>
                    )}
                    {user.education && (
                      <p className="text-sm"><span className="font-medium text-gray-600">Education:</span><br/>{user.education}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media Tabs */}
          {(user.posts.length > 0 || user.videos.length > 0) && (
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveMediaTab('posts')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeMediaTab === 'posts'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Posts ({user.posts.length})
                </button>
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeMediaTab === 'photos'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Photos ({user.videos.filter(v => /\.(jpg|jpeg|png|gif|webp)$/i.test(v.url)).length})
                </button>
                <button
                  onClick={() => setActiveMediaTab('videos')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeMediaTab === 'videos'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Videos ({user.videos.filter(v => !/\.(jpg|jpeg|png|gif|webp)$/i.test(v.url)).length})
                </button>
              </div>
              
              {/* Media Content */}
              <div className="mt-4">
                {activeMediaTab === 'photos' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {user.videos
                      .filter(video => /\.(jpg|jpeg|png|gif|webp)$/i.test(video.url))
                      .slice(0, 6)
                      .map((photo, index) => (
                        <div 
                          key={photo.id} 
                          className="rounded-lg overflow-hidden relative group cursor-pointer"
                          onClick={() => {
                            setSelectedVideo({ ...photo, user: { username: user.username } });
                            setCurrentImageIndex(index);
                          }}
                        >
                          <Image
                            src={photo.url}
                            alt={photo.caption || "Photo"}
                            width={120}
                            height={96}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                            style={{ objectFit: 'cover' }}
                          />
                          {/* Delete button - only show if user owns this profile */}
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(photo.id);
                              }}
                              disabled={deleting === photo.id}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 text-xs"
                              title="Delete photo"
                            >
                              {deleting === photo.id ? "..." : "✕"}
                            </button>
                          )}
                          {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                              {photo.caption}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                
                {activeMediaTab === 'videos' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.videos
                      .filter(video => !/\.(jpg|jpeg|png|gif|webp)$/i.test(video.url))
                      .slice(0, 4)
                      .map((video) => (
                        <div 
                          key={video.id} 
                          className="rounded-lg overflow-hidden relative group cursor-pointer"
                          onClick={() => setSelectedVideo({ ...video, user: { username: user.username } })}
                        >
                          <video
                            src={video.url}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                            poster="" // This will show first frame as thumbnail
                          />
                          {/* Delete button - only show if user owns this profile */}
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(video.id);
                              }}
                              disabled={deleting === video.id}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 text-xs z-10"
                              title="Delete video"
                            >
                              {deleting === video.id ? "..." : "✕"}
                            </button>
                          )}
                          {/* Play icon overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                          {video.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                              {video.caption}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

                {activeMediaTab === 'posts' && (
                  <div className="space-y-4">
                    {user.posts
                      .slice(0, showAllPosts ? user.posts.length : 3)
                      .map((post) => (
                        <div 
                          key={post.id} 
                          className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500 relative group"
                        >
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {post.content}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            {/* Delete button - only show if user owns this profile */}
                            {isOwner && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                disabled={deletingPost === post.id}
                                className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-all disabled:opacity-50 text-xs"
                                title="Delete post"
                              >
                                {deletingPost === post.id ? "..." : "✕"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    {user.posts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No posts yet</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Show more link */}
                {((activeMediaTab === 'photos' && user.videos.filter(v => /\.(jpg|jpeg|png|gif|webp)$/i.test(v.url)).length > 6) ||
                  (activeMediaTab === 'videos' && user.videos.filter(v => !/\.(jpg|jpeg|png|gif|webp)$/i.test(v.url)).length > 4) ||
                  (activeMediaTab === 'posts' && user.posts.length > 3)) && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => {
                        if (activeMediaTab === 'photos') {
                          setShowAllPhotos(true);
                        } else if (activeMediaTab === 'videos') {
                          setShowAllVideos(true);
                        } else if (activeMediaTab === 'posts') {
                          setShowAllPosts(true);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View all {activeMediaTab} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {user.showContactInfo && (user.phoneNumber || user.email) && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold text-xl mb-4">Contact Information</h2>
            <div className="space-y-2">
              {user.phoneNumber && (
                <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
              )}
              {user.email && (
                <p><span className="font-medium">Email:</span> {user.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Government IDs */}
        {user.showGovernmentIds && (user.socialSecurity || user.driversLicense || user.passport) && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold text-xl mb-4">Government IDs</h2>
            <div className="space-y-2">
              {user.socialSecurity && (
                <p><span className="font-medium">Social Security:</span> {user.socialSecurity}</p>
              )}
              {user.driversLicense && (
                <p><span className="font-medium">Driver&apos;s License:</span> {user.driversLicense}</p>
              )}
              {user.passport && (
                <p><span className="font-medium">Passport:</span> {user.passport}</p>
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {user.showAdditionalInfo && (user.previousAddresses || user.militaryService || user.criminalHistory) && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold text-xl mb-4">Additional Information</h2>
            <div className="space-y-3">
              {user.previousAddresses && (
                <div>
                  <p className="font-medium">Previous Addresses (last 5 years):</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{user.previousAddresses}</p>
                </div>
              )}
              {user.militaryService && (
                <div>
                  <p className="font-medium">Military Service:</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{user.militaryService}</p>
                </div>
              )}
              {user.criminalHistory && (
                <div>
                  <p className="font-medium">Criminal History Disclosure:</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{user.criminalHistory}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* All Photos Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">All Photos ({user.videos.filter(v => /\.(jpg|jpeg|png|gif|webp)$/i.test(v.url)).length})</h2>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {user.videos
                  .filter(video => /\.(jpg|jpeg|png|gif|webp)$/i.test(video.url))
                  .map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="rounded-lg overflow-hidden relative group cursor-pointer"
                      onClick={() => {
                        setSelectedVideo({ ...photo, user: { username: user.username } });
                        setCurrentImageIndex(index);
                        setShowAllPhotos(false);
                      }}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption || "Photo"}
                        width={200}
                        height={200}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                      {/* Pin button - only show if user owns this profile */}
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePinVideo(photo.id, pinnedVideos.has(photo.id));
                          }}
                          disabled={pinningVideo === photo.id}
                          className={`absolute top-2 left-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs ${
                            pinnedVideos.has(photo.id) 
                              ? 'bg-yellow-500 hover:bg-yellow-600' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white disabled:opacity-50`}
                        >
                          {pinningVideo === photo.id ? '⏳' : '📌'}
                        </button>
                      )}
                      {/* Delete button - only show if user owns this profile */}
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo.id);
                          }}
                          disabled={deleting === photo.id}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 text-xs"
                        >
                          {deleting === photo.id ? "..." : "✕"}
                        </button>
                      )}
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Videos Modal */}
      {showAllVideos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">All Videos ({user.videos.filter(v => !/\.(jpg|jpeg|png|gif|webp)$/i.test(v.url)).length})</h2>
              <button
                onClick={() => setShowAllVideos(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.videos
                  .filter(video => !/\.(jpg|jpeg|png|gif|webp)$/i.test(video.url))
                  .map((video) => (
                    <div 
                      key={video.id} 
                      className="rounded-lg overflow-hidden relative group cursor-pointer bg-gray-100"
                      onClick={() => {
                        setSelectedVideo({ ...video, user: { username: user.username } });
                        setShowAllVideos(false);
                      }}
                    >
                      <video
                        src={video.url}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        poster="" // This will show first frame as thumbnail
                      />
                      {/* Pin button - only show if user owns this profile */}
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePinVideo(video.id, pinnedVideos.has(video.id));
                          }}
                          disabled={pinningVideo === video.id}
                          className={`absolute top-2 left-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs ${
                            pinnedVideos.has(video.id) 
                              ? 'bg-yellow-500 hover:bg-yellow-600' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white disabled:opacity-50`}
                        >
                          {pinningVideo === video.id ? '⏳' : '📌'}
                        </button>
                      )}
                      {/* Delete button - only show if user owns this profile */}
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(video.id);
                          }}
                          disabled={deleting === video.id}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 text-xs"
                        >
                          {deleting === video.id ? "..." : "✕"}
                        </button>
                      )}
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      {video.caption && (
                        <div className="p-3 bg-white">
                          <p className="text-sm text-gray-700 truncate">{video.caption}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedVideo && (
        <ImageModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          allVideos={user.videos.map((v) => ({ ...v, user: { username: user.username } }))}
          currentIndex={currentImageIndex}
          onNavigate={handleNavigate}
        />
      )}
    </div>
    </>
  );
}