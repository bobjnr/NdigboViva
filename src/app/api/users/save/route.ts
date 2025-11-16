import { NextRequest, NextResponse } from 'next/server';
import { saveUserToFirestore } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName, blogNotifications, welcomeEmails } = await request.json();

    if (!uid || !email || !displayName) {
      return NextResponse.json(
        { error: 'UID, email, and displayName are required' },
        { status: 400 }
      );
    }

    const result = await saveUserToFirestore({
      uid,
      email,
      displayName,
      blogNotifications,
      welcomeEmails,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'User data saved successfully',
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to save user data' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in save user API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

