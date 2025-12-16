import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
        
        if (!channelId || channelId === 'UC_NDIGBOVIVA_CHANNEL_ID' || channelId.includes('your_')) {
            return NextResponse.json(
                { 
                    error: 'Channel ID not configured',
                    channelId: null 
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ channelId });
    } catch (error) {
        return NextResponse.json(
            { 
                error: 'Failed to get channel ID',
                channelId: null 
            },
            { status: 500 }
        );
    }
}

