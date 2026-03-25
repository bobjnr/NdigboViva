import { Timestamp } from 'firebase/firestore';
import { PersonRecord } from './person-schema';

/**
 * PUBLIC PERSON RECORD
 * 
 * A strict subset of the PersonRecord that is safe for public consumption.
 * Used in the "Mode 1 - Public Search" interface.
 * 
 * Excludes:
 * - Specific living dates (unless deceased)
 * - Sensitive lineage notes
 * - Private contact info
 * - Internal system metadata
 */

export interface PublicPersonRecord {
    identity: {
        personId: string;
        fullName: string;
        alternateNames?: string[];
        gender: PersonRecord['identity']['gender'];
        // We might show year only for public? Keeping simple for now
        dateOfBirth?: string;
        placeOfBirth?: string;
        photoUrl?: string; // Only if consent given
    };

    lineage: {
        // ID references are kept, but might not resolve if the linked person isn't public
        fatherId?: string;
        motherId?: string;
        spouseIds?: string[];
        childrenIds?: string[];

        // Key search fields
        umunna?: string;
        town?: string;
        village?: string;
        state?: string;
    };

    cultural: {
        titles?: string[];
        occupation?: string;
        ancestralHouseName?: string;
    };

    lifeEvents: {
        isDeceased: boolean;
        deathDate?: string;
        deathPlace?: string;
        // Migration history summary?
        migrationHistory?: PersonRecord['lifeEvents']['migrationHistory'];
    };

    verification: {
        verificationLevel: PersonRecord['verification']['verificationLevel'];
        verified: boolean;
        // No private validator names, just status
        publishedAt?: Timestamp;
    };

    // Calculated/Derived fields for UI
    originString: string; // e.g., "Nri, Anambra State"
    registryUrl?: string; // Optional link to view record in official registry (e.g. Gramps Web)
}
