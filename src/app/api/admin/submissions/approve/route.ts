/**
 * API Route: Approve Submission
 * POST /api/admin/submissions/approve
 * 
 * 1. Fetches the submission
 * 2. Creates a PersonRecord from the submission data
 * 3. Updates the submission status to APPROVED
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionStatus } from '@/lib/submission-database';
// Use the underlying createPerson function that writes to 'persons'
import { createPerson } from '@/lib/person-database';
import { createPersonFromForm } from '@/lib/person-schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { submissionId, reviewerId } = body;

        if (!submissionId) {
            return NextResponse.json(
                { success: false, error: 'Submission ID is required' },
                { status: 400 }
            );
        }

        // 1. Get the submission
        const submission = await getSubmissionById(submissionId);
        if (!submission) {
            return NextResponse.json(
                { success: false, error: 'Submission not found' },
                { status: 404 }
            );
        }

        if (submission.status === 'APPROVED') {
            return NextResponse.json(
                { success: false, error: 'Submission is already approved' },
                { status: 400 }
            );
        }

        // 2. Create Person Record
        // We force verification level to 2 (Verified) since an Admin is explicitly approving it
        const personData = {
            ...submission.data,
            verificationLevel: 2 as const, // Verified
            verified: true
        };

        const personResult = await createPerson(personData, reviewerId || 'ADMIN');

        if (!personResult.success || !personResult.personId) {
            throw new Error(personResult.error || 'Failed to create person record');
        }

        // 3. Automatically Publish to Public Index
        // This ensures the record appears in search immediately
        const { publishPerson } = await import('@/lib/person-database');
        const publishResult = await publishPerson(personResult.personId, reviewerId || 'ADMIN');

        if (!publishResult.success) {
            console.warn(`Person created (${personResult.personId}) but failed to publish automatically: ${publishResult.error}`);
            // We don't fail the whole request, but we log it. Admin might need to manually publish later.
        }

        // 4. Update Submission Status
        const updateResult = await updateSubmissionStatus(
            submissionId,
            'APPROVED',
            `Approved, Converted to Person ID: ${personResult.personId}, and Published to Search.`,
            reviewerId
        );

        if (!updateResult.success) {
            console.error('Failed to update submission status after creating person:', updateResult.error);
            // This is a weird half-state. Person created but submission not marked. 
            // In a real app we'd want a transaction.
        }

        return NextResponse.json({
            success: true,
            personId: personResult.personId,
            message: 'Submission approved and person record created successfully'
        });

    } catch (error) {
        console.error('Error approving submission:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}
