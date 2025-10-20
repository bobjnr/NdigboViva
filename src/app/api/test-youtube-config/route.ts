import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    hasApiKey: !!process.env.YOUTUBE_API_KEY,
    hasChannelId: !!process.env.YOUTUBE_CHANNEL_ID,
    apiKeyLength: process.env.YOUTUBE_API_KEY?.length || 0,
    channelId: process.env.YOUTUBE_CHANNEL_ID || 'Not set',
    nodeEnv: process.env.NODE_ENV
  }

  return NextResponse.json({
    message: 'YouTube API Configuration Check',
    config,
    instructions: {
      setup: [
        '1. Create a .env.local file in your project root',
        '2. Add YOUTUBE_API_KEY=your_api_key_here',
        '3. Add YOUTUBE_CHANNEL_ID=your_channel_id_here',
        '4. Restart your development server'
      ],
      getApiKey: [
        '1. Go to Google Cloud Console',
        '2. Enable YouTube Data API v3',
        '3. Create credentials (API Key)',
        '4. Copy the API key'
      ],
      getChannelId: [
        '1. Go to your YouTube channel',
        '2. Look at the URL: youtube.com/channel/CHANNEL_ID',
        '3. Or go to youtube.com/@yourusername',
        '4. Right-click and "View Page Source"',
        '5. Search for "channelId"'
      ]
    }
  })
}
