'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string | null;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender: {
    username: string | null;
    profilePicture: string | null;
  };
  receiver: {
    username: string | null;
    profilePicture: string | null;
  };
};

export default function InboxPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadMessages() {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
    setLoading(false);
  }

  async function markAsRead(messageId: string) {
    try {
      await fetch(`/api/messages/${messageId}/read`, { method: 'POST' });
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead && message.receiverId === user?.id) {
      markAsRead(message.id);
    }
  };

  if (!user) {
    return <div>Please sign in to access your inbox.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
              <span>📧</span>
              Inbox
            </h1>
            <Link
              href="/dashboard/inbox/compose"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ✏️ Compose
            </Link>
          </div>
          <p className="text-slate-600 mt-2">Send and receive private messages with other users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 rounded-xl shadow-lg">
              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'received'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📥 Received
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'sent'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📤 Sent
                </button>
              </div>

              {/* Messages */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-slate-600 mt-2">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">📪</div>
                    <p className="text-slate-600">No messages found</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !message.isRead && activeTab === 'received' ? 'bg-blue-50' : ''
                      } ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                          <span className="text-slate-700 font-bold text-sm">
                            {(activeTab === 'received' 
                              ? message.sender.username 
                              : message.receiver.username
                            )?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${
                              !message.isRead && activeTab === 'received' ? 'text-blue-900' : 'text-slate-900'
                            }`}>
                              {activeTab === 'received' 
                                ? message.sender.username || 'Unknown User'
                                : message.receiver.username || 'Unknown User'}
                            </span>
                            {!message.isRead && activeTab === 'received' && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mb-1">
                            {message.subject || 'No subject'}
                          </p>
                          <p className="text-sm text-slate-600 truncate">
                            {message.content}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 rounded-xl shadow-lg p-6">
              {selectedMessage ? (
                <div>
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {selectedMessage.subject || 'No subject'}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/inbox/compose?to=${
                            activeTab === 'received' 
                              ? selectedMessage.sender.username 
                              : selectedMessage.receiver.username
                          }&subject=Re: ${selectedMessage.subject || 'No subject'}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          ↩️ Reply
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>From:</span>
                      <span className="font-medium">
                        {selectedMessage.sender.username || 'Unknown User'}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a message</h3>
                  <p className="text-slate-600">Choose a message from the list to read it</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}