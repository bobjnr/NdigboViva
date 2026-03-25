/**
 * API Route: Approve Submission
 * POST /api/admin/submissions/approve
 * 
 * 1. Fetches the submission
 * 2. Creates a PersonRecord from the submission data
 * 3. Updates the submission status to APPROVED
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionByIdAdmin, updateSubmissionStatusAdmin } from '@/lib/submission-database-admin';
import { createPersonAdmin, publishPersonAdmin } from '@/lib/person-database-admin';

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

        // 1. Get the submission (Admin reads from FIREBASE_FIRESTORE_DATABASE_ID or igbo-genealogy-db)
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
        const databaseId = process.env.FIREBASE_FIRESTORE_DATABASE_ID || 'igbo-genealogy-db';
        console.log('[approve] Looking up submission', { submissionId, projectId, databaseId });

        const submission = await getSubmissionByIdAdmin(submissionId);
        if (!submission) {
            console.error('[approve] Submission not found', { submissionId, projectId, databaseId });
            return NextResponse.json(
                {
                    success: false,
                    error: 'Submission not found. In production, ensure the approve API uses the same Firebase project and database as where submissions are stored (same project as NEXT_PUBLIC_FIREBASE_PROJECT_ID; set FIREBASE_FIRESTORE_DATABASE_ID=(default) if you use the default Firestore database).',
                },
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

        const personResult = await createPersonAdmin(personData, reviewerId || 'ADMIN');

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

        // 4. Update Submission Status (with convertedPersonId for search linking)
        const updateResult = await updateSubmissionStatusAdmin(
            submissionId,
            'APPROVED',
            `Approved, Converted to Person ID: ${personResult.personId}, and Published to Search.`,
            reviewerId,
            personResult.personId
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
