import { NextResponse } from 'next/server';
import { blockProdAccess } from '@/lib/api-guards';

export async function POST() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured'
      }, { status: 500 });
    }

    // Test email to your Vercel domain
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ndigbo Viva <hello@ndigbo-viva-blog.vercel.app>',
        to: ['hello@ndigbo-viva-blog.vercel.app'], // Send to yourself first
        subject: 'Test Email from Vercel Domain',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">🎉 Vercel Domain Email Test</h1>
            <p>This email was sent from your Vercel domain: <strong>ndigbo-viva-blog.vercel.app</strong></p>
            <p>If you received this, your domain verification is working!</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Next Steps:</h3>
              <ul>
                <li>✅ Domain verification working</li>
                <li>✅ Email sending from Vercel domain</li>
                <li>🚀 Ready to send to real users!</li>
              </ul>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({
        success: false,
        error: `Resend API error: ${response.status} ${error}`,
        status: response.status
      }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: result.id,
      from: 'hello@ndigbo-viva-blog.vercel.app',
      to: 'hello@ndigbo-viva-blog.vercel.app'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
