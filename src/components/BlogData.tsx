import { getLatestVideos } from "@/lib/youtube";
import { generateBlogExcerpt } from "@/lib/video-summaries";

// Fallback data in case YouTube API fails
const fallbackPosts = [
  {
    id: "Lwlc1ObAAxo",
    title: "The Power of Igbo Culture in Modern Times",
    excerpt: "Exploring how traditional Igbo values can guide us in contemporary society and help build stronger communities.",
    thumbnail: "https://i.ytimg.com/vi/Lwlc1ObAAxo/maxresdefault.jpg",
    publishedAt: "2024-01-10T10:00:00Z",
    slug: "power-of-igbo-culture",
    duration: "12:45",
    views: "1.2K",
    category: "Culture"
  },
  {
    id: "T9S_wBcDuWg", 
    title: "Building Economic Solidarity in the Diaspora",
    excerpt: "How Igbo communities worldwide are coming together to create economic opportunities and support each other's growth.",
    thumbnail: "https://i.ytimg.com/vi/T9S_wBcDuWg/maxresdefault.jpg",
    publishedAt: "2024-01-05T10:00:00Z",
    slug: "building-economic-solidarity",
    duration: "18:30",
    views: "2.1K",
    category: "Economics"
  },
  {
    id: "hgS4TIEQTHQ",
    title: "Investing in Our Homeland: Success Stories",
    excerpt: "Real stories of Igbo people who have successfully invested back home and the impact it's making in our communities.",
    thumbnail: "https://i.ytimg.com/vi/hgS4TIEQTHQ/maxresdefault.jpg",
    publishedAt: "2023-12-28T10:00:00Z",
    slug: "investing-in-our-homeland",
    duration: "22:15",
    views: "3.5K",
    category: "Investment"
  },
  {
    id: "4FjWKrkim6E",
    title: "Preserving Igbo Language for Future Generations",
    excerpt: "The importance of keeping our language alive and strategies for teaching Igbo to children in the diaspora.",
    thumbnail: "https://i.ytimg.com/vi/4FjWKrkim6E/maxresdefault.jpg",
    publishedAt: "2023-12-20T10:00:00Z",
    slug: "preserving-igbo-language",
    duration: "15:20",
    views: "1.8K",
    category: "Education"
  },
  {
    id: "UzkAyJTy38U",
    title: "Igbo Traditional Leadership in Modern Governance",
    excerpt: "How traditional Igbo leadership principles can inform modern governance and community organization.",
    thumbnail: "https://i.ytimg.com/vi/UzkAyJTy38U/maxresdefault.jpg",
    publishedAt: "2023-12-15T10:00:00Z",
    slug: "igbo-traditional-leadership",
    duration: "25:10",
    views: "2.7K",
    category: "Leadership"
  },
  {
    id: "CxZ_Ru0oQmI",
    title: "The Role of Women in Igbo Society",
    excerpt: "Celebrating the strength and contributions of Igbo women throughout history and in contemporary times.",
    thumbnail: "https://i.ytimg.com/vi/CxZ_Ru0oQmI/maxresdefault.jpg",
    publishedAt: "2023-12-10T10:00:00Z",
    slug: "role-of-women-in-igbo-society",
    duration: "20:45",
    views: "4.2K",
    category: "Society"
  }
];

export async function getBlogData() {
  // Fetch latest videos from YouTube API
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
  try {
    videos = await getLatestVideos(12);
  } catch (_error) {
    videos = [];
  }

  const blogPosts = videos.length > 0 ? videos.map(video => ({
    id: video.id,
    title: video.title,
    excerpt: generateBlogExcerpt(video.title, video.description, video.category, video.duration),
    thumbnail: video.thumbnail,
    publishedAt: video.publishedAt,
    slug: video.slug,
    duration: video.duration,
    views: video.viewCount,
    category: video.category || "General"
  })) : fallbackPosts;

  return { blogPosts };
}

