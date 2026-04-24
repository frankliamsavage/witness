'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface User {
  id: string;
  username: string;
  profilePicture?: string;
  isVerified: boolean;
}

interface Friend extends User {
  friendshipId: string;
}

interface FriendRequest {
  id: string;
  user: User;
}

interface FriendsData {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
}

export default function FriendsPage() {
  const { userId } = useAuth();
  const [friendsData, setFriendsData] = useState<FriendsData>({
    friends: [],
    pendingRequests: [],
    sentRequests: []
  });
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriendsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!searchUsername.trim()) return;
    
    setActionLoading('send');
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUsername: searchUsername.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setSearchUsername('');
        fetchFriends();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setMessage({ text: 'Failed to send friend request', type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/friends/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        fetchFriends();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setMessage({ text: 'Failed to process request', type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const removeFriend = async (friendshipId: string) => {
    setActionLoading(friendshipId);
    try {
      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        fetchFriends();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch {
      setMessage({ text: 'Failed to remove friend', type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading friends...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Friends</h1>
          <p className="text-gray-600">Connect with other members of the Witness community</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-center ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Send Friend Request */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Send Friend Request</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && sendFriendRequest()}
            />
            <button
              onClick={sendFriendRequest}
              disabled={!searchUsername.trim() || actionLoading === 'send'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'send' ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>

        {/* Pending Requests */}
        {friendsData.pendingRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Friend Requests ({friendsData.pendingRequests.length})</h2>
            <div className="space-y-3">
              {friendsData.pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {request.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{request.user.username}</div>
                      {request.user.isVerified && (
                        <div className="text-xs text-blue-600">✓ Verified</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFriendRequest(request.id, 'accept')}
                      disabled={actionLoading === request.id}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === request.id ? '...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleFriendRequest(request.id, 'reject')}
                      disabled={actionLoading === request.id}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === request.id ? '...' : 'Decline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Requests */}
        {friendsData.sentRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sent Requests ({friendsData.sentRequests.length})</h2>
            <div className="space-y-3">
              {friendsData.sentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {request.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{request.user.username}</div>
                      <div className="text-xs text-gray-500">Request pending</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(request.id)}
                    disabled={actionLoading === request.id}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                    {actionLoading === request.id ? '...' : 'Cancel'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Friends ({friendsData.friends.length})</h2>
          {friendsData.friends.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No friends yet. Send some friend requests to get started!</p>
          ) : (
            <div className="grid gap-3">
              {friendsData.friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {friend.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{friend.username}</div>
                      {friend.isVerified && (
                        <div className="text-xs text-blue-600">✓ Verified</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(friend.friendshipId)}
                    disabled={actionLoading === friend.friendshipId}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading === friend.friendshipId ? '...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}