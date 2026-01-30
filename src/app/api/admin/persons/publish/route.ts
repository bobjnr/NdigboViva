/**
 * API Route: Publish Person Record
 * POST /api/admin/persons/publish
 * 
 * Publishes a sovereign person record to the public index
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishPerson } from '@/lib/person-database';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { personId, publisherId } = body;

        if (!personId) {
            return NextResponse.json(
                { success: false, error: 'Person ID is required' },
                { status: 400 }
            );
        }

        const Result = await publishPerson(personId, publisherId || 'ADMIN');

        if (!Result.success) {
            return NextResponse.json(
                { success: false, error: Result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Person record published successfully'
        });

    } catch (error) {
        console.error('Error publishing person:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}
