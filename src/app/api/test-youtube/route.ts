import { NextResponse } from 'next/server';
import { getLatestVideos, getChannelInfo } from '@/lib/youtube';
import { blockProdAccess } from '@/lib/api-guards';

export async function GET() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    const channelInfo = await getChannelInfo();
    const videos = await getLatestVideos(5);

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
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'YouTube API test failed',
      details: error instanceof Error ? error.toString() : String(error)
    }, { status: 500 });
  }
}
