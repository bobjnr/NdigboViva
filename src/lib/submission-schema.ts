import { Timestamp } from 'firebase/firestore';
import { PersonFormSubmission } from './person-schema';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_CLARIFICATION';

export interface SubmissionRecord {
    submissionId: string;
    data: PersonFormSubmission;
    status: SubmissionStatus;

    // Submission Metadata
    submittedAt: Timestamp;
    updatedAt: Timestamp;
    reviewedAt?: Timestamp;
    reviewedBy?: string;
    rejectionReason?: string;
    adminNotes?: string;

    // Tracking
    convertedPersonId?: string; // ID of the PersonRecord created from this submission
}

export function generateSubmissionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `SUB${timestamp}_${random}`;
}
