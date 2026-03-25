/**
 * Person database operations using Firebase Admin SDK.
 * Use ONLY in API routes (server-side). Bypasses security rules.
 */

import { getAdminFirestore } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { createPersonFromForm } from './person-schema';
import type { PersonRecord, PersonFormSubmission } from './person-schema';

const COLLECTION_NAME = 'people';

type RelationshipType = 'father' | 'mother' | 'spouse' | 'child';
const PUBLIC_COLLECTION_NAME = 'public_persons';

export async function getPersonByIdAdmin(personId: string): Promise<PersonRecord | null> {
  try {
    const db = getAdminFirestore();
    const docSnap = await db.collection(COLLECTION_NAME).doc(personId).get();
    if (!docSnap.exists) return null;
    return docSnap.data() as PersonRecord;
  } catch (error) {
    console.error('Admin getPersonById error:', error);
    return null;
  }
}

export async function createPersonAdmin(
  formData: PersonFormSubmission,
  createdBy?: string
): Promise<{ success: boolean; personId?: string; error?: string }> {
  try {
    const person = createPersonFromForm(formData, createdBy);
    const db = getAdminFirestore();
    const personRef = db.collection(COLLECTION_NAME).doc(person.identity.personId);

    const firestoreData = {
      ...person,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await personRef.set(firestoreData);

    return {
      success: true,
      personId: person.identity.personId,
    };
  } catch (error) {
    console.error('Admin createPerson error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function publishPersonAdmin(
  personId: string,
  publishedBy?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const person = await getPersonByIdAdmin(personId);
    if (!person) return { success: false, error: 'Person not found' };

    if (person.verification.verificationLevel < 2 && person.verification.visibilitySetting !== 'PUBLIC') {
      return { success: false, error: 'Person does not meet verification requirements' };
    }

    const publicData = {
      ...person,
      lineage: {
        ...person.lineage,
      },
      lifeEvents: {
        ...person.lifeEvents,
        sensitiveHistoryPrivate: undefined,
        displacementNotes: person.lifeEvents.sensitiveHistoryPrivate ? undefined : person.lifeEvents.displacementNotes,
      },
      verification: {
        ...person.verification,
        publishedAt: FieldValue.serverTimestamp(),
        publishedBy: publishedBy || 'SYSTEM',
      },
    };

    const db = getAdminFirestore();
    await db.collection(PUBLIC_COLLECTION_NAME).doc(personId).set(publicData);

    return { success: true };
  } catch (error) {
    console.error('Admin publishPerson error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Find persons by exact full name (main collection, for auto-linking).
 * Optionally narrow by origin town/village when multiple matches exist.
 */
export async function findPersonsByFullNameAdmin(
  fullName: string,
  options?: { originTown?: string; originVillage?: string }
): Promise<PersonRecord[]> {
  try {
    const normalized = fullName.trim().toUpperCase();
    if (!normalized) return [];

    const db = getAdminFirestore();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('identity.fullName', '==', normalized)
      .limit(50)
      .get();

    let persons: PersonRecord[] = snapshot.docs.map((d) => d.data() as PersonRecord);

    if (options?.originTown && persons.length > 1) {
      const townUpper = options.originTown.trim().toUpperCase();
      persons = persons.filter(
        (p) => (p.lineage?.town || p.lineage?.originTown || '').toUpperCase() === townUpper
      );
    }
    if (options?.originVillage && persons.length > 1) {
      const villageUpper = options.originVillage.trim().toUpperCase();
      persons = persons.filter(
        (p) => (p.lineage?.village || p.lineage?.originVillage || '').toUpperCase() === villageUpper
      );
    }

    return persons;
  } catch (error) {
    console.error('Admin findPersonsByFullName error:', error);
    return [];
  }
}

/**
 * Link a family relationship (server-side, bypasses rules).
 */
export async function linkFamilyRelationshipAdmin(
  personId: string,
  relationship: RelationshipType,
  relatedPersonId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const person = await getPersonByIdAdmin(personId);
    if (!person) return { success: false, error: 'Person not found' };

    const lineage = person.lineage || {};
    let newLineage: Record<string, unknown> = { ...lineage };

    switch (relationship) {
      case 'father':
        newLineage = { ...lineage, fatherId: relatedPersonId };
        break;
      case 'mother':
        newLineage = { ...lineage, motherId: relatedPersonId };
        break;
      case 'spouse': {
        const spouseIds = Array.isArray(lineage.spouseIds) ? lineage.spouseIds : [];
        if (!spouseIds.includes(relatedPersonId)) {
          newLineage = { ...lineage, spouseIds: [...spouseIds, relatedPersonId] };
        }
        break;
      }
      case 'child': {
        const childrenIds = Array.isArray(lineage.childrenIds) ? lineage.childrenIds : [];
        if (!childrenIds.includes(relatedPersonId)) {
          newLineage = { ...lineage, childrenIds: [...childrenIds, relatedPersonId] };
        }
        break;
      }
    }

    const db = getAdminFirestore();
    const ref = db.collection(COLLECTION_NAME).doc(personId);
    await ref.update({
      lineage: newLineage,
      updatedAt: FieldValue.serverTimestamp(),
      'verification.lastModifiedBy': 'API',
    });

    return { success: true };
  } catch (error) {
    console.error('Admin linkFamilyRelationship error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Link a family relationship and update the related person's lineage (bidirectional).
 * Use this when auto-linking so the family tree stays consistent on both sides.
 */
export async function linkFamilyRelationshipBidirectionalAdmin(
  personId: string,
  relationship: RelationshipType,
  relatedPersonId: string
): Promise<{ success: boolean; error?: string }> {
  const linkResult = await linkFamilyRelationshipAdmin(personId, relationship, relatedPersonId);
  if (!linkResult.success) return linkResult;

  const db = getAdminFirestore();
  const relatedRef = db.collection(COLLECTION_NAME).doc(relatedPersonId);
  const relatedSnap = await relatedRef.get();
  if (!relatedSnap.exists) return { success: true };

  const related = relatedSnap.data() as PersonRecord;
  const lineage = related.lineage || {};
  let updates: Record<string, unknown> = {};

  switch (relationship) {
    case 'father':
    case 'mother': {
      const childrenIds = Array.isArray(lineage.childrenIds) ? lineage.childrenIds : [];
      if (!childrenIds.includes(personId)) {
        updates = {
          lineage: { ...lineage, childrenIds: [...childrenIds, personId] },
        };
      }
      break;
    }
    case 'spouse': {
      const spouseIds = Array.isArray(lineage.spouseIds) ? lineage.spouseIds : [];
      if (!spouseIds.includes(personId)) {
        updates = {
          lineage: { ...lineage, spouseIds: [...spouseIds, personId] },
        };
      }
      break;
    }
    case 'child': {
      const person = await getPersonByIdAdmin(personId);
      if (!person) break;
      const isMale = (person.identity?.gender || '').toUpperCase() === 'MALE';
      if (isMale) {
        updates = { lineage: { ...lineage, fatherId: personId } };
      } else {
        updates = { lineage: { ...lineage, motherId: personId } };
      }
      break;
    }
  }

  if (Object.keys(updates).length > 0) {
    await relatedRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
      'verification.lastModifiedBy': 'API',
    });
  }

  return { success: true };
}

const SUBMISSIONS_COLLECTION = 'submissions';

/**
 * Delete only the person documents (people + public_persons). Does not touch submissions.
 * Used when deleting a submission that had been converted to a person.
 */
export async function deletePersonDocumentsAdmin(personId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getAdminFirestore();
    const personRef = db.collection(COLLECTION_NAME).doc(personId);
    const publicRef = db.collection(PUBLIC_COLLECTION_NAME).doc(personId);

    await personRef.delete();
    await publicRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Admin deletePersonDocuments error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a person record and keep submissions in sync:
 * - Deletes any submission(s) that reference this person (convertedPersonId === personId)
 * - Deletes the person from people and public_persons
 * Use this when an admin deletes a record so the user's submission list stays correct.
 */
export async function deletePersonAdmin(personId: string): Promise<{ success: boolean; deletedSubmissionIds?: string[]; error?: string }> {
  try {
    const db = getAdminFirestore();

    const submissionsSnap = await db
      .collection(SUBMISSIONS_COLLECTION)
      .where('convertedPersonId', '==', personId)
      .get();

    const deletedSubmissionIds: string[] = [];
    for (const docSnap of submissionsSnap.docs) {
      await docSnap.ref.delete();
      deletedSubmissionIds.push(docSnap.id);
    }

    const delResult = await deletePersonDocumentsAdmin(personId);
    if (!delResult.success) return delResult;

    return { success: true, deletedSubmissionIds };
  } catch (error) {
    console.error('Admin deletePerson error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
