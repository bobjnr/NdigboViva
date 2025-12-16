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
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params;
    const searchParams = request.nextUrl.searchParams;
    const maxDepth = parseInt(searchParams.get('depth') || '3', 10);
    
    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    const familyTree = await getFamilyTree(personId, maxDepth);
    
    return NextResponse.json({
      success: true,
      familyTree
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

