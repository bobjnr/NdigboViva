import { NextResponse } from 'next/server';
import { getLatestVideos, getChannelInfo } from '@/lib/youtube';

export async function GET() {
  try {
    console.log('Testing YouTube API integration...');
    
    // Test channel info
    console.log('Fetching channel info...');
    const channelInfo = await getChannelInfo();
    console.log('Channel info:', channelInfo);
    
    // Test latest videos
    console.log('Fetching latest videos...');
    const videos = await getLatestVideos(5);
    console.log(`Found ${videos.length} videos`);
    
    if (videos.length > 0) {
      console.log('Latest video:', {
        title: videos[0].title,
        publishedAt: videos[0].publishedAt,
        videoId: videos[0].videoId
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'YouTube API test completed',
      channelInfo,
      videoCount: videos.length,
      latestVideo: videos.length > 0 ? {
        title: videos[0].title,
        publishedAt: videos[0].publishedAt,
        videoId: videos[0].videoId,
        thumbnail: videos[0].thumbnail
      } : null,
      allVideos: videos.map(v => ({
        title: v.title,
        publishedAt: v.publishedAt,
        videoId: v.videoId
      }))
    });
  } catch (error: unknown) {
    console.error('YouTube API test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'YouTube API test failed',
      details: error instanceof Error ? error.toString() : String(error)
    }, { status: 500 });
  }
}
