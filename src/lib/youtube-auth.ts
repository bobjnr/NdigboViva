// YouTube subscription verification using OAuth tokens

const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

export interface SubscriptionStatus {
    isSubscribed: boolean;
    channelTitle?: string;
    subscribedAt?: string;
    error?: string;
}

/**
 * Check if the authenticated user is subscribed to the specified YouTube channel
 * @param accessToken - OAuth access token from Google Sign-In
 * @param channelId - YouTube channel ID to check subscription for
 * @returns Subscription status
 */
export async function checkSubscriptionStatus(
    accessToken: string,
    channelId: string = YOUTUBE_CHANNEL_ID || ''
): Promise<SubscriptionStatus> {
    if (!accessToken) {
        return {
            isSubscribed: false,
            error: 'No access token provided'
        };
    }

    if (!channelId) {
        return {
            isSubscribed: false,
            error: 'No channel ID configured'
        };
    }

    try {
        console.log('🔍 Checking subscription for channel:', channelId);
        console.log('🔑 Access token present:', !!accessToken);
        console.log('🔑 Access token length:', accessToken?.length || 0);
        console.log('🔑 Access token preview:', accessToken ? accessToken.substring(0, 20) + '...' : 'N/A');
        
        if (!accessToken || accessToken.length < 10) {
            return {
                isSubscribed: false,
                error: 'Invalid access token. Please sign in again.'
            };
        }
        
        // Use YouTube Data API v3 to check subscriptions
        // This endpoint returns subscriptions for the authenticated user
        const apiUrl = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${channelId}&maxResults=1`;
        console.log('📡 YouTube API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        });

        console.log('📥 YouTube API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ YouTube API error:', response.status, errorData);

            if (response.status === 401) {
                return {
                    isSubscribed: false,
                    error: 'Authentication expired. Please sign in again.'
                };
            }

            if (response.status === 403) {
                // Check if it's a scope issue
                const errorMessage = errorData.error?.message || '';
                console.error('❌ 403 Forbidden error details:', errorData);
                
                if (errorMessage.includes('scope') || errorMessage.includes('permission') || errorMessage.includes('insufficient')) {
                    return {
                        isSubscribed: false,
                        error: 'YouTube API access not granted. Please sign out and sign in again, making sure to grant all requested permissions including YouTube subscription access.'
                    };
                }
                
                // Check for specific YouTube API errors
                if (errorMessage.includes('youtube') || errorData.error?.errors?.[0]?.reason === 'insufficientPermissions') {
                    return {
                        isSubscribed: false,
                        error: 'YouTube Data API access denied. Please ensure: 1) YouTube Data API v3 is enabled in Google Cloud Console, 2) You grant YouTube permissions when signing in.'
                    };
                }
                
                return {
                    isSubscribed: false,
                    error: `Access denied: ${errorMessage || 'Please ensure you granted YouTube subscription access when signing in.'}`
                };
            }

            return {
                isSubscribed: false,
                error: `Failed to verify subscription: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
            };
        }

        const data = await response.json();
        console.log('📊 YouTube API response data:', JSON.stringify(data, null, 2));

        // If items array has entries, user is subscribed
        if (data.items && data.items.length > 0) {
            const subscription = data.items[0];
            console.log('✅ User is subscribed!');
            return {
                isSubscribed: true,
                channelTitle: subscription.snippet?.title || 'Unknown Channel',
                subscribedAt: subscription.snippet?.publishedAt,
            };
        }

        // No subscription found
        console.log('❌ No subscription found in response');
        return {
            isSubscribed: false,
            error: 'You are not subscribed to this channel. Please subscribe and try again.'
        };
    } catch (error) {
        console.error('❌ Error checking subscription status:', error);
        return {
            isSubscribed: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Get all subscriptions for the authenticated user
 * @param accessToken - OAuth access token from Google Sign-In
 * @returns Array of subscription details
 */
export async function getUserSubscriptions(accessToken: string) {
    if (!accessToken) {
        throw new Error('No access token provided');
    }

    try {
        const response = await fetch(
            'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
    }
}
