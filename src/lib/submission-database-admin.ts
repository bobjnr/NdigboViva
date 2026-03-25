/**
 * Submission database operations using Firebase Admin SDK.
 * Use ONLY in API routes (server-side). Bypasses security rules.
 */

import { getAdminFirestore } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { SubmissionRecord, SubmissionStatus } from './submission-schema';

const COLLECTION_NAME = 'submissions';

export async function getSubmissionByIdAdmin(submissionId: string): Promise<SubmissionRecord | null> {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection(COLLECTION_NAME).doc(submissionId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn('[getSubmissionByIdAdmin] Document does not exist', { submissionId, collection: COLLECTION_NAME });
      return null;
    }

    const data = docSnap.data()!;
    return {
      ...data,
      submittedAt: data.submittedAt || { seconds: Date.now() / 1000 },
      updatedAt: data.updatedAt || { seconds: Date.now() / 1000 },
    } as SubmissionRecord;
  } catch (error) {
    console.error('Admin getSubmissionById error:', error);
    return null;
  }
}

export async function updateSubmissionStatusAdmin(
  submissionId: string,
  status: SubmissionStatus,
  reviewerNotes?: string,
  reviewerId?: string,
  convertedPersonId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection(COLLECTION_NAME).doc(submissionId);

    const updates: Record<string, unknown> = {
      status,
      updatedAt: FieldValue.serverTimestamp(),
      reviewedAt: FieldValue.serverTimestamp(),
    };
    if (reviewerNotes) updates.adminNotes = reviewerNotes;
    if (reviewerId) updates.reviewedBy = reviewerId;
    if (convertedPersonId) updates.convertedPersonId = convertedPersonId;

    await docRef.update(updates);
    return { success: true };
  } catch (error) {
    console.error('Admin updateSubmissionStatus error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a submission and keep the database in sync:
 * - If the submission was approved (has convertedPersonId), deletes that person from people and public_persons
 * - Deletes the submission document
 * Use when a user or admin deletes a submission so the record is removed too.
 */
export async function deleteSubmissionAdmin(
  submissionId: string
): Promise<{ success: boolean; deletedPersonId?: string; error?: string }> {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection(COLLECTION_NAME).doc(submissionId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { success: false, error: 'Submission not found' };
    }

    const data = docSnap.data() as SubmissionRecord;
    const convertedPersonId = data.convertedPersonId;

    if (convertedPersonId) {
      const { deletePersonDocumentsAdmin } = await import('./person-database-admin');
      const delResult = await deletePersonDocumentsAdmin(convertedPersonId);
      if (!delResult.success) return { success: false, error: delResult.error };
    }

    await docRef.delete();

    return { success: true, deletedPersonId: convertedPersonId };
  } catch (error) {
    console.error('Admin deleteSubmission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
