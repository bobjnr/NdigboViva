/**
 * API Route: Update Submission Status
 * POST /api/admin/submissions/status
 * 
 * Updates the status of a submission (e.g. REJECTED, NEEDS_CLARIFICATION)
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateSubmissionStatus } from '@/lib/submission-database';
import { SubmissionStatus } from '@/lib/submission-schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { submissionId, status, notes, reviewerId } = body;

        if (!submissionId || !status) {
            return NextResponse.json(
                { success: false, error: 'Submission ID and Status are required' },
                { status: 400 }
            );
        }

        // Prevent using this route for APPROVAL (should use /approve endpoint)
        if (status === 'APPROVED') {
            return NextResponse.json(
                { success: false, error: 'Please use the approval endpoint for approvals' },
                { status: 400 }
            );
        }

        const result = await updateSubmissionStatus(
            submissionId,
            status as SubmissionStatus,
            notes,
            reviewerId
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Submission status updated to ${status}`
        });

    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}
