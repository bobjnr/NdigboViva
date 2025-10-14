import { NextRequest, NextResponse } from 'next/server';
import { rssFeedService } from '@/lib/rss-feeds';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'All';
    const limit = parseInt(searchParams.get('limit') || '20');
    const refresh = searchParams.get('refresh') === 'true';

    // Fetch news from RSS feeds
    const newsItems = await rssFeedService.getCachedNews();

    // Filter by category if specified
    const filteredNews = category === 'All' 
      ? newsItems 
      : newsItems.filter(item => item.category === category);

    // Limit results
    const limitedNews = filteredNews.slice(0, limit);

    // Add comprehensive fallback content if no RSS news is available
    const fallbackNews = [
      {
        id: 'fallback_1',
        title: 'Igbo Community Leaders Meet to Discuss Development Initiatives',
        excerpt: 'Community leaders from various Igbo organizations gathered to discuss strategies for promoting economic development and cultural preservation.',
        content: 'Full content would be here...',
        author: 'Ndigbo Viva Editorial',
        publishedAt: new Date().toISOString(),
        readTime: '5 min read',
        category: 'Community',
        image: '/Ndigbo Viva Logo.jpg',
        breaking: false,
        trending: true,
        views: 1250,
        likes: 89,
        source: 'Ndigbo Viva News',
        link: '#'
      },
      {
        id: 'fallback_2',
        title: 'Igbo Cultural Festival Celebrates Heritage and Unity',
        excerpt: 'The annual Igbo Cultural Festival brought together thousands of people to celebrate traditional music, dance, and cuisine.',
        content: 'Full content would be here...',
        author: 'Ndigbo Viva Editorial',
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        readTime: '4 min read',
        category: 'Culture',
        image: '/Ndigbo Viva Logo.jpg',
        breaking: false,
        trending: false,
        views: 890,
        likes: 67,
        source: 'Ndigbo Viva News',
        link: '#'
      },
      {
        id: 'fallback_3',
        title: 'Igbo Entrepreneurs Launch Investment Fund for Startups',
        excerpt: 'A group of successful Igbo entrepreneurs has launched a new investment fund to support emerging businesses in Nigeria and the diaspora.',
        content: 'Full content would be here...',
        author: 'Ndigbo Viva Editorial',
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        readTime: '6 min read',
        category: 'Business',
        image: '/Ndigbo Viva Logo.jpg',
        breaking: true,
        trending: true,
        views: 2100,
        likes: 156,
        source: 'Ndigbo Viva News',
        link: '#'
      },
      {
        id: 'fallback_4',
        title: 'Igbo Language App Reaches 100,000 Downloads',
        excerpt: 'The popular Igbo language learning app has reached a milestone of 100,000 downloads, helping preserve the language globally.',
        content: 'Full content would be here...',
        author: 'Ndigbo Viva Editorial',
        publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        readTime: '3 min read',
        category: 'Culture',
        image: '/Ndigbo Viva Logo.jpg',
        breaking: false,
        trending: true,
        views: 1800,
        likes: 134,
        source: 'Ndigbo Viva News',
        link: '#'
      },
      {
        id: 'fallback_5',
        title: 'Igbo Tech Innovators Win International Startup Competition',
        excerpt: 'A team of Igbo tech innovators has won first place in a global startup competition, securing $500,000 in funding.',
        content: 'Full content would be here...',
        author: 'Ndigbo Viva Editorial',
        publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        readTime: '6 min read',
        category: 'Technology',
        image: '/Ndigbo Viva Logo.jpg',
        breaking: false,
        trending: false,
        views: 2200,
        likes: 189,
        source: 'Ndigbo Viva News',
        link: '#'
      },
      {
        id: 'fallback_6',
        title: 'Igbo Women\'s Group Launches Economic Empowerment Program',
        excerpt: 'A new economic empowerment program specifically designed for Igbo women has been launched, providing training and funding opportunities.',
        content: 'Full content would be here...',
        author: 'Ndigbo Viva Editorial',
        publishedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        readTime: '4 min read',
        category: 'Community',
        image: '/Ndigbo Viva Logo.jpg',
        breaking: false,
        trending: true,
        views: 1500,
        likes: 98,
        source: 'Ndigbo Viva News',
        link: '#'
      }
    ];

    // If no RSS news available, return fallback content
    const finalNews = limitedNews.length > 0 ? limitedNews : fallbackNews;

    return NextResponse.json({
      success: true,
      data: finalNews,
      total: finalNews.length,
      category: category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching RSS news:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news',
      data: [],
      total: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, feedUrl, category } = body;

    if (action === 'refresh') {
      // Force refresh all feeds
      const newsItems = await rssFeedService.fetchAllFeeds();
      
      return NextResponse.json({
        success: true,
        message: 'Feeds refreshed successfully',
        data: newsItems,
        total: newsItems.length
      });
    }

    if (action === 'test_feed' && feedUrl) {
      // Test a specific feed URL
      const testFeed = {
        name: 'Test Feed',
        url: feedUrl,
        category: category || 'Test',
        priority: 999,
        enabled: true
      };
      
      const newsItems = await rssFeedService.fetchFeed(testFeed);
      
      return NextResponse.json({
        success: true,
        message: 'Feed tested successfully',
        data: newsItems,
        total: newsItems.length
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in POST /api/news/rss:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
}
