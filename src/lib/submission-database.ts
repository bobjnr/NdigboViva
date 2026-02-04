import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
    SubmissionRecord,
    SubmissionStatus,
    generateSubmissionId
} from './submission-schema';
import { PersonFormSubmission } from './person-schema';

const COLLECTION_NAME = 'submissions';

/**
 * Create a new submission
 */
export async function createSubmission(
    formData: PersonFormSubmission
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    try {
        const submissionId = generateSubmissionId();
        const submissionRef = doc(db, COLLECTION_NAME, submissionId);

        // Ensure all undefined/null values are removed or handled before saving
        // Firestore doesn't like 'undefined'
        const cleanData = JSON.parse(JSON.stringify(formData));

        const submission: SubmissionRecord = {
            submissionId,
            data: cleanData,
            status: 'PENDING',
            submittedAt: Timestamp.now(), // Will be overwritten by serverTimestamp in actual write
            updatedAt: Timestamp.now(),
        };

        const firestoreData = {
            ...submission,
            submittedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(submissionRef, firestoreData);

        return { success: true, submissionId };
    } catch (error) {
        console.error('Error creating submission:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Get all submissions (ordered by newest first)
 */
export async function getSubmissions(
    statusFilter?: SubmissionStatus
): Promise<SubmissionRecord[]> {
    try {
        let q;
        const collectionRef = collection(db, COLLECTION_NAME);

        if (statusFilter) {
            q = query(
                collectionRef,
                where('status', '==', statusFilter),
                orderBy('submittedAt', 'desc')
            );
        } else {
            q = query(
                collectionRef,
                orderBy('submittedAt', 'desc')
            );
        }

        const querySnapshot = await getDocs(q);
        const submissions: SubmissionRecord[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            submissions.push({
                ...data,
                submittedAt: data.submittedAt || Timestamp.now(),
                updatedAt: data.updatedAt || Timestamp.now(),
            } as SubmissionRecord);
        });

        return submissions;
    } catch (error) {
        console.error('Error getting submissions:', error);
        return [];
    }
}

/**
 * Get submissions for a specific user by email
 */
export async function getUserSubmissions(email: string): Promise<SubmissionRecord[]> {
    try {
        if (!email) return [];

        const collectionRef = collection(db, COLLECTION_NAME);
        // data.submitterEmail query requires an index on 'data.submitterEmail' and 'submittedAt'
        // If index is missing, this might error. We should try-catch and maybe do client-side filtering if needed strictly,
        // but for now let's assume index can be created or we query just by email if possible.
        // Actually, queried fields in map 'data.submitterEmail' is supported in Firestore.

        const q = query(
            collectionRef,
            where('data.submitterEmail', '==', email),
            orderBy('submittedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const submissions: SubmissionRecord[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            submissions.push({
                ...data,
                submittedAt: data.submittedAt || Timestamp.now(),
                updatedAt: data.updatedAt || Timestamp.now(),
            } as SubmissionRecord);
        });

        return submissions;
    } catch (error) {
        console.error('Error getting user submissions:', error);
        return [];
    }
}

/**
 * Get a single submission by ID
 */
export async function getSubmissionById(submissionId: string): Promise<SubmissionRecord | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, submissionId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        return {
            ...data,
            submittedAt: data.submittedAt || Timestamp.now(),
            updatedAt: data.updatedAt || Timestamp.now(),
        } as SubmissionRecord;
    } catch (error) {
        console.error('Error getting submission:', error);
        return null;
    }
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(
    submissionId: string,
    status: SubmissionStatus,
    reviewerNotes?: string,
    reviewerId?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, COLLECTION_NAME, submissionId);

        const updates: any = {
            status,
            updatedAt: serverTimestamp(),
            reviewedAt: serverTimestamp(),
        };

        if (reviewerNotes) updates.adminNotes = reviewerNotes;
        if (reviewerId) updates.reviewedBy = reviewerId;

        await updateDoc(docRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating submission status:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
