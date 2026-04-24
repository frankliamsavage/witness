'use client';
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

type NotificationSettings = {
  inboxNotifications: boolean;
  pushNotifications: boolean;
  postLikes: boolean;
  postComments: boolean;
  postShares: boolean;
  newFollowers: boolean;
  mentions: boolean;
};

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [settings, setSettings] = useState<NotificationSettings>({
    inboxNotifications: true,
    pushNotifications: false,
    postLikes: true,
    postComments: true,
    postShares: true,
    newFollowers: true,
    mentions: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      // If no user after 5 seconds, stop loading
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [user]);

  async function loadSettings() {
    try {
      const response = await fetch('/api/user/notification-settings');
      if (response.ok) {
        const data = await response.json();
        
        if (data.settings && data.userId) {
          // Check localStorage first for this user's saved settings
          const localStorageKey = `notification-settings-${data.userId}`;
          const savedSettings = localStorage.getItem(localStorageKey);
          
          if (savedSettings) {
            try {
              const parsedSettings = JSON.parse(savedSettings);
              setSettings(parsedSettings);
            } catch {
              console.warn('Failed to parse saved settings, using defaults');
              setSettings(data.settings);
            }
          } else {
            // Use default settings if no saved settings found
            setSettings(data.settings);
          }
        } else {
          setSettings(data.settings || {
            inboxNotifications: true,
            pushNotifications: false,
            postLikes: true,
            postComments: true,
            postShares: true,
            newFollowers: true,
            mentions: true,
          });
        }
      } else {
        // Fallback to defaults if API fails
        setSettings({
          inboxNotifications: true,
          pushNotifications: false,
          postLikes: true,
          postComments: true,
          postShares: true,
          newFollowers: true,
          mentions: true,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Always use fallback settings on error
      setSettings({
        inboxNotifications: true,
        pushNotifications: false,
        postLikes: true,
        postComments: true,
        postShares: true,
        newFollowers: true,
        mentions: true,
      });
    } finally {
      setLoading(false); // Ensure loading always stops
    }
  }

  async function saveSettings() {
    setSaving(true);
    setMessage('');

    try {
      // Save to localStorage immediately for instant feedback
      if (user?.id) {
        const localStorageKey = `notification-settings-${user.id}`;
        localStorage.setItem(localStorageKey, JSON.stringify(settings));
      }

      const response = await fetch('/api/user/notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage('✅ Settings saved successfully!');
      } else {
        setMessage('✅ Settings saved locally! (API temporarily unavailable)');
      }
    } catch (error) {
      // Still saved to localStorage, so show success
      setMessage('✅ Settings saved locally!');
      console.error('Failed to save settings to API:', error);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }

  function updateSetting(key: keyof NotificationSettings, value: boolean) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function handleAccountDeletion() {
    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }

    if (deleteStep === 2) {
      if (confirmText.toLowerCase() !== 'delete my account permanently') {
        setMessage('❌ Please type the exact confirmation text.');
        return;
      }
      setDeleteStep(3);
      return;
    }

    if (deleteStep === 3) {
      setDeleting(true);
      try {
        const response = await fetch('/api/user/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Sign out from Clerk with redirect to home page
          await signOut({ redirectUrl: '/' });
        } else {
          const errorData = await response.json();
          setDeleting(false);
          setMessage(`❌ Failed to delete account: ${errorData.error || 'Please contact support.'}`);
        }
      } catch (error) {
        setDeleting(false);
        setMessage('❌ Failed to delete account. Please contact support.');
        console.error('Failed to delete account:', error);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-xl text-slate-900">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-indigo-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Account Settings</h1>
          <p className="text-lg text-slate-700">
            Manage your notifications and preferences
          </p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔔</span>
            <h2 className="text-2xl font-bold text-slate-900">Notification Preferences</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.startsWith('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-8">
            {/* Master Notification Toggle */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">📬 Inbox Notifications</h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div>
                      <p className="font-medium text-slate-900">🔔 Enable Notifications</p>
                      <p className="text-sm text-slate-600">Get notifications in your dashboard inbox (turn off to disable all notifications)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.inboxNotifications}
                        onChange={(e) => updateSetting('inboxNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {settings.inboxNotifications && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Post Interactions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">❤️ Post Likes</p>
                        <p className="text-sm text-slate-600">When someone likes your posts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.postLikes}
                          onChange={(e) => updateSetting('postLikes', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">💬 Comments</p>
                        <p className="text-sm text-slate-600">When someone comments on your posts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.postComments}
                          onChange={(e) => updateSetting('postComments', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">🔄 Shares</p>
                        <p className="text-sm text-slate-600">When someone shares your posts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.postShares}
                          onChange={(e) => updateSetting('postShares', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">👥 New Followers</p>
                        <p className="text-sm text-slate-600">When someone follows you</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.newFollowers}
                          onChange={(e) => updateSetting('newFollowers', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">@️ Mentions</p>
                        <p className="text-sm text-slate-600">When someone mentions you</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.mentions}
                          onChange={(e) => updateSetting('mentions', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
            >
              {saving ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving Settings...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>💾</span>
                  <span>Save Notification Settings</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">👤</span>
            <h2 className="text-2xl font-bold text-slate-900">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">Email</p>
              <p className="text-slate-600">{user?.primaryEmailAddress?.emailAddress || 'Not available'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">Username</p>
              <p className="text-slate-600">{user?.username || 'Not set'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">Member Since</p>
              <p className="text-slate-600">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone - Account Deletion */}
        <div className="bg-red-50 rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-2xl font-bold text-red-900">Danger Zone</h2>
          </div>

          {!showDeleteConfirm ? (
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
              <p className="text-red-700 mb-6">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-900 mb-2">What will be deleted:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Your profile and all personal information</li>
                  <li>• All posts, videos, and testimonies</li>
                  <li>• Comments and interactions</li>
                  <li>• Friend connections and messages</li>
                  <li>• Notification preferences and settings</li>
                  <li>• All uploaded media files</li>
                </ul>
              </div>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                🗑️ Delete My Account
              </button>
            </div>
          ) : (
            <div>
              {deleteStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Are you absolutely sure?</h3>
                  <p className="text-red-700 mb-6">
                    This will permanently delete your account and all your data. You will not be able to recover your account, posts, or any other information.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleAccountDeletion}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Yes, I want to delete my account
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {deleteStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">🔐 Final Confirmation</h3>
                  <p className="text-red-700 mb-4">
                    To confirm account deletion, please type the following text exactly:
                  </p>
                  <div className="bg-red-100 border border-red-300 rounded p-3 mb-4 font-mono text-red-900">
                    delete my account permanently
                  </div>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type the confirmation text here"
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleAccountDeletion}
                      disabled={confirmText.toLowerCase() !== 'delete my account permanently'}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Permanently Delete Account
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteStep(1);
                        setConfirmText('');
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {deleteStep === 3 && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">🔄 Deleting Account...</h3>
                  {deleting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                      <span className="text-red-700">Permanently deleting your account and all data...</span>
                    </div>
                  ) : (
                    <p className="text-red-700">Account deletion in progress...</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
