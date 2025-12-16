'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Youtube, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SubscriptionGateProps {
    children: React.ReactNode;
    onVerified?: () => void;
}

type VerificationState = 'checking' | 'not-signed-in' | 'not-subscribed' | 'subscribed' | 'error';

export default function SubscriptionGate({ children, onVerified }: SubscriptionGateProps) {
    const { data: session, status } = useSession();
    const [verificationState, setVerificationState] = useState<VerificationState>('checking');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);

    const verifySubscription = useCallback(async () => {
        console.log('🔍 Starting subscription verification...');
        setIsVerifying(true);
        setErrorMessage('');

        try {
            console.log('📡 Calling /api/youtube/verify-subscription...');
            const response = await fetch('/api/youtube/verify-subscription');
            const data = await response.json();
            console.log('📥 Response:', { status: response.status, data });

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify subscription');
            }

            if (data.isSubscribed) {
                console.log('✅ User is subscribed!');
                setVerificationState('subscribed');
                onVerified?.();
            } else {
                console.log('❌ User is not subscribed');
                console.log('❌ Error message:', data.error);
                // Show error message if available
                if (data.error) {
                    setErrorMessage(data.error);
                }
                setVerificationState('not-subscribed');
            }
        } catch (error) {
            console.error('❗ Verification error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to verify subscription');
            setVerificationState('error');
        } finally {
            setIsVerifying(false);
            console.log('🏁 Verification complete');
        }
    }, [onVerified]);

    useEffect(() => {
        console.log('🔄 Auth status changed:', { status, hasSession: !!session });

        if (status === 'loading') {
            console.log('⏳ Session loading...');
            setVerificationState('checking');
            return;
        }

        if (status === 'unauthenticated') {
            console.log('🔓 User not authenticated');
            setVerificationState('not-signed-in');
            return;
        }

        if (status === 'authenticated' && session) {
            console.log('🔐 User authenticated, verifying subscription...');
            verifySubscription();
        }
    }, [status, session, verifySubscription]);

    const handleSignIn = async () => {
        try {
            console.log('🔵 Google sign-in initiated from SubscriptionGate...');
            console.log('🔵 Redirecting to:', window.location.origin + '/api/auth/signin/google');
            await signIn('google', { 
                callbackUrl: window.location.href,
                redirect: true 
            });
        } catch (error) {
            console.error('❌ Sign in error:', error);
            setErrorMessage('Failed to initiate sign in. Please try again.');
            setVerificationState('error');
        }
    };

    const handleSubscribeClick = async () => {
        // Fetch the channel ID from the server to ensure it's correct
        try {
            const response = await fetch('/api/youtube/get-channel-id');
            const data = await response.json();
            const channelId = data.channelId;
            
            if (!channelId || channelId === 'UC_NDIGBOVIVA_CHANNEL_ID' || channelId.includes('your_')) {
                console.error('❌ Invalid channel ID:', channelId);
                setErrorMessage('Channel ID is not configured. Please contact support.');
                setVerificationState('error');
                return;
            }
            
            // Try channel ID format first
            window.open(`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`, '_blank');
        } catch (error) {
            console.error('Error getting channel ID:', error);
            // Fallback: try to use environment variable
            const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
            if (channelId && !channelId.includes('your_') && channelId !== 'UC_NDIGBOVIVA_CHANNEL_ID') {
                window.open(`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`, '_blank');
            } else {
                setErrorMessage('Unable to get channel URL. Please check your configuration.');
                setVerificationState('error');
            }
        }
    };

    // If subscribed, show the protected content
    if (verificationState === 'subscribed') {
        return <>{children}</>;
    }

    // Otherwise, show the gate
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
                {/* Icon */}
                <div className="mb-6">
                    {verificationState === 'checking' || isVerifying ? (
                        <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
                        </div>
                    ) : verificationState === 'error' ? (
                        <div className="bg-red-50 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                    ) : verificationState === 'subscribed' ? (
                        <div className="bg-green-50 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    ) : (
                        <div className="bg-brand-gold-50 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                            <Youtube className="w-12 h-12 text-brand-gold" />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {verificationState === 'checking' || isVerifying
                        ? 'Verifying Subscription...'
                        : verificationState === 'not-signed-in'
                            ? 'Sign In Required'
                            : verificationState === 'not-subscribed'
                                ? 'Subscribe to Access'
                                : verificationState === 'error'
                                    ? 'Verification Error'
                                    : 'Access Granted'}
                </h3>

                {/* Message */}
                <div className="mb-8">
                    {verificationState === 'checking' || isVerifying ? (
                        <p className="text-gray-600">
                            Please wait while we verify your subscription status...
                        </p>
                    ) : verificationState === 'not-signed-in' ? (
                        <div className="space-y-3">
                            <p className="text-gray-600">
                                To access the Igbo Genealogy Project, you need to be subscribed to our YouTube channel.
                            </p>
                            <p className="text-gray-600">
                                Please sign in with your Google account to verify your subscription.
                            </p>
                        </div>
                    ) : verificationState === 'not-subscribed' ? (
                        <div className="space-y-3">
                            <p className="text-gray-600">
                                You're not currently subscribed to our YouTube channel.
                            </p>
                            <p className="text-gray-600">
                                Subscribe to <span className="font-semibold text-brand-gold">Ndigbo Viva</span> to access the Igbo Genealogy Project and support our mission to preserve Igbo heritage.
                            </p>
                        </div>
                    ) : verificationState === 'error' ? (
                        <div className="space-y-3">
                            <p className="text-red-600 font-medium">{errorMessage}</p>
                            {errorMessage.includes('YouTube API access not granted') && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                                    <p className="font-semibold">Troubleshooting Steps:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-2">
                                        <li>Sign out and sign in again</li>
                                        <li>When Google asks for permissions, make sure to grant <strong>all</strong> requested permissions, especially YouTube subscription access</li>
                                        <li>If you don't see YouTube permissions, the Google OAuth app may need YouTube Data API v3 enabled in Google Cloud Console</li>
                                    </ol>
                                </div>
                            )}
                            <p className="text-gray-600 text-sm">
                                Please try again or contact support if the problem persists.
                            </p>
                        </div>
                    ) : null}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {verificationState === 'not-signed-in' && (
                        <button
                            onClick={handleSignIn}
                            className="bg-brand-gold text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                    )}

                    {verificationState === 'not-subscribed' && (
                        <>
                            <button
                                onClick={handleSubscribeClick}
                                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                            >
                                <Youtube className="w-5 h-5" />
                                Subscribe to Channel
                            </button>
                            <button
                                onClick={verifySubscription}
                                disabled={isVerifying}
                                className="border-2 border-brand-gold text-brand-gold px-8 py-3 rounded-lg font-semibold hover:bg-brand-gold hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isVerifying ? 'Verifying...' : 'I\'ve Subscribed - Verify'}
                            </button>
                        </>
                    )}

                    {verificationState === 'error' && errorMessage && (
                        <>
                            {errorMessage.includes('YouTube API access not granted') && (
                                <div className="w-full space-y-3">
                                    <button
                                        onClick={async () => {
                                            // Sign out and sign in again to request permissions
                                            const { signOut } = await import('next-auth/react');
                                            await signOut({ redirect: false });
                                            // Wait a moment, then sign in again
                                            setTimeout(() => {
                                                handleSignIn();
                                            }, 500);
                                        }}
                                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Sign In Again (Grant YouTube Permissions)
                                    </button>
                                    <p className="text-sm text-gray-600 text-center">
                                        When signing in, make sure to check all permission boxes, especially YouTube subscription access.
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={verifySubscription}
                                disabled={isVerifying}
                                className="bg-brand-gold text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isVerifying ? 'Retrying...' : 'Try Again'}
                            </button>
                        </>
                    )}

                    {verificationState === 'error' && (
                        <button
                            onClick={verifySubscription}
                            disabled={isVerifying}
                            className="bg-brand-gold text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? 'Retrying...' : 'Try Again'}
                        </button>
                    )}
                </div>

                {/* Additional info */}
                {verificationState === 'not-signed-in' && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            By signing in, you allow us to verify your YouTube subscription status.
                            We only access your public subscription information and do not store any personal data.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
