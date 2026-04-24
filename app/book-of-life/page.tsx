'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getApprovedTestimoniesAction } from "../actions/testimonyActions";
import { voteOnTestimonyAction, getTestimoniesWithVotes } from "../actions/votingActions";
import { deleteTestimonyAction, checkAdminStatus } from "../actions/adminActions";

type Testimony = {
  id: string;
  content: string;
  authorName: string;
  isGuest: boolean;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null;
  user: {
    username: string | null;
    isVerified: boolean;
    isWitness: boolean;
  } | null;
};

export default function BookOfLifePage() {
  const { user } = useUser();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTestimonies, setFilteredTestimonies] = useState<Testimony[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'upvotes' | 'engagement'>('recent');
  const [votingLoading, setVotingLoading] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load testimonies when component mounts or tab changes
  useEffect(() => {
    loadTestimonies();
  }, [activeTab, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check admin status when user changes
  useEffect(() => {
    async function checkAdmin() {
      if (user?.id) {
        const adminResult = await checkAdminStatus();
        setIsAdmin(adminResult.isAdmin);
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [user?.id]);

  // Filter testimonies based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTestimonies(testimonies);
    } else {
      const filtered = testimonies.filter(testimony =>
        testimony.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimony.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestimonies(filtered);
    }
  }, [testimonies, searchTerm]);

  async function loadTestimonies() {
    setLoading(true);
    try {
      const result = await getTestimoniesWithVotes(activeTab, user?.id);
      if (result.success && result.testimonies) {
        // Transform the data to match our type
        const transformedTestimonies = (result.testimonies as Array<Record<string, string | number | boolean | null>>).map(t => ({
          id: t.id as string,
          content: t.content as string,
          authorName: t.authorName as string,
          isGuest: t.isGuest as boolean,
          createdAt: new Date(t.createdAt as string),
          upvotes: (t.upvotes as number) || 0,
          downvotes: (t.downvotes as number) || 0,
          userVote: t.userVote as 'UPVOTE' | 'DOWNVOTE' | null,
          user: t.username ? {
            username: t.username as string,
            isVerified: t.isVerified as boolean,
            isWitness: t.isWitness as boolean
          } : null
        }));
        setTestimonies(transformedTestimonies);
      }
    } catch (error) {
      console.error('Failed to load testimonies:', error);
      // Fallback to regular testimonies without voting
      const result = await getApprovedTestimoniesAction();
      if (result.success && result.testimonies) {
        const transformedTestimonies = result.testimonies.map(t => ({
          ...t,
          upvotes: 0,
          downvotes: 0,
          userVote: null
        }));
        setTestimonies(transformedTestimonies);
      }
    }
    setLoading(false);
  }

  async function handleVote(testimonyId: string, voteType: 'UPVOTE' | 'DOWNVOTE') {
    if (!user) {
      alert('Please sign in to vote on testimonies');
      return;
    }
    
    setVotingLoading(testimonyId);
    try {
      const result = await voteOnTestimonyAction(testimonyId, voteType);
      if ('success' in result && result.success) {
        // Reload testimonies to get updated vote counts
        await loadTestimonies();
      } else if ('error' in result && result.error) {
        alert(result.error);
      }
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Failed to vote. Please try again.');
    }
    setVotingLoading(null);
  }

  async function handleDeleteTestimony(testimonyId: string, authorName: string) {
    if (!isAdmin) {
      alert('Access denied. Only administrators can delete testimonies.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete the testimony by ${authorName}?\n\nThis action cannot be undone and will remove all associated votes.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingId(testimonyId);
    try {
      const result = await deleteTestimonyAction(testimonyId);
      if ('success' in result && result.success) {
        alert(result.message);
        // Reload testimonies to reflect the deletion
        await loadTestimonies();
      } else if ('error' in result && result.error) {
        alert(result.error);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete testimony. Please try again.');
    }
    setDeletingId(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-indigo-200 via-amber-100 via-pink-200 to-fuchsia-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block p-4 rounded-full bg-white/50 mb-6">
            <div className="text-6xl">📖</div>
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 mb-4">Book of Life</h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed mb-8">
            A collection of inspiring stories, testimonies, and life experiences shared by our community.
            Every voice matters, and every story has the power to inspire and transform lives.
          </p>
          
          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/submit-testimony"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="text-2xl">✍️</span>
              Share Your Testimony
            </Link>
            <div className="text-slate-600 text-sm">
              Already have {testimonies.length} stories shared
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'recent'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="mr-2">🕒</span>
              Most Recent
            </button>
            <button
              onClick={() => setActiveTab('upvotes')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'upvotes'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="mr-2">⬆️</span>
              Most Pushed Up
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'engagement'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="mr-2">💬</span>
              Most Talked About
            </button>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search testimonies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white/80"
              />
            </div>
          </div>
        </div>

        {/* Testimonies Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="text-2xl">
                {activeTab === 'recent' ? '�' : activeTab === 'upvotes' ? '⬆️' : '�💬'}
              </span>
              {activeTab === 'recent' ? 'Most Recent Testimonies' : 
               activeTab === 'upvotes' ? 'Most Pushed Up Testimonies' : 
               'Most Talked About Testimonies'}
            </h2>
            <div className="flex items-center gap-4">
              {searchTerm && (
                <span className="text-sm text-slate-600">
                  {filteredTestimonies.length} of {testimonies.length} stories
                </span>
              )}
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {searchTerm ? filteredTestimonies.length : testimonies.length} stories
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
              <p className="text-slate-600 text-lg">Loading inspiring stories...</p>
            </div>
          ) : testimonies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">�</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">No testimonies yet</h3>
              <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
                Be the first to share your story and inspire our community!
              </p>
              <Link 
                href="/submit-testimony"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-xl">✍️</span>
                Share Your Story
              </Link>
            </div>
          ) : filteredTestimonies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No stories found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search terms</p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-slate-700 hover:text-slate-900 font-medium underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredTestimonies.map((testimony, index) => (
                <div key={testimony.id} className="group">
                  <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-8 border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                          <span className="text-slate-700 font-bold text-lg">
                            {(testimony.isGuest ? testimony.authorName : (testimony.user?.username || testimony.authorName))[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-slate-900 text-lg">
                              {testimony.isGuest ? testimony.authorName : (testimony.user?.username || testimony.authorName)}
                            </span>
                            {!testimony.isGuest && testimony.user && testimony.user.isVerified && (
                              <span className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <span>✓</span> Verified
                              </span>
                            )}
                            {!testimony.isGuest && testimony.user && testimony.user.isWitness && (
                              <span className="text-purple-600 text-xs bg-purple-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <span>👁️</span> Witness
                              </span>
                            )}
                            {testimony.isGuest && (
                              <span className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded-full font-medium">Guest</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>📅</span>
                            <span>
                              {new Date(testimony.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span>
                              {new Date(testimony.createdAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                          Story #{testimonies.length - index}
                        </span>
                      </div>
                    </div>
                    
                    <div className="prose prose-slate prose-lg max-w-none">
                      <blockquote className="border-l-4 border-slate-300 pl-6 text-slate-700 leading-relaxed whitespace-pre-wrap italic text-lg">
                        &ldquo;{testimony.content}&rdquo;
                      </blockquote>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <span>💝</span>
                          <span>Thank you for sharing</span>
                        </span>
                        
                        {/* Vote Counts */}
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-green-600">
                            <span>⬆️</span>
                            <span className="font-medium">{testimony.upvotes}</span>
                          </span>
                          <span className="flex items-center gap-1 text-red-500">
                            <span>⬇️</span>
                            <span className="font-medium">{testimony.downvotes}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Voting Buttons - Only for registered users */}
                        {user && (
                          <div className="flex items-center gap-1 mr-4">
                            <button
                              onClick={() => handleVote(testimony.id, 'UPVOTE')}
                              disabled={votingLoading === testimony.id}
                              className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                testimony.userVote === 'UPVOTE'
                                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                  : 'bg-white hover:bg-green-50 text-gray-600 hover:text-green-600 border border-gray-300 hover:border-green-300'
                              } ${votingLoading === testimony.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md transform hover:-translate-y-0.5'}`}
                            >
                              {votingLoading === testimony.id ? (
                                <span className="animate-spin">⏳</span>
                              ) : (
                                <span>⬆️ Push Up</span>
                              )}
                            </button>
                            <button
                              onClick={() => handleVote(testimony.id, 'DOWNVOTE')}
                              disabled={votingLoading === testimony.id}
                              className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                testimony.userVote === 'DOWNVOTE'
                                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                  : 'bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300'
                              } ${votingLoading === testimony.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md transform hover:-translate-y-0.5'}`}
                            >
                              {votingLoading === testimony.id ? (
                                <span className="animate-spin">⏳</span>
                              ) : (
                                <span>⬇️ Push Down</span>
                              )}
                            </button>
                          </div>
                        )}
                        
                        {/* Sign in prompt for guests */}
                        {!user && (
                          <div className="text-xs text-slate-500 mr-4">
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
                              Sign in
                            </Link> to vote
                          </div>
                        )}

                        {/* Admin Delete Button */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteTestimony(testimony.id, testimony.isGuest ? testimony.authorName : (testimony.user?.username || testimony.authorName))}
                            disabled={deletingId === testimony.id}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 mr-2 ${
                              deletingId === testimony.id
                                ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 hover:shadow-md transform hover:-translate-y-0.5'
                            }`}
                            title="Delete testimony (Admin only)"
                          >
                            {deletingId === testimony.id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <span>🗑️ Delete</span>
                            )}
                          </button>
                        )}
                        
                        <button className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
                          <span>🔗</span> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Load More Button (future enhancement) */}
              {filteredTestimonies.length >= 10 && (
                <div className="text-center pt-8">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors">
                    Load More Stories
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 mb-12">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-12 shadow-2xl">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-3xl font-bold mb-6">Your Story Matters</h3>
            <p className="text-slate-300 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              Every experience is valuable and has the power to inspire others. Your testimony could be exactly 
              what someone needs to hear today. Join our growing community of voices that make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/submit-testimony"
                className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-2xl">✍️</span>
                Share Your Testimony
              </Link>
              <div className="text-slate-400 text-sm">
                Join {testimonies.length}+ community members
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/70 text-slate-700 px-6 py-3 font-medium hover:bg-white/90 transition backdrop-blur-sm"
            >
              <span>🏠</span>
              Home
            </Link>
            <Link
              href="/witness"
              className="inline-flex items-center gap-2 rounded-xl bg-white/70 text-slate-700 px-6 py-3 font-medium hover:bg-white/90 transition backdrop-blur-sm"
            >
              <span>👁️</span>
              Witness
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-xl bg-white/70 text-slate-700 px-6 py-3 font-medium hover:bg-white/90 transition backdrop-blur-sm"
            >
              <span>💝</span>
              Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
