import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Check what scopes the token has by calling Google's tokeninfo endpoint
        try {
            const response = await fetch(
                `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${session.accessToken}`
            );

            if (response.ok) {
                const tokenInfo = await response.json();
                return NextResponse.json({
                    scopes: tokenInfo.scope?.split(' ') || [],
                    hasYouTubeScope: tokenInfo.scope?.includes('youtube') || false,
                    expiresIn: tokenInfo.expires_in,
                    audience: tokenInfo.audience,
                });
            } else {
                return NextResponse.json(
                    { error: 'Failed to get token info', hasAccessToken: !!session.accessToken },
                    { status: 500 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Error checking token scopes', hasAccessToken: !!session.accessToken },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to check scopes' },
            { status: 500 }
        );
    }
}




