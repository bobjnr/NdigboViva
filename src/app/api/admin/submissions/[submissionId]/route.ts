/**
 * DELETE /api/admin/submissions/[submissionId]
 *
 * Deletes a submission and keeps the database in sync:
 * - If the submission was approved (has convertedPersonId), deletes that person from people and public_persons
 * - Deletes the submission document (removes from user's submissions)
 *
 * Use when a user or admin deletes a submission so the record is removed too.
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSubmissionAdmin } from '@/lib/submission-database-admin';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;
    if (!submissionId?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteSubmissionAdmin(submissionId.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? 'Delete failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted',
      ...(result.deletedPersonId && {
        deletedPersonId: result.deletedPersonId,
        message: 'Submission and its person record deleted',
      }),
    });
  } catch (error) {
    console.error('Delete submission API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
