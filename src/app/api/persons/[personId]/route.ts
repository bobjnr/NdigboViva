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
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params;
    
    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    const person = await getPersonById(personId);
    
    if (!person) {
      return NextResponse.json(
        { success: false, error: 'Person not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      person
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
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params;
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

