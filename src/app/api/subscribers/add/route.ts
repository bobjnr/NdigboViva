import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/subscribers';

export async function POST(request: NextRequest) {
  try {
    const { email, name, blogNotifications, welcomeEmails } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const subscriber = addSubscriber(email, name, {
      blogNotifications: blogNotifications ?? true,
      welcomeEmails: welcomeEmails ?? true,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscriber added successfully',
      subscriber
    });
  } catch (error: unknown) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
