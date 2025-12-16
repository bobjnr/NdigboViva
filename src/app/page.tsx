// import { Suspense } from 'react';
import HomeContent from "@/components/HomeContent";
import { getHomeData } from "@/components/HomeData";

interface HomeProps {
  searchParams: Promise<{ welcome?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const showWelcome = params.welcome === 'true';

  try {
    const homeData = await getHomeData();

    return (
      <HomeContent
        latestVideo={homeData.latestVideo}
        recentPosts={homeData.recentPosts}
        showWelcome={showWelcome}
      />
    );
  } catch (_error) {

    // Fallback data if API fails
    const fallbackData = {
      latestVideo: {
        id: 'fallback',
        title: 'Welcome to Ndigbo Viva',
        description: 'Join our community for insights and stories',
        thumbnail: '/Ndigbo Viva Logo.jpg',
        publishedAt: new Date().toISOString(),
        duration: '0:00',
        videoId: 'fallback'
      },
      recentPosts: []
    };

    return (
      <HomeContent
        latestVideo={fallbackData.latestVideo}
        recentPosts={fallbackData.recentPosts}
        showWelcome={showWelcome}
      />
    );
  }
}
