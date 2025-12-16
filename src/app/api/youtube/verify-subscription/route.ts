import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { checkSubscriptionStatus } from '@/lib/youtube-auth';

export async function GET(request: NextRequest) {
    try {
        // Get the authenticated session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.error('❌ No session found');
            return NextResponse.json(
                { error: 'Not authenticated - no session' },
                { status: 401 }
            );
        }

        if (!session.accessToken) {
            console.error('❌ No access token in session');
            console.log('📊 Session data:', { 
                hasUser: !!session.user, 
                userEmail: session.user?.email,
                hasAccessToken: !!session.accessToken 
            });
            return NextResponse.json(
                { error: 'Not authenticated - no access token. Please sign in again.' },
                { status: 401 }
            );
        }

        console.log('✅ Session found with access token');
        console.log('🔑 Access token length:', session.accessToken.length);
        console.log('🔑 Access token preview:', session.accessToken.substring(0, 20) + '...');

        // Get channel ID from environment variables
        const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
        
        if (!channelId || channelId === 'UC_NDIGBOVIVA_CHANNEL_ID' || channelId.includes('your_')) {
            console.error('❌ Invalid or missing YouTube channel ID:', channelId);
            return NextResponse.json(
                {
                    error: 'YouTube channel ID is not configured. Please set YOUTUBE_CHANNEL_ID in your environment variables.',
                    isSubscribed: false
                },
                { status: 500 }
            );
        }

        console.log('🔍 Checking subscription for channel:', channelId);
        
        // Check subscription status with explicit channel ID
        const status = await checkSubscriptionStatus(session.accessToken, channelId);
        
        console.log('📊 Subscription status:', status);

        return NextResponse.json(status);
    } catch (error) {
        console.error('Error verifying subscription:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to verify subscription',
                isSubscribed: false
            },
            { status: 500 }
        );
    }
}
