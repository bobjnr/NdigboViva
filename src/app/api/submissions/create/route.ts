/**
 * API Route: Create Submission
 * POST /api/submissions/create
 * 
 * Receives raw form data and saves it to the 'submissions' collection.
 * Does NOT create a 'person' record directly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSubmission } from '@/lib/submission-database';
import { PersonFormSubmission } from '@/lib/person-schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.fullName) {
            return NextResponse.json(
                { success: false, error: 'Full name is required' },
                { status: 400 }
            );
        }

        // Create submission record
        const result = await createSubmission(body as PersonFormSubmission);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            submissionId: result.submissionId,
            message: 'Submission received successfully. It will be reviewed by an editor.'
        });

    } catch (error) {
        console.error('Error creating submission:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}
