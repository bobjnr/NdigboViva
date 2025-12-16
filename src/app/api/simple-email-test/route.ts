import { NextResponse } from 'next/server';
import { blockProdAccess } from '@/lib/api-guards';

export async function OPTIONS() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

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

    // Simple test email
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ndigbo Viva <onboarding@resend.dev>',
        to: ['bobekene7@gmail.com'], // Send to verified email first
        subject: 'Test Email from Ndigbo Viva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">🧪 Simple Email Test</h1>
            <p>This is a test email to verify the email system is working.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>✅ Email System Status:</h3>
              <ul>
                <li>✅ Resend API connected</li>
                <li>✅ Email sending working</li>
                <li>🚀 Ready for production!</li>
              </ul>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Resend API error: ${response.status}`,
        details: errorText,
        status: response.status
      }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: result.id,
      from: 'onboarding@resend.dev',
      to: 'bobekene7@gmail.com'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.toString() : String(error)
    }, { status: 500 });
  }
}
