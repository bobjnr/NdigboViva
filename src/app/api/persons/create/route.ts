/**
 * API Route: Create Person Record
 * POST /api/persons/create
 *
 * Creates a new person record in Firestore and optionally auto-links to existing
 * family by matching father/mother names (and origin when multiple matches exist).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createPersonAdmin,
  findPersonsByFullNameAdmin,
  linkFamilyRelationshipBidirectionalAdmin,
} from '@/lib/person-database-admin';
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

    const userId = body.userId || 'ANONYMOUS';
    const submission = body as PersonFormSubmission;

    // Create person record (Admin so we can run server-side auto-link after)
    const result = await createPersonAdmin(submission, userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    const personId = result.personId!;
    const autoLinked: { father?: boolean; mother?: boolean } = {};

    // Auto-link father when exactly one person matches fatherName (optionally narrow by origin)
    if (submission.fatherName?.trim()) {
      const originTown = submission.originTown || submission.town;
      const originVillage = submission.originVillage || submission.village;
      const fathers = await findPersonsByFullNameAdmin(submission.fatherName.trim(), {
        ...(originTown && { originTown }),
        ...(originVillage && { originVillage }),
      });
      if (fathers.length === 1 && fathers[0].identity.personId !== personId) {
        const linkRes = await linkFamilyRelationshipBidirectionalAdmin(
          personId,
          'father',
          fathers[0].identity.personId
        );
        if (linkRes.success) autoLinked.father = true;
      }
    }

    // Auto-link mother when exactly one person matches motherName (optionally narrow by origin)
    if (submission.motherName?.trim()) {
      const originTown = submission.originTown || submission.town;
      const originVillage = submission.originVillage || submission.village;
      const mothers = await findPersonsByFullNameAdmin(submission.motherName.trim(), {
        ...(originTown && { originTown }),
        ...(originVillage && { originVillage }),
      });
      if (mothers.length === 1 && mothers[0].identity.personId !== personId) {
        const linkRes = await linkFamilyRelationshipBidirectionalAdmin(
          personId,
          'mother',
          mothers[0].identity.personId
        );
        if (linkRes.success) autoLinked.mother = true;
      }
    }

    return NextResponse.json({
      success: true,
      personId,
      message: 'Person record created successfully',
      ...(Object.keys(autoLinked).length > 0 && {
        autoLinked,
        message: `Person record created. ${autoLinked.father ? 'Father' : ''}${autoLinked.father && autoLinked.mother ? ' and ' : ''}${autoLinked.mother ? 'Mother' : ''} linked to existing record(s) in the family tree.`,
      }),
    });
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

