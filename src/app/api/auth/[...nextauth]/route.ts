import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Validate configuration before creating handler
if (!process.env.NEXTAUTH_SECRET) {
    console.error('❌ CRITICAL: NEXTAUTH_SECRET is not set!');
}

if (!process.env.NEXTAUTH_URL) {
    console.error('❌ CRITICAL: NEXTAUTH_URL is not set!');
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
