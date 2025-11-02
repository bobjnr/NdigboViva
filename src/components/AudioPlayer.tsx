'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Bookmark, BookmarkCheck, Clock, Download } from 'lucide-react';
import { Audiobook, AudiobookChapter } from '@/types/audiobooks';

interface AudioPlayerProps {
  audiobook: Audiobook;
  currentChapter: AudiobookChapter;
  onChapterChange: (chapterId: string) => void;
  onProgressUpdate: (progress: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export default function AudioPlayer({
  audiobook,
  currentChapter,
  onChapterChange,
  onProgressUpdate,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  isBookmarked,
  onBookmarkToggle,
  playbackSpeed,
  onSpeedChange
}: AudioPlayerProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio functionality
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentChapter.audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [currentChapter.audioUrl, volume, isMuted, playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      onProgressUpdate(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      // Duration is already set from props, but we can update it if needed
    };

    const handleEnded = () => {
      // Auto-play next chapter or stop
      const currentIndex = audiobook.chapters.findIndex(ch => ch.id === currentChapter.id);
      if (currentIndex < audiobook.chapters.length - 1) {
        onChapterChange(audiobook.chapters[currentIndex + 1].id);
      } else {
        onPlayPause(); // Stop playing
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentChapter.id, audiobook.chapters, onProgressUpdate, onPlayPause, onChapterChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onProgressUpdate(newTime);
  };

  const goToPreviousChapter = () => {
    const currentIndex = audiobook.chapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentIndex > 0) {
      onChapterChange(audiobook.chapters[currentIndex - 1].id);
    }
  };

  const goToNextChapter = () => {
    const currentIndex = audiobook.chapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentIndex < audiobook.chapters.length - 1) {
      onChapterChange(audiobook.chapters[currentIndex + 1].id);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    onVolumeChange(isMuted ? 0.5 : 0);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onError={(e) => console.error('Audio error:', e)}
      />
      {/* Audiobook Info */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
          <img 
            src={audiobook.coverImage} 
            alt={audiobook.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {audiobook.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            by {audiobook.author}
          </p>
          <p className="text-sm text-gray-500">
            Chapter {audiobook.chapters.findIndex(ch => ch.id === currentChapter.id) + 1} of {audiobook.chapters.length}
          </p>
        </div>
        <button
          onClick={onBookmarkToggle}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked 
              ? 'bg-brand-gold text-white' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Chapter Title */}
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          {currentChapter.title}
        </h4>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(currentChapter.duration)}
          </span>
          <span>•</span>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          ref={progressRef}
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer hover:h-3 transition-all"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-brand-gold rounded-full transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousChapter}
            disabled={audiobook.chapters.findIndex(ch => ch.id === currentChapter.id) === 0}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="p-3 rounded-full bg-brand-gold hover:bg-brand-gold-dark text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={goToNextChapter}
            disabled={audiobook.chapters.findIndex(ch => ch.id === currentChapter.id) === audiobook.chapters.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleMute} className="p-1">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {speedOptions.map(speed => (
                <option key={speed} value={speed}>
                  {speed}x
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {audiobook.chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => onChapterChange(chapter.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                chapter.id === currentChapter.id
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {index + 1}. {chapter.title}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript Toggle */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center space-x-2 text-brand-gold hover:text-brand-gold-dark transition-colors"
        >
          <span className="font-medium">
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </span>
        </button>
        
        {showTranscript && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {currentChapter.transcript}
            </p>
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="mt-4 flex justify-end">
        <button className="flex items-center space-x-2 text-brand-gold hover:text-brand-gold-dark transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm">Download Chapter</span>
        </button>
      </div>
    </div>
  );
}
