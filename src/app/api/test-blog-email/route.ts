import { NextResponse } from 'next/server';
import { sendBlogPostEmail } from '@/lib/email-native';
import { blockProdAccess } from '@/lib/api-guards';

export async function POST() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    const testData = {
      title: 'Test Blog Post - Email Notification',
      excerpt: 'This is a test blog post to verify that email notifications are working correctly. If you receive this email, the system is functioning properly!',
      slug: 'test-blog-post-email',
      publishedAt: new Date().toISOString(),
      thumbnail: 'https://via.placeholder.com/600x400/059669/ffffff?text=Test+Blog+Post',
      videoId: 'dQw4w9WgXcQ' // Rick Roll video ID for testing
    };

    // Get real subscribers who want blog notifications
    const { getBlogNotificationSubscribers } = await import('@/lib/subscribers');
    const subscribers = await getBlogNotificationSubscribers();
    const subscriberEmails = subscribers.map(sub => sub.email);
    
    // If no subscribers, use your verified email for testing
    let fallbackUsed = false;
    if (subscriberEmails.length === 0) {
      subscriberEmails.push('bobekene7@gmail.com');
      fallbackUsed = true;
    }
    
    const result = await sendBlogPostEmail(testData, subscriberEmails);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Blog post notification sent successfully!',
        messageId: result.messageId,
        recipientCount: subscriberEmails.length,
        fallbackRecipientUsed: fallbackUsed
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to send blog post notification'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  return NextResponse.json({
    success: true,
    message: 'Blog post email test endpoint ready!',
    usage: 'Send POST request to test blog post email notifications',
    note: 'This will send a test blog post email to your verified address'
  });
}
