import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test - just check if API key exists
    const apiKey = process.env.RESEND_API_KEY;
    
    return NextResponse.json({
      success: true,
      message: 'Resend API key is configured!',
      apiKey: apiKey ? 'Found' : 'Not found',
      status: 'Ready to send emails'
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: [
        'Check if your API key is correct',
        'Make sure RESEND_API_KEY is in your .env.local file',
        'Verify the API key starts with "re_"',
        'Ensure you have an active Resend account'
      ]
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test sending a simple email using native fetch
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found in environment variables'
      }, { status: 400 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ndigbo Viva <onboarding@resend.dev>',
        to: ['test@example.com'], // Replace with your email for testing
        subject: 'Test Email from Ndigbo Viva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b;">NDIGBO VIVA</h1>
            <p>This is a test email to verify your Resend setup is working correctly!</p>
            <p>If you received this email, your configuration is successful! 🎉</p>
            <p><strong>Umuigbo Kunienu!</strong></p>
          </div>
        `,
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
      emailId: result.id,
      note: 'Check your email inbox (and spam folder) for the test email'
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: [
        'Check if your API key has email sending permissions',
        'Verify your Resend account is active',
        'Make sure the "to" email address is valid'
      ]
    }, { status: 500 });
  }
}