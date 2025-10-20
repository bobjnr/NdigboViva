'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoHoverProps {
  videoId: string;
  thumbnail: string;
  title: string;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  enableAudio?: boolean;
}

export default function VideoHover({ 
  videoId, 
  thumbnail, 
  title, 
  className = "",
  showControls = true,
  autoPlay = false,
  enableAudio = false
}: VideoHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(!enableAudio);
  const [isMounted, setIsMounted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prevent hydration issues by only running effects after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (isHovered) {
      // Small delay to prevent rapid toggling
      const timer = setTimeout(() => {
        setShowVideo(true);
        setIsPlaying(autoPlay);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowVideo(false);
      setIsPlaying(false);
      setVideoLoaded(false);
    }
  }, [isHovered, isMounted, autoPlay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  // Always render the same structure to prevent hydration issues
  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video bg-gray-200  overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        
        {/* Play Button Overlay - only shows when not hovering */}
        {!isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent flex items-center justify-center z-10">
            <button
              onClick={handlePlayPause}
              className="bg-red-600/90 backdrop-blur-sm hover:bg-red-700 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <Play size={24} />
            </button>
          </div>
        )}

        {/* Video Overlay - only shows on hover */}
        {showVideo && isMounted && (
          <div className="absolute inset-0 z-20">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=${showControls ? 1 : 0}&modestbranding=1&rel=0&loop=1&playlist=${videoId}&enablejsapi=1`}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onLoad={handleVideoLoad}
            />
            
            {/* Video Controls Overlay */}
            {enableAudio && videoLoaded && (
              <div className="absolute bottom-4 right-4 z-30 flex gap-2">
                <button
                  onClick={handlePlayPause}
                  className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-all"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator - shows when hovering but video not loaded yet */}
        {isHovered && showVideo && !videoLoaded && isMounted && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-25">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
              Loading video...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
