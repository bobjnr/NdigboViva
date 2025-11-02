// YouTube Data API v3 integration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UC_NDIGBOVIVA_CHANNEL_ID'; // Replace with actual channel ID

// Fetch with timeout and retry logic
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 10000): Promise<Response> {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided to fetch');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-store' // Ensure fresh data
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      if (error.message.includes('fetch')) {
        throw new Error(`Failed to fetch: ${error.message}`);
      }
    }
    throw error;
  }
}

// Retry wrapper for API calls
async function retryAPICall<T>(fn: () => Promise<T>, maxRetries: number = 2): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError!;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  videoId: string;
  slug: string;
  category?: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
}

// Get channel information
export async function getChannelInfo(): Promise<YouTubeChannel | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    return await retryAPICall(async () => {
      const response = await fetchWithTimeout(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
      );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
      if (data.items && data.items.length > 0) {
        const channel = data.items[0];
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails.high.url,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
        };
      }

      return null;
    });
  } catch (error) {
    console.error('Error fetching channel info:', error);
    return null;
  }
}

// Get latest videos from the channel
export async function getLatestVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured - set YOUTUBE_API_KEY environment variable');
    return [];
  }

  if (!YOUTUBE_CHANNEL_ID || YOUTUBE_CHANNEL_ID === 'UC_NDIGBOVIVA_CHANNEL_ID') {
    console.warn('YouTube Channel ID not configured - set YOUTUBE_CHANNEL_ID environment variable');
    return [];
  }

  try {
    return await retryAPICall(async () => {
      // First, get the uploads playlist ID
      const channelResponse = await fetchWithTimeout(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
      );

    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.status}`);
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return [];
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Get videos from the uploads playlist (ordered by newest first)
      const videosResponse = await fetchWithTimeout(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&order=date&key=${YOUTUBE_API_KEY}`
      );

      if (!videosResponse.ok) {
        if (videosResponse.status === 404) {
          console.warn('No videos found in channel (empty playlist)');
          return [];
        }
        throw new Error(`YouTube API error: ${videosResponse.status}`);
      }

      const videosData = await videosResponse.json();
      
      if (!videosData.items) {
        return [];
      }

      // Get additional video details (duration, view count)
      const videoIds = videosData.items.map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId).join(',');
      
      const detailsResponse = await fetchWithTimeout(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }

    const detailsData = await detailsResponse.json();
    const videoDetails = detailsData.items || [];

      // Combine the data
      return videosData.items.map((item: { snippet: { title: string; description: string; publishedAt: string; resourceId: { videoId: string }; thumbnails: { maxres?: { url: string }; high: { url: string } } } }, index: number) => {
        const details = videoDetails[index] || {};
        const videoId = item.snippet.resourceId.videoId;
        
        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
          duration: formatDuration(details.contentDetails?.duration || 'PT0S'),
          viewCount: formatViewCount(details.statistics?.viewCount || '0'),
          videoId: videoId,
          slug: createSlug(item.snippet.title),
          category: extractCategory(item.snippet.title, item.snippet.description),
        };
      });
    });
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

// Get a specific video by ID
export async function getVideoById(videoId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    return await retryAPICall(async () => {
      const response = await fetchWithTimeout(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          publishedAt: video.snippet.publishedAt,
          duration: formatDuration(video.contentDetails.duration),
          viewCount: formatViewCount(video.statistics.viewCount),
          videoId: video.id,
          slug: createSlug(video.snippet.title),
          category: extractCategory(video.snippet.title, video.snippet.description),
        };
      }

      return null;
    });
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
}

// Helper function to format duration (PT4M13S -> 4:13)
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to format view count
function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Helper function to create URL-friendly slug
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to extract category from title/description
function extractCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('culture') || text.includes('tradition')) return 'Culture';
  if (text.includes('econom') || text.includes('business') || text.includes('money')) return 'Economics';
  if (text.includes('invest') || text.includes('investment')) return 'Investment';
  if (text.includes('educat') || text.includes('learn') || text.includes('school')) return 'Education';
  if (text.includes('leader') || text.includes('governance')) return 'Leadership';
  if (text.includes('women') || text.includes('society') || text.includes('community')) return 'Society';
  
  return 'General';
}

// Search videos by query
export async function searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    // Get additional video details
    const videoIds = data.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');
    
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }

    const detailsData = await detailsResponse.json();
    const videoDetails = detailsData.items || [];

    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; description: string; publishedAt: string; thumbnails: { maxres?: { url: string }; high: { url: string } } } }, index: number) => {
      const details = videoDetails[index] || {};
      const videoId = item.id.videoId;
      
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        duration: formatDuration(details.contentDetails?.duration || 'PT0S'),
        viewCount: formatViewCount(details.statistics?.viewCount || '0'),
        videoId: videoId,
        slug: createSlug(item.snippet.title),
        category: extractCategory(item.snippet.title, item.snippet.description),
      };
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}
