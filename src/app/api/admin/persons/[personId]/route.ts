/**
 * DELETE /api/admin/persons/[personId]
 *
 * Deletes a person record and keeps submissions in sync:
 * - Deletes any submission(s) where convertedPersonId === personId (removes from user's submissions)
 * - Deletes the person from people and public_persons
 *
 * Use when an admin deletes a record so the submission list stays correct.
 */

import { NextRequest, NextResponse } from 'next/server';
import { deletePersonAdmin } from '@/lib/person-database-admin';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  try {
    const { personId } = await params;
    if (!personId?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }

    const result = await deletePersonAdmin(personId.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? 'Delete failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Person and related submission(s) deleted',
      deletedSubmissionIds: result.deletedSubmissionIds ?? [],
    });
  } catch (error) {
    console.error('Delete person API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
