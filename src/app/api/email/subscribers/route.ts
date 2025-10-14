import { NextResponse } from 'next/server';
import { getSubscriberCount } from '@/lib/email-native';

export async function GET() {
  try {
    const result = await getSubscriberCount();

    if (result.success) {
      return NextResponse.json({
        success: true,
        total: result.count,
        subscribers: [],
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to get subscribers' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get subscribers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
