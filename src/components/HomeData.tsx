import { getLatestVideos } from "@/lib/youtube";
import { generateHomeExcerpt } from "@/lib/video-summaries";

// Fallback data in case YouTube API fails
const fallbackVideo = {
  id: "Lwlc1ObAAxo",
  title: "Welcome to Ndigbo Viva - Know Your Roots",
  description: "Join us as we explore the rich culture and heritage of the Igbo people, building solidarity and investing in our future together.",
  thumbnail: "https://i.ytimg.com/vi/Lwlc1ObAAxo/maxresdefault.jpg",
  videoId: "Lwlc1ObAAxo",
  publishedAt: "2024-01-15T10:00:00Z",
  duration: "15:30"
};

const fallbackPosts = [
  {
    id: "Lwlc1ObAAxo",
    title: "The Power of Igbo Culture in Modern Times",
    excerpt: "Exploring how traditional Igbo values can guide us in contemporary society and help build stronger communities.",
    thumbnail: "https://i.ytimg.com/vi/Lwlc1ObAAxo/maxresdefault.jpg",
    publishedAt: "2024-01-10T10:00:00Z",
    slug: "power-of-igbo-culture"
  },
  {
    id: "T9S_wBcDuWg", 
    title: "Building Economic Solidarity in the Diaspora",
    excerpt: "How Igbo communities worldwide are coming together to create economic opportunities and support each other's growth.",
    thumbnail: "https://i.ytimg.com/vi/T9S_wBcDuWg/maxresdefault.jpg",
    publishedAt: "2024-01-05T10:00:00Z",
    slug: "building-economic-solidarity"
  },
  {
    id: "hgS4TIEQTHQ",
    title: "Investing in Our Homeland: Success Stories",
    excerpt: "Real stories of Igbo people who have successfully invested back home and the impact it's making in our communities.",
    thumbnail: "https://i.ytimg.com/vi/hgS4TIEQTHQ/maxresdefault.jpg",
    publishedAt: "2023-12-28T10:00:00Z",
    slug: "investing-in-our-homeland"
  }
];

export async function getHomeData() {
  // Fetch latest videos from YouTube API with better error handling
  let videos: Array<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    slug: string;
    duration: string;
    viewCount: string;
    videoId: string;
    category?: string;
  }> = [];
  let apiError = false;
  
  try {
    console.log('Attempting to fetch YouTube videos...');
    videos = await getLatestVideos(4);
    console.log(`Successfully fetched ${videos.length} videos from YouTube`);
    
    if (videos.length > 0) {
      console.log('Latest video details:', {
        title: videos[0].title,
        publishedAt: videos[0].publishedAt,
        videoId: videos[0].videoId
      });
    }
  } catch (error) {
    console.warn('Failed to fetch YouTube videos, using fallback data:', error);
    console.warn('Error details:', error);
    apiError = true;
  }

  // Always ensure we have data, even if API fails
  const latestVideo = (videos && videos.length > 0) ? videos[0] : fallbackVideo;
  const recentPosts = (videos && videos.length > 1) ? videos.slice(1, 4).map(video => ({
    id: video.id,
    title: video.title,
    excerpt: video.description ? generateHomeExcerpt(video.title, video.description, video.category, video.duration) : "No description available",
    thumbnail: video.thumbnail,
    publishedAt: video.publishedAt,
    slug: video.slug
  })) : fallbackPosts;

  return { 
    latestVideo, 
    recentPosts, 
    usingFallback: apiError || videos.length === 0
  };
}
