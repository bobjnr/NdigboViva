import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Simple email test endpoint is working!',
    apiKey: process.env.RESEND_API_KEY ? 'Found' : 'Not found'
  });
}

export async function POST() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found'
      }, { status: 400 });
    }

    // Test with a real email address (replace with your email)
    const testEmail = 'bobekene7@gmail.com'; // Your real email
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ndigbo Viva <onboarding@resend.dev>',
        to: [testEmail],
        subject: 'Test Email from Ndigbo Viva',
        html: '<h1>Test Email</h1><p>This is a test email!</p>',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({
        success: false,
        error: `Resend API error: ${response.status} ${error}`
      }, { status: 500 });
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: result.id
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
