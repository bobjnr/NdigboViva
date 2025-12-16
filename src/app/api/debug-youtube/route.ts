import { NextResponse } from 'next/server';
import { blockProdAccess } from '@/lib/api-guards';

export async function GET() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    // Check YouTube API configuration
    const youtubeConfig = {
      apiKey: process.env.YOUTUBE_API_KEY,
      channelId: process.env.YOUTUBE_CHANNEL_ID,
    };

    // Check which variables are missing
    const missingVars: string[] = [];
    const presentVars: string[] = [];

    Object.entries(youtubeConfig).forEach(([key, value]) => {
      if (!value || value === 'your_youtube_api_key_here' || value.includes('your_')) {
        missingVars.push(key);
      } else {
        presentVars.push(key);
      }
    });

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      config: {
        present: presentVars,
        missing: missingVars,
        // Don't expose actual values for security
        apiKeyPresent: !!youtubeConfig.apiKey && !youtubeConfig.apiKey.includes('your_'),
        channelIdPresent: !!youtubeConfig.channelId && !youtubeConfig.channelId.includes('your_'),
      },
      message: missingVars.length === 0 
        ? 'All YouTube environment variables are present' 
        : `Missing variables: ${missingVars.join(', ')}`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
