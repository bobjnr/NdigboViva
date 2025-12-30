/**
 * API Route: Get Family Tree
 * GET /api/persons/family-tree/[personId]?depth={maxDepth}
 * 
 * Retrieves family tree (ancestors and descendants) for a person
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFamilyTree } from '@/lib/person-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  try {
    const { personId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const maxDepth = parseInt(searchParams.get('depth') || '3', 10);
    
    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Fetching family tree for person:', personId);
    const familyTree = await getFamilyTree(personId, maxDepth);
    
    // Convert Firestore Timestamps to ISO strings for JSON serialization
    const familyTreeForResponse = JSON.parse(JSON.stringify(familyTree, (key, value) => {
      // Convert Firestore Timestamp objects to ISO strings
      if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    }));
    
    return NextResponse.json({
      success: true,
      familyTree: familyTreeForResponse
    });
    
  } catch (error) {
    console.error('Error getting family tree:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

