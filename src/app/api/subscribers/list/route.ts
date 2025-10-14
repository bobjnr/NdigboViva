import { NextResponse } from 'next/server';
import { getBlogNotificationSubscribers, getAllSubscribers } from '@/lib/subscribers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    let subscribers;
    if (type === 'blog') {
      subscribers = getBlogNotificationSubscribers();
    } else {
      subscribers = getAllSubscribers();
    }

    return NextResponse.json({
      success: true,
      subscribers,
      count: subscribers.length
    });
  } catch (error: unknown) {
    console.error('Error getting subscribers:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
