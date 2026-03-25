/**
 * POST /api/persons/[personId]/link
 * Link a family relationship (father, mother, spouse, child).
 * Uses Firebase Admin so it works without client auth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { linkFamilyRelationshipAdmin } from '@/lib/person-database-admin';

const VALID_RELATIONSHIPS = ['father', 'mother', 'spouse', 'child'] as const;

export async function POST(
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

    const body = await request.json();
    const { relationship, relatedPersonId } = body;

    if (!relationship || !VALID_RELATIONSHIPS.includes(relationship)) {
      return NextResponse.json(
        { success: false, error: 'Valid relationship (father, mother, spouse, child) is required' },
        { status: 400 }
      );
    }

    if (!relatedPersonId || typeof relatedPersonId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'relatedPersonId is required' },
        { status: 400 }
      );
    }

    if (relatedPersonId === personId) {
      return NextResponse.json(
        { success: false, error: 'Cannot link a person to themselves' },
        { status: 400 }
      );
    }

    const result = await linkFamilyRelationshipAdmin(
      personId,
      relationship,
      relatedPersonId.trim()
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? 'Link failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Relationship linked' });
  } catch (error) {
    console.error('Link family API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
