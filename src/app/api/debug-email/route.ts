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

export async function GET() {
  const guardResponse = blockProdAccess();
  if (guardResponse) return guardResponse;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      resendApiKeyPresent: !!apiKey,
      resendApiKeyLength: apiKey ? apiKey.length : 0,
      resendApiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'Not set',
      message: apiKey ? 'RESEND_API_KEY is configured' : 'RESEND_API_KEY is missing'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}