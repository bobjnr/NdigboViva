import { NextResponse } from 'next/server';
import { blockProdAccess } from '@/lib/api-guards';

export async function GET() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    // Check if environment variables are loaded
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Check which variables are missing
    const missingVars: string[] = [];
    const presentVars: string[] = [];

    Object.entries(firebaseConfig).forEach(([key, value]) => {
      if (!value || value === 'your_firebase_api_key' || value.includes('your_')) {
        missingVars.push(key);
      } else {
        presentVars.push(key);
      }
    });

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      config: {
        present: presentVars,
        missing: missingVars,
        // Don't expose actual values for security
        apiKeyPresent: !!firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('your_'),
        projectIdPresent: !!firebaseConfig.projectId && !firebaseConfig.projectId.includes('your_'),
        authDomainPresent: !!firebaseConfig.authDomain && !firebaseConfig.authDomain.includes('your_'),
      },
      message: missingVars.length === 0 
        ? 'All Firebase environment variables are present' 
        : `Missing variables: ${missingVars.join(', ')}`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
