/**
 * API Route: Get/Update Person by ID
 * GET /api/persons/[personId] - Get person record
 * PUT /api/persons/[personId] - Update person record
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPersonById, updatePerson } from '@/lib/person-database';
import { PersonRecord } from '@/lib/person-schema';

export async function GET(
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
    
    console.log('Fetching person with ID:', personId);
    const person = await getPersonById(personId);
    
    if (!person) {
      console.log('Person not found in database:', personId);
      return NextResponse.json(
        { success: false, error: 'Person not found' },
        { status: 404 }
      );
    }
    
    console.log('Person found:', person.identity?.fullName || 'Unknown');
    
    // Convert Firestore Timestamps to ISO strings for JSON serialization
    // Firestore Timestamps need to be converted before sending to client
    const personForResponse = JSON.parse(JSON.stringify(person, (key, value) => {
      // Convert Firestore Timestamp objects to ISO strings
      if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    }));
    
    return NextResponse.json({
      success: true,
      person: personForResponse
    });
    
  } catch (error) {
    console.error('Error getting person:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  try {
    const { personId } = await params;
    const body = await request.json();
    const userId = body.userId || 'ANONYMOUS';
    
    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    // Remove userId from updates
    const { userId: _, ...updates } = body;
    
    const result = await updatePerson(personId, updates as Partial<PersonRecord>, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Person record updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

