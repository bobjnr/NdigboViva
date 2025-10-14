import { NextRequest, NextResponse } from 'next/server';
import { rssFeedService, RSS_FEEDS } from '@/lib/rss-feeds';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testFeed = searchParams.get('feed');
    
    if (testFeed) {
      // Test a specific feed
      const feedConfig = RSS_FEEDS.find(f => f.name === testFeed);
      if (!feedConfig) {
        return NextResponse.json({
          success: false,
          error: 'Feed not found'
        });
      }
      
      const items = await rssFeedService.fetchFeed(feedConfig);
      
      return NextResponse.json({
        success: true,
        feed: feedConfig.name,
        totalItems: items.length,
        items: items.map(item => ({
          title: item.title,
          excerpt: item.excerpt,
          category: item.category,
          source: item.source,
          publishedAt: item.publishedAt
        }))
      });
    }
    
    // Test all feeds
    const results = [];
    
    for (const feed of RSS_FEEDS.slice(0, 3)) { // Test first 3 feeds
      try {
        const items = await rssFeedService.fetchFeed(feed);
        results.push({
          feed: feed.name,
          url: feed.url,
          enabled: feed.enabled,
          totalItems: items.length,
          sampleItems: items.slice(0, 2).map(item => ({
            title: item.title,
            excerpt: item.excerpt.substring(0, 100) + '...',
            category: item.category
          }))
        });
      } catch (error) {
        results.push({
          feed: feed.name,
          url: feed.url,
          enabled: feed.enabled,
          error: error instanceof Error ? error.message : 'Unknown error',
          totalItems: 0
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      totalFeeds: RSS_FEEDS.length,
      enabledFeeds: RSS_FEEDS.filter(f => f.enabled).length
    });

  } catch (error) {
    console.error('Debug RSS error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to debug RSS feeds',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
