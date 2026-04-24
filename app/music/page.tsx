'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  description: string;
  audioFile: string;
  coverImage: string | null;
  playCount: number;
  likes: number;
  price: number;
  downloads: number;
  user: {
    id: string;
    username: string;
    profilePicture: string | null;
  };
}

const GENRES = [
  'all',
  'rock',
  'pop',
  'hip-hop',
  'r&b',
  'jazz',
  'classical',
  'electronic',
  'country',
  'gospel',
];

export default function MusicLibrary() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
  }, [selectedGenre, searchTerm]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedGenre !== 'all') params.append('genre', selectedGenre);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/music/library?${params}`);
      if (!response.ok) throw new Error('Failed to fetch songs');
      const data = await response.json();
      setSongs(data.songs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🎵 Music Library</h1>
          <p className="text-slate-300 mb-6">
            Discover music from our community members
          </p>

          {/* Search and Navigation */}
          <div className="flex gap-4 mb-6 flex-col sm:flex-row justify-between items-start sm:items-center">
            <Link
              href="/music-department"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Your Music
            </Link>
            <input
              type="text"
              placeholder="Search songs, artists..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition max-w-md"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-slate-300 mt-4">Loading music...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <p className="text-slate-300 text-lg">
              {searchTerm || selectedGenre !== 'all'
                ? 'No songs found'
                : 'No approved music yet'}
            </p>
            {!searchTerm && selectedGenre === 'all' && (
              <Link
                href="/music-department"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Be the first to submit!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map(song => (
              <div
                key={song.id}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition hover:shadow-lg"
              >
                {/* Cover Image */}
                <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                  {song.coverImage ? (
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎵
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate">{song.title}</h3>
                  <p className="text-slate-400 text-sm truncate">{song.artist}</p>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">
                    {song.genre}
                  </p>

                  {song.description && (
                    <p className="text-slate-300 text-sm mt-3 line-clamp-2">
                      {song.description}
                    </p>
                  )}

                  {/* Artist Info */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                    {song.user.profilePicture && (
                      <img
                        src={song.user.profilePicture}
                        alt={song.user.username || 'Artist'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-slate-300 text-sm truncate">
                      {song.user.username || 'Anonymous'}
                    </span>
                  </div>

                  {/* Player */}
                  <div className="mt-4">
                    <audio
                      controls
                      className="w-full h-8"
                      onPlay={() => setNowPlaying(song.id)}
                      onPause={() => setNowPlaying(null)}
                    >
                      <source src={song.audioFile} type="audio/mpeg" />
                      Your browser does not support audio.
                    </audio>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-slate-400 mt-3">
                    <span>▶️ {song.playCount} plays</span>
                    <span>❤️ {song.likes} likes</span>
                    <span>📥 {song.downloads} downloads</span>
                  </div>

                  {/* Download Button */}
                  <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                    Download ${song.price.toFixed(2)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
