import { NextResponse } from 'next/server'
import { getLatestVideos } from '@/lib/youtube'

export async function GET() {
  try {
    const videos = await getLatestVideos(20)
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
