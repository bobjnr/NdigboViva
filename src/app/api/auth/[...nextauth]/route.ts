import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Validate environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!googleClientId || !googleClientSecret) {
    console.error('❌ Missing Google OAuth credentials!');
    console.error('GOOGLE_CLIENT_ID:', googleClientId ? `✅ Set (${googleClientId.substring(0, 10)}...)` : '❌ Missing');
    console.error('GOOGLE_CLIENT_SECRET:', googleClientSecret ? '✅ Set' : '❌ Missing');
    console.error('⚠️  Google OAuth will not work until credentials are set in .env.local');
}

// Build providers array - only add Google if credentials are valid
const providers = [];

if (googleClientId && googleClientSecret) {
    providers.push(
        GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            authorization: {
                params: {
                    // Request YouTube subscription read access
                    scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    );
    console.log('✅ Google OAuth provider configured');
} else {
    console.warn('⚠️  Google OAuth provider NOT configured - missing credentials');
}

export const authOptions: NextAuthOptions = {
    providers,
    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign in - save tokens
            if (account) {
                console.log('🔑 Saving access token to JWT');
                console.log('🔑 Access token present:', !!account.access_token);
                console.log('🔑 Refresh token present:', !!account.refresh_token);
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000; // Default 1 hour
                return token;
            }

            // Check if token is expired and refresh if needed
            if (token.expiresAt && Date.now() < token.expiresAt) {
                // Token is still valid
                return token;
            }

            // Token expired, try to refresh
            if (token.refreshToken) {
                console.log('🔄 Access token expired, attempting refresh...');
                try {
                    const response = await fetch('https://oauth2.googleapis.com/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            client_id: googleClientId || '',
                            client_secret: googleClientSecret || '',
                            refresh_token: token.refreshToken as string,
                            grant_type: 'refresh_token',
                        }),
                    });

                    if (response.ok) {
                        const refreshed = await response.json();
                        console.log('✅ Token refreshed successfully');
                        token.accessToken = refreshed.access_token;
                        token.expiresAt = Date.now() + (refreshed.expires_in * 1000);
                        if (refreshed.refresh_token) {
                            token.refreshToken = refreshed.refresh_token;
                        }
                    } else {
                        console.error('❌ Failed to refresh token:', response.status);
                        // Clear tokens so user needs to sign in again
                        token.accessToken = undefined;
                        token.refreshToken = undefined;
                    }
                } catch (error) {
                    console.error('❌ Error refreshing token:', error);
                    token.accessToken = undefined;
                    token.refreshToken = undefined;
                }
            } else {
                console.warn('⚠️ No refresh token available');
                token.accessToken = undefined;
            }

            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            if (token.accessToken) {
                session.accessToken = token.accessToken as string;
            } else {
                console.warn('⚠️ No access token in session');
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
