import { NextRequest, NextResponse } from 'next/server';
import { sendBlogPostEmail } from '@/lib/email-native';
import { getBlogNotificationSubscribers } from '@/lib/subscribers';

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, slug, publishedAt, thumbnail, videoId } = await request.json();

    if (!title || !excerpt || !slug) {
      return NextResponse.json(
        { error: 'Title, excerpt, and slug are required' },
        { status: 400 }
      );
    }

    // Get subscribers who want blog notifications
    const subscribers = getBlogNotificationSubscribers();
    const subscriberEmails = subscribers.map(sub => sub.email);
    
    if (subscriberEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers found for blog notifications',
        count: 0
      });
    }
    
    const result = await sendBlogPostEmail({
      title,
      excerpt,
      slug,
      publishedAt: publishedAt || new Date().toISOString(),
      thumbnail,
      videoId,
    }, subscriberEmails);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Blog post notification sent successfully',
        messageId: result.messageId,
        subscriberCount: subscriberEmails.length,
        subscribers: subscriberEmails
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send blog post notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Blog post email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
