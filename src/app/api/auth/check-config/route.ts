import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to check NextAuth configuration
 * Access at: /api/auth/check-config
 */
export async function GET() {
    const checks = {
        nextAuthSecret: {
            set: !!process.env.NEXTAUTH_SECRET,
            length: process.env.NEXTAUTH_SECRET?.length || 0,
            preview: process.env.NEXTAUTH_SECRET ? `${process.env.NEXTAUTH_SECRET.substring(0, 10)}...` : 'Not set'
        },
        nextAuthUrl: {
            set: !!process.env.NEXTAUTH_URL,
            value: process.env.NEXTAUTH_URL || 'Not set'
        },
        googleClientId: {
            set: !!process.env.GOOGLE_CLIENT_ID,
            preview: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'Not set'
        },
        googleClientSecret: {
            set: !!process.env.GOOGLE_CLIENT_SECRET,
            hasValue: !!process.env.GOOGLE_CLIENT_SECRET
        },
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    };

    const allGood = 
        checks.nextAuthSecret.set &&
        checks.nextAuthUrl.set &&
        checks.googleClientId.set &&
        checks.googleClientSecret.set;

    return NextResponse.json({
        status: allGood ? 'ok' : 'error',
        checks,
        message: allGood 
            ? 'All required environment variables are set' 
            : 'Some required environment variables are missing. Check the checks object for details.'
    }, {
        status: allGood ? 200 : 500
    });
}







