/**
 * Unified Search Service
 * Searches across both submissions and published person records
 */

import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { SubmissionRecord } from './submission-schema';
import { PersonRecord } from './person-schema';

export interface SearchResult {
    id: string;
    fullName: string;
    alternateNames?: string[];
    state?: string;
    lga?: string;
    town?: string;
    village?: string;
    gender?: string;
    isDeceased?: boolean;
    source: 'submission' | 'published';
    status?: string; // For submissions
    submittedAt?: Date;
}

/**
 * Search across both submissions and published records
 */
export async function searchAllRecords(searchTerm: string): Promise<SearchResult[]> {
    console.log('🔍 Search started with term:', searchTerm);

    if (!searchTerm || searchTerm.trim().length === 0) {
        console.log('❌ Empty search term, returning empty results');
        return [];
    }

    const searchUpper = searchTerm.toUpperCase().trim();
    console.log('🔍 Searching for (uppercase):', searchUpper);
    const results: SearchResult[] = [];

    try {
        // 1. Search Submissions (all statuses)
        console.log('📂 Querying submissions collection...');
        const submissionsRef = collection(db, 'submissions');
        const submissionsQuery = query(
            submissionsRef,
            orderBy('submittedAt', 'desc'),
            limit(100)
        );

        const submissionsSnapshot = await getDocs(submissionsQuery);
        console.log(`📊 Found ${submissionsSnapshot.size} total submissions in database`);

        let matchCount = 0;
        submissionsSnapshot.forEach((doc) => {
            const submission = doc.data() as SubmissionRecord;
            const fullName = submission.data.fullName || '';
            const alternateNames = submission.data.alternateNames || [];

            console.log(`  Checking: "${fullName}" (ID: ${submission.submissionId})`);

            // Check if name matches
            const matchesFullName = fullName.toUpperCase().includes(searchUpper);
            const matchesAlternate = alternateNames.some(name =>
                name.toUpperCase().includes(searchUpper)
            );

            if (matchesFullName || matchesAlternate) {
                matchCount++;
                console.log(`  ✅ MATCH FOUND: "${fullName}"`);
                results.push({
                    id: submission.submissionId,
                    fullName: fullName,
                    alternateNames: alternateNames,
                    state: submission.data.state,
                    lga: submission.data.localGovernmentArea,
                    town: submission.data.town,
                    village: submission.data.village,
                    gender: submission.data.gender,
                    isDeceased: submission.data.isDeceased,
                    source: 'submission',
                    status: submission.status,
                    submittedAt: submission.submittedAt?.toDate?.() || new Date(submission.submittedAt.seconds * 1000)
                });
            }
        });

        console.log(`✅ Found ${matchCount} matching submissions out of ${submissionsSnapshot.size} total`);

        // 2. Search Published Records (if they exist)
        try {
            const publicRef = collection(db, 'public_persons');
            const publicQuery = query(
                publicRef,
                where('identity.fullName', '>=', searchUpper),
                where('identity.fullName', '<=', searchUpper + '\uf8ff'),
                limit(50)
            );

            const publicSnapshot = await getDocs(publicQuery);

            publicSnapshot.forEach((doc) => {
                const person = doc.data() as PersonRecord;

                // Avoid duplicates - check if we already have this from submissions
                const alreadyExists = results.some(r =>
                    r.fullName.toUpperCase() === person.identity.fullName.toUpperCase()
                );

                if (!alreadyExists) {
                    results.push({
                        id: person.identity.personId,
                        fullName: person.identity.fullName,
                        alternateNames: person.identity.alternateNames,
                        state: person.lineage.state,
                        lga: person.lineage.localGovernmentArea,
                        town: person.lineage.town,
                        village: person.lineage.village,
                        gender: person.identity.gender,
                        isDeceased: person.lifeEvents.isDeceased,
                        source: 'published'
                    });
                }
            });
        } catch (publicError) {
            console.log('No public records collection or error searching it:', publicError);
            // This is fine - we'll just return submission results
        }

        // Sort by most recent first
        results.sort((a, b) => {
            if (a.submittedAt && b.submittedAt) {
                return b.submittedAt.getTime() - a.submittedAt.getTime();
            }
            return 0;
        });

        console.log(`🎯 Total results to return: ${results.length}`);
        if (results.length > 0) {
            console.log('📋 Results:', results.map(r => r.fullName).join(', '));
        }
        return results;
    } catch (error) {
        console.error('❌ Error searching records:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return [];
    }
}
