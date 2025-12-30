/**
 * Debug Route: Check if person exists and show raw data
 * GET /api/persons/debug/[personId]
 */

import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'persons';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  try {
    const { personId } = await params;
    
    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    const personRef = doc(db, COLLECTION_NAME, personId);
    const personSnap = await getDoc(personRef);
    
    return NextResponse.json({
      success: true,
      exists: personSnap.exists(),
      id: personSnap.id,
      data: personSnap.exists() ? personSnap.data() : null,
      metadata: personSnap.exists() ? {
        hasPendingWrites: personSnap.metadata.hasPendingWrites,
        fromCache: personSnap.metadata.fromCache,
      } : null,
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

