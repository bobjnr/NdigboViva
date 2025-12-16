import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email-native';
import { blockProdAccess } from '@/lib/api-guards';

export async function POST() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    const testEmail = 'test@example.com'; // Test email
    const testName = 'Test User';

    const result = await sendWelcomeEmail({ 
      name: testName, 
      email: testEmail 
    });

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Welcome email sent successfully' : (result.error || 'Failed to send welcome email'),
      details: result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Welcome email test failed',
      details: error instanceof Error ? error.toString() : String(error)
    }, { status: 500 });
  }
}
