'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
}

export default function ShareButtons({ url }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'tiktok':
        // TikTok doesn't support direct sharing, so we'll copy the URL
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! You can now share it on TikTok.');
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy the URL
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share it on Instagram.');
        break;
      case 'youtube':
        window.open('https://www.youtube.com/@NDIGBOVIVA', '_blank');
        break;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Share This Post
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => handleShare('facebook')}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Facebook size={20} />
          <span>Share on Facebook</span>
        </button>
        <button
          onClick={() => handleShare('tiktok')}
          className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span>Share on TikTok</span>
        </button>
        <button
          onClick={() => handleShare('instagram')}
          className="w-full flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Instagram size={20} />
          <span>Share on Instagram</span>
        </button>
        <button
          onClick={() => handleShare('youtube')}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Youtube size={20} />
          <span>Visit YouTube</span>
        </button>
      </div>
    </div>
  );
}