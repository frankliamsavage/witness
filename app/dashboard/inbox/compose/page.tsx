'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type User = {
  id: string;
  username: string;
  profilePicture?: string;
  isVerified: boolean;
  legalName?: string;
  currentCity?: string;
  currentState?: string;
  bio?: string;
};

export default function ComposePage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUsers();
      // Handle URL parameters for replies
      const toUser = searchParams.get('to');
      const replySubject = searchParams.get('subject');
      
      if (toUser) {
        setSearchTerm(toUser);
      }
      if (replySubject) {
        setSubject(replySubject);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, searchParams]);

  async function loadUsers() {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        
        // Auto-select user if specified in URL params
        const toUser = searchParams.get('to');
        if (toUser) {
          const foundUser = data.users.find((u: User) => u.username === toUser);
          if (foundUser) {
            setSelectedUser(foundUser);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  }

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.legalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function sendMessage() {
    if (!selectedUser || !content.trim()) {
      alert('Please select a recipient and enter a message.');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverUsername: selectedUser.username,
          subject: subject.trim() || null,
          content: content.trim()
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
        router.push('/dashboard/inbox');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
    setSending(false);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to compose messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard/inbox"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>←</span>
              Back to Inbox
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
              <span>✍️</span>
              Compose Message
            </h1>
          </div>
          <p className="text-slate-600">Send a private message to another user on the platform</p>
        </div>

        {/* Compose Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          {/* Recipient Selection */}
          <div className="p-6 border-b border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To: Select Recipient
            </label>
            
            {selectedUser ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    {selectedUser.profilePicture ? (
                      <Image 
                        src={selectedUser.profilePicture} 
                        alt={selectedUser.username}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {selectedUser.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {selectedUser.username}
                      </span>
                      {selectedUser.isVerified && (
                        <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded-full font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    {selectedUser.legalName && (
                      <p className="text-sm text-slate-600">{selectedUser.legalName}</p>
                    )}
                    {selectedUser.currentCity && selectedUser.currentState && (
                      <p className="text-xs text-slate-500">
                        📍 {selectedUser.currentCity}, {selectedUser.currentState}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
            <input
              type="text"
              placeholder="Search users to message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowUserList(true);
              }}
              onFocus={() => setShowUserList(true)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
            />                {showUserList && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10 mt-1">
                    {loading ? (
                      <div className="p-4 text-center text-slate-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        Loading users...
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">
                        {searchTerm ? 'No users found matching your search' : 'No users available'}
                      </div>
                    ) : (
                      filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setSelectedUser(u);
                            setShowUserList(false);
                            setSearchTerm('');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                              {u.profilePicture ? (
                                <Image 
                                  src={u.profilePicture} 
                                  alt={u.username}
                                  width={32}
                                  height={32}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-bold text-xs">
                                  {u.username[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900">
                                  {u.username}
                                </span>
                                {u.isVerified && (
                                  <span className="text-blue-600 text-xs">✓</span>
                                )}
                              </div>
                              {u.legalName && (
                                <p className="text-sm text-slate-600">{u.legalName}</p>
                              )}
                              {u.currentCity && u.currentState && (
                                <p className="text-xs text-slate-500">
                                  📍 {u.currentCity}, {u.currentState}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
            {showUserList && (
              <div 
                className="fixed inset-0 z-5" 
                onClick={() => setShowUserList(false)}
              ></div>
            )}
          </div>

          {/* Subject */}
          <div className="p-6 border-b border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter message subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
              maxLength={100}
            />
          </div>

          {/* Message Content */}
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message *
            </label>
            <textarea
              placeholder="Type your message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-400"
              maxLength={5000}
            />
            <div className="mt-2 text-sm text-slate-500 text-right">
              {content.length}/5000 characters
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50/80 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {!selectedUser && (
                  <span className="text-red-600">⚠️ Please select a recipient</span>
                )}
                {selectedUser && !content.trim() && (
                  <span className="text-red-600">⚠️ Please enter a message</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/inbox"
                  className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </Link>
                <button
                  onClick={sendMessage}
                  disabled={!selectedUser || !content.trim() || sending}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Count Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            💬 Connect with {users.length} users on the platform
          </p>
        </div>
      </div>
    </div>
  );
}