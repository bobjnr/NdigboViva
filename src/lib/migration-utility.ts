/**
 * MIGRATION UTILITY
 * 
 * Converts old GenealogyRecord (family-group) format to new PersonRecord format
 * This allows migration of existing data to the new person-centric schema
 */

import { GenealogyRecord } from './genealogy-database';
import { PersonFormSubmission, generatePersonId, Gender } from './person-schema';
import { createPerson } from './person-database';

/**
 * Convert a single GenealogyRecord to one or more PersonFormSubmission records
 * 
 * Since old records contain multiple individuals in extendedFamily arrays,
 * this function creates one person record per individual name found.
 */
export async function migrateGenealogyRecordToPersons(
  oldRecord: GenealogyRecord,
  createdBy?: string
): Promise<{ success: boolean; personIds: string[]; errors: string[] }> {
  const personIds: string[] = [];
  const errors: string[] = [];

  try {
    // Process each family group in the old record
    for (const family of oldRecord.extendedFamily) {
      // Process each individual name in the family
      for (const individualName of family.individualNames) {
        try {
          // Create person form submission from old record data
          const personForm: PersonFormSubmission = {
            // Identity
            fullName: individualName,
            gender: 'UNKNOWN', // Old records don't have gender, default to UNKNOWN
            dateOfBirth: undefined, // Not available in old format
            placeOfBirth: oldRecord.village || oldRecord.town || undefined,
            alternateNames: [], // Could extract from notes if needed

            // Lineage
            umunna: oldRecord.umunna || undefined,
            clan: oldRecord.clan || undefined,
            village: oldRecord.village || undefined,
            kindred: oldRecord.kindredHamlet || undefined,
            town: oldRecord.town || undefined,
            townQuarter: oldRecord.townQuarter || undefined,
            obiAreas: oldRecord.obiAreas || undefined,
            localGovernmentArea: oldRecord.localGovernmentArea || undefined,
            state: oldRecord.state || undefined,
            senatorialDistrict: oldRecord.senatorialDistrict || undefined,
            federalConstituency: oldRecord.federalConstituency || undefined,
            stateConstituency: oldRecord.stateConstituency || undefined,

            // Cultural
            // Not available in old format - leave empty

            // Life Events
            // Not available in old format - leave empty

            // Documentation
            sourceType: mapOldSourceToNew(oldRecord.source),
            sourceDetails: oldRecord.notes || undefined,
            notes: oldRecord.notes || undefined,

            // Verification
            verificationLevel: oldRecord.verified ? 2 : 0,
            consentStatus: true, // Assume consent for migrated records
            visibilitySetting: oldRecord.verified ? 'PARTIAL' : 'PRIVATE',

            // Diaspora
            isDiasporaRelative: false, // Old records don't track this
            connectionStatus: 'NOT_APPLICABLE',
          };

          // Create person record
          const result = await createPerson(personForm, createdBy);

          if (result.success && result.personId) {
            personIds.push(result.personId);
          } else {
            errors.push(`Failed to create person for ${individualName}: ${result.error}`);
          }
        } catch (error) {
          errors.push(
            `Error creating person for ${individualName}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      }
    }

    return {
      success: errors.length === 0,
      personIds,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      personIds,
      errors: [
        ...errors,
        `Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}

/**
 * Map old source type to new SourceType enum
 */
function mapOldSourceToNew(oldSource: string): 'ORAL' | 'CHURCH_RECORD' | 'PALACE_ARCHIVE' | 'CIVIL_REGISTRY' | 'FAMILY_DOCUMENT' | 'OTHER' {
  const upperSource = oldSource.toUpperCase();
  
  if (upperSource.includes('CHURCH')) return 'CHURCH_RECORD';
  if (upperSource.includes('PALACE') || upperSource.includes('ROYAL')) return 'PALACE_ARCHIVE';
  if (upperSource.includes('CIVIL') || upperSource.includes('REGISTRY')) return 'CIVIL_REGISTRY';
  if (upperSource.includes('FAMILY') || upperSource.includes('DOCUMENT')) return 'FAMILY_DOCUMENT';
  if (upperSource.includes('ORAL') || upperSource.includes('STORY')) return 'ORAL';
  
  return 'OTHER';
}

/**
 * Batch migrate multiple old records
 */
export async function batchMigrateGenealogyRecords(
  oldRecords: GenealogyRecord[],
  createdBy?: string
): Promise<{
  success: boolean;
  totalProcessed: number;
  totalPersonsCreated: number;
  errors: string[];
}> {
  let totalPersonsCreated = 0;
  const allErrors: string[] = [];

  for (const oldRecord of oldRecords) {
    const result = await migrateGenealogyRecordToPersons(oldRecord, createdBy);
    totalPersonsCreated += result.personIds.length;
    allErrors.push(...result.errors);
  }

  return {
    success: allErrors.length === 0,
    totalProcessed: oldRecords.length,
    totalPersonsCreated,
    errors: allErrors,
  };
}

/**
 * Create a migration report
 */
export function generateMigrationReport(
  oldRecords: GenealogyRecord[],
  migrationResult: {
    totalProcessed: number;
    totalPersonsCreated: number;
    errors: string[];
  }
): string {
  const report = [
    '=== GENEALOGY RECORD MIGRATION REPORT ===',
    '',
    `Total Old Records Processed: ${migrationResult.totalProcessed}`,
    `Total Person Records Created: ${migrationResult.totalPersonsCreated}`,
    `Errors Encountered: ${migrationResult.errors.length}`,
    '',
  ];

  if (migrationResult.errors.length > 0) {
    report.push('=== ERRORS ===');
    migrationResult.errors.forEach((error, index) => {
      report.push(`${index + 1}. ${error}`);
    });
  }

  // Statistics
  const totalIndividuals = oldRecords.reduce(
    (sum, record) =>
      sum + record.extendedFamily.reduce((familySum, family) => familySum + family.individualNames.length, 0),
    0
  );

  report.push('');
  report.push('=== STATISTICS ===');
  report.push(`Average individuals per old record: ${(totalIndividuals / oldRecords.length).toFixed(2)}`);
  report.push(`Migration success rate: ${((migrationResult.totalPersonsCreated / totalIndividuals) * 100).toFixed(2)}%`);

  return report.join('\n');
}

