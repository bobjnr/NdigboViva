/**
 * API Route: Create Person Record
 * POST /api/persons/create
 * 
 * Creates a new person record in Firestore using the comprehensive schema
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPerson } from '@/lib/person-database';
import { PersonFormSubmission } from '@/lib/person-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      );
    }
    
    if (!body.gender) {
      return NextResponse.json(
        { success: false, error: 'Gender is required' },
        { status: 400 }
      );
    }
    
    if (body.consentStatus === undefined || body.consentStatus === false) {
      return NextResponse.json(
        { success: false, error: 'Consent status must be true to create a record' },
        { status: 400 }
      );
    }
    
    if (body.isDiasporaRelative === undefined) {
      return NextResponse.json(
        { success: false, error: 'Diaspora status is required' },
        { status: 400 }
      );
    }
    
    // Get user ID from session if available (optional for now)
    const userId = body.userId || 'ANONYMOUS';
    
    // Create person record
    const result = await createPerson(body as PersonFormSubmission, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      personId: result.personId,
      message: 'Person record created successfully'
    });
    
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

