import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email-native';

export async function POST() {
  try {
    const testEmail = 'test@example.com'; // Test email
    const testName = 'Test User';
    
    console.log('Testing welcome email...');
    console.log('Test email:', testEmail);
    console.log('Test name:', testName);
    
    const result = await sendWelcomeEmail({ 
      name: testName, 
      email: testEmail 
    });
    
    console.log('Welcome email result:', result);
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Welcome email sent successfully' : (result.error || 'Failed to send welcome email'),
      details: result
    });
  } catch (error) {
    console.error('Welcome email test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Welcome email test failed',
      details: error instanceof Error ? error.toString() : String(error)
    }, { status: 500 });
  }
}
