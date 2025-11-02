'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Clock, 
  Star, 
  BookOpen, 
  Headphones, 
  ArrowLeft,
  Share2,
  Download,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Audiobook, AudiobookChapter } from '@/types/audiobooks';
import { audiobooks } from '@/lib/audiobooks-data';
import AudioPlayer from '@/components/AudioPlayer';

export default function AudiobookDetailPage() {
  const params = useParams();
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
  const [currentChapter, setCurrentChapter] = useState<AudiobookChapter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  // Update duration when chapter changes
  useEffect(() => {
    if (currentChapter) {
      setDuration(currentChapter.duration);
      setCurrentTime(0);
    }
  }, [currentChapter]);

  useEffect(() => {
    const foundAudiobook = audiobooks.find(ab => ab.id === params.id);
    if (foundAudiobook) {
      setAudiobook(foundAudiobook);
      setCurrentChapter(foundAudiobook.chapters[0]);
    }
  }, [params.id]);

  const handleChapterChange = (chapterId: string) => {
    if (audiobook) {
      const chapter = audiobook.chapters.find(ch => ch.id === chapterId);
      if (chapter) {
        setCurrentChapter(chapter);
        setCurrentTime(0);
        setIsPlaying(false); // Stop current playback
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressUpdate = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!audiobook || !currentChapter) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audiobook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/audiobooks"
              className="flex items-center text-brand-gold hover:text-brand-gold-light transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Audiobooks
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gray-200 rounded-lg flex-shrink-0 mb-6 lg:mb-0">
              <Image
                src={audiobook.coverImage}
                alt={audiobook.title}
                width={256}
                height={256}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  audiobook.isFree 
                    ? 'bg-green-500 text-white' 
                    : 'bg-brand-gold text-white'
                }`}>
                  {audiobook.isFree ? 'Free' : 'Premium'}
                </span>
                <span className="bg-brand-forest text-white px-3 py-1 rounded-full text-sm font-medium">
                  {audiobook.category}
                </span>
                <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {audiobook.difficulty}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {audiobook.title}
              </h1>
              
              <p className="text-xl text-brand-gold mb-4">
                by {audiobook.author}
              </p>

              <p className="text-lg text-gray-300 mb-6 max-w-3xl">
                {audiobook.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDuration(audiobook.duration)}
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {audiobook.chapters.length} chapters
                </div>
                <div className="flex items-center">
                  {renderStars(audiobook.rating)}
                  <span className="ml-2">({audiobook.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center">
                  <Headphones className="w-4 h-4 mr-2" />
                  {audiobook.language}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AudioPlayer
          audiobook={audiobook}
          currentChapter={currentChapter}
          onChapterChange={handleChapterChange}
          onProgressUpdate={handleProgressUpdate}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isBookmarked={isBookmarked}
          onBookmarkToggle={handleBookmarkToggle}
          playbackSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />
      </div>

      {/* Chapters List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h3>
          <div className="space-y-4">
            {audiobook.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  chapter.id === currentChapter.id
                    ? 'border-brand-gold bg-brand-gold/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleChapterChange(chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      chapter.id === currentChapter.id
                        ? 'bg-brand-gold text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{chapter.title}</h4>
                      <p className="text-sm text-gray-600">
                        {formatTime(chapter.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {chapter.id === currentChapter.id && (
                      <span className="text-brand-gold font-medium">Now Playing</span>
                    )}
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiobook.relatedArticles && audiobook.relatedArticles.map(articleId => {
              // This would typically fetch from your articles data
              return (
                <div key={articleId} className="bg-white rounded-lg shadow-sm p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Related Article {articleId}</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Discover more insights related to this audiobook topic.
                  </p>
                  <Link
                    href={`/articles/${articleId}`}
                    className="text-brand-gold hover:text-brand-gold-dark font-medium text-sm"
                  >
                    Read Article →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h3>
          <div className="space-y-6">
            {/* Sample Review */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Anonymous User</h4>
                    <div className="flex items-center">
                      {renderStars(5)}
                      <span className="ml-2 text-sm text-gray-600">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "This audiobook provides excellent insights into Igbo culture. The narration is clear and engaging, 
                and the content is well-structured. Highly recommended for anyone interested in learning about 
                traditional Igbo wisdom."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
