import { NextResponse } from 'next/server';

export function blockProdAccess() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint not available in production environment' },
      { status: 403 }
    );
  }
  return null;
}

