import { NextResponse } from 'next/server';
import { sendBlogPostEmail } from '@/lib/email-native';

export async function POST() {
  try {
    console.log('Testing blog post email...');
    
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
    const subscribers = getBlogNotificationSubscribers();
    const subscriberEmails = subscribers.map(sub => sub.email);
    
    // If no subscribers, use your verified email for testing
    if (subscriberEmails.length === 0) {
      subscriberEmails.push('bobekene7@gmail.com');
      console.log('No subscribers found, using verified email for testing');
    }
    
    console.log('Sending blog post email to:', subscriberEmails);
    
    const result = await sendBlogPostEmail(testData, subscriberEmails);
    
    if (result.success) {
      console.log('Blog post email sent successfully!');
      return NextResponse.json({
        success: true,
        message: 'Blog post notification sent successfully!',
        messageId: result.messageId,
        note: 'Check your email inbox (and spam folder) for the test email'
      });
    } else {
      console.error('Failed to send blog post email:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to send blog post notification'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Blog post email test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Blog post email test endpoint ready!',
    usage: 'Send POST request to test blog post email notifications',
    note: 'This will send a test blog post email to your verified address'
  });
}
