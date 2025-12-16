import { NextResponse } from 'next/server'
import { getLatestVideos } from '@/lib/youtube'

export async function GET() {
  try {
    const videos = await getLatestVideos(20)
    return NextResponse.json({ videos })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
