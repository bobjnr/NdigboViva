/**
 * SPREADSHEET TO FIREBASE MIGRATION SCRIPT
 * 
 * This script imports data from a CSV file (exported from Excel) into Firebase Firestore.
 * 
 * Usage:
 *   1. Export your Excel file to CSV (UTF-8 encoding)
 *   2. Place the CSV file in the scripts/ directory
 *   3. Run: npx tsx scripts/import-spreadsheet-to-firebase.ts <csv-file-path>
 * 
 * Example:
 *   npx tsx scripts/import-spreadsheet-to-firebase.ts NDIGBO_VIVA_DATABASE_ALL.csv
 */

import * as fs from 'fs';
import * as path from 'path';
import { readFileSync } from 'fs';
import { PersonFormSubmission, Gender, SourceType, VerificationLevel, VisibilitySetting } from '../src/lib/person-schema';
import { createPersonsBatch } from '../src/lib/person-database';

// Column name mappings - handles various possible column name variations
const COLUMN_MAPPINGS: Record<string, keyof PersonFormSubmission> = {
  // Identity fields
  'personid': 'fullName', // Will be auto-generated
  'fullname': 'fullName',
  'name': 'fullName',
  'alternatenames': 'alternateNames',
  'gender': 'gender',
  'dateofbirth': 'dateOfBirth',
  'dob': 'dateOfBirth',
  'birthdate': 'dateOfBirth',
  'placeofbirth': 'placeOfBirth',
  'photourl': 'photoUrl',
  'photoconsent': 'photoConsent',
  
  // Lineage fields
  'fatherid': 'fatherId',
  'motherid': 'motherId',
  'spouseids': 'spouseIds',
  'childrenids': 'childrenIds',
  'umunna': 'umunna',
  'clan': 'clan',
  'village': 'village',
  'kindred': 'kindred',
  'town': 'town',
  'townquarter': 'townQuarter',
  'obiareas': 'obiAreas',
  'localgovernmentarea': 'localGovernmentArea',
  'lga': 'localGovernmentArea',
  'state': 'state',
  'senatorialdistrict': 'senatorialDistrict',
  'federalconstituency': 'federalConstituency',
  'stateconstituency': 'stateConstituency',
  'nwaadalineagelink': 'nwaadaLineageLink',
  
  // Cultural fields
  'titles': 'titles',
  'occupation': 'occupation',
  'familytrade': 'familyTrade',
  'totem': 'totem',
  'ancestralhousename': 'ancestralHouseName',
  'notablecontributions': 'notableContributions',
  'roles': 'roles',
  
  // Life events
  'marriagedate': 'marriageDate',
  'marriageplace': 'marriagePlace',
  'deathdate': 'deathDate',
  'deathplace': 'deathPlace',
  'isdeceased': 'isDeceased',
  'displacementnotes': 'displacementNotes',
  'sensitivehistoryprivate': 'sensitiveHistoryPrivate',
  
  // Documentation
  'sourcetype': 'sourceType',
  'sourcedetails': 'sourceDetails',
  'testifiernames': 'testifierNames',
  'testifiercontact': 'testifierContact',
  'documentscanids': 'documentScanIds',
  'documenturls': 'documentUrls',
  'story': 'story',
  'notes': 'notes',
  
  // Verification
  'verificationlevel': 'verificationLevel',
  'consentstatus': 'consentStatus',
  'visibilitysetting': 'visibilitySetting',
  
  // Diaspora
  'isdiasporarelative': 'isDiasporaRelative',
  'countryofresidence': 'countryOfResidence',
  'currentcity': 'currentCity',
  'currentstate': 'currentState',
  'diasporaconnectioncaseid': 'diasporaConnectionCaseId',
  'connectionstatus': 'connectionStatus',
  'returnvisitstatus': 'returnVisitStatus',
  'returnvisitdate': 'returnVisitDate',
  'returnvisitnotes': 'returnVisitNotes',
};

/**
 * Parse a CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

/**
 * Normalize column names (lowercase, remove spaces/special chars)
 */
function normalizeColumnName(col: string): string {
  return col.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

/**
 * Parse comma-separated string to array
 */
function parseArray(value: string | undefined): string[] | undefined {
  if (!value || typeof value !== 'string') return undefined;
  return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Parse boolean value
 */
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.toString().toUpperCase().trim();
  return normalized === 'TRUE' || normalized === 'YES' || normalized === '1' || normalized === 'T';
}

/**
 * Parse number
 */
function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const num = parseInt(value.toString().trim(), 10);
  return isNaN(num) ? undefined : num;
}

/**
 * Validate and normalize gender
 */
function parseGender(value: string | undefined): Gender {
  if (!value) return 'UNKNOWN';
  const normalized = value.toString().toUpperCase().trim();
  if (['MALE', 'M', 'MALE'].includes(normalized)) return 'MALE';
  if (['FEMALE', 'F', 'FEMALE'].includes(normalized)) return 'FEMALE';
  if (['OTHER', 'O'].includes(normalized)) return 'OTHER';
  return 'UNKNOWN';
}

/**
 * Validate and normalize source type
 */
function parseSourceType(value: string | undefined): SourceType | undefined {
  if (!value) return undefined;
  const normalized = value.toString().toUpperCase().trim();
  const validTypes: SourceType[] = ['ORAL', 'CHURCH_RECORD', 'PALACE_ARCHIVE', 'CIVIL_REGISTRY', 'FAMILY_DOCUMENT', 'OTHER'];
  return validTypes.includes(normalized as SourceType) ? (normalized as SourceType) : 'OTHER';
}

/**
 * Validate and normalize visibility setting
 */
function parseVisibilitySetting(value: string | undefined): VisibilitySetting {
  if (!value) return 'PRIVATE';
  const normalized = value.toString().toUpperCase().trim();
  if (['PUBLIC', 'PARTIAL', 'PRIVATE'].includes(normalized)) {
    return normalized as VisibilitySetting;
  }
  return 'PRIVATE';
}

/**
 * Validate and normalize verification level
 */
function parseVerificationLevel(value: string | undefined): VerificationLevel {
  if (!value) return 0;
  const num = parseNumber(value);
  if (num === undefined) return 0;
  if (num >= 0 && num <= 3) return num as VerificationLevel;
  return 0;
}

/**
 * Convert CSV row to PersonFormSubmission
 */
function csvRowToPersonForm(row: Record<string, string>, rowNumber: number): PersonFormSubmission | null {
  try {
    // Map CSV columns to PersonFormSubmission fields
    const mapped: Partial<PersonFormSubmission> = {};
    
    for (const [csvCol, value] of Object.entries(row)) {
      const normalizedCol = normalizeColumnName(csvCol);
      const fieldName = COLUMN_MAPPINGS[normalizedCol];
      
      if (fieldName && value !== undefined && value !== null && value.toString().trim() !== '') {
        // Handle different field types
        switch (fieldName) {
          case 'alternateNames':
          case 'spouseIds':
          case 'childrenIds':
          case 'titles':
          case 'roles':
          case 'testifierNames':
          case 'documentScanIds':
          case 'documentUrls':
            mapped[fieldName] = parseArray(value);
            break;
            
          case 'photoConsent':
          case 'isDeceased':
          case 'sensitiveHistoryPrivate':
          case 'consentStatus':
          case 'isDiasporaRelative':
            mapped[fieldName] = parseBoolean(value);
            break;
            
          case 'gender':
            mapped[fieldName] = parseGender(value);
            break;
            
          case 'sourceType':
            mapped[fieldName] = parseSourceType(value);
            break;
            
          case 'visibilitySetting':
            mapped[fieldName] = parseVisibilitySetting(value);
            break;
            
          case 'verificationLevel':
            mapped[fieldName] = parseVerificationLevel(value);
            break;
            
          case 'connectionStatus':
            const connStatus = value.toString().toUpperCase().trim();
            if (['PENDING', 'IN_PROGRESS', 'CONNECTED', 'NOT_APPLICABLE'].includes(connStatus)) {
              mapped[fieldName] = connStatus as any;
            }
            break;
            
          case 'returnVisitStatus':
            const visitStatus = value.toString().toUpperCase().trim();
            if (['PLANNED', 'COMPLETED', 'NOT_PLANNED'].includes(visitStatus)) {
              mapped[fieldName] = visitStatus as any;
            }
            break;
            
          default:
            // String fields - just trim
            (mapped as any)[fieldName] = value.toString().trim();
        }
      }
    }
    
    // Validate required fields
    if (!mapped.fullName || mapped.fullName.trim() === '') {
      console.warn(`Row ${rowNumber}: Skipping - missing fullName`);
      return null;
    }
    
    if (!mapped.gender) {
      mapped.gender = 'UNKNOWN';
    }
    
    // Set defaults for required fields
    if (mapped.consentStatus === undefined) {
      mapped.consentStatus = true; // Default to true for migrated data
    }
    
    if (!mapped.visibilitySetting) {
      mapped.visibilitySetting = 'PRIVATE';
    }
    
    if (mapped.isDiasporaRelative === undefined) {
      mapped.isDiasporaRelative = false;
    }
    
    if (!mapped.verificationLevel) {
      mapped.verificationLevel = 0;
    }
    
    return mapped as PersonFormSubmission;
  } catch (error) {
    console.error(`Row ${rowNumber}: Error converting row:`, error);
    return null;
  }
}

/**
 * Main import function
 */
async function importSpreadsheet(csvFilePath: string, createdBy?: string, batchSize: number = 500) {
  console.log('🚀 Starting spreadsheet import...');
  console.log(`📁 File: ${csvFilePath}`);
  
  // Read CSV file
  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`File not found: ${csvFilePath}`);
  }
  
  const csvContent = readFileSync(csvFilePath, 'utf-8');
  
  // Parse CSV (simple CSV parser)
  console.log('📊 Parsing CSV...');
  const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const records: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }
  
  console.log(`✅ Found ${records.length} rows`);
  
  // Convert to PersonFormSubmission
  console.log('🔄 Converting rows to person records...');
  const personForms: PersonFormSubmission[] = [];
  const skipped: number[] = [];
  
  for (let i = 0; i < records.length; i++) {
    const personForm = csvRowToPersonForm(records[i], i + 2); // +2 because row 1 is header, and arrays are 0-indexed
    if (personForm) {
      personForms.push(personForm);
    } else {
      skipped.push(i + 2);
    }
  }
  
  console.log(`✅ Converted ${personForms.length} valid records`);
  if (skipped.length > 0) {
    console.log(`⚠️  Skipped ${skipped.length} invalid rows: ${skipped.slice(0, 10).join(', ')}${skipped.length > 10 ? '...' : ''}`);
  }
  
  // Import in batches (Firestore limit is 500 operations per batch)
  console.log('📤 Importing to Firebase...');
  let totalImported = 0;
  let totalErrors = 0;
  const allErrors: string[] = [];
  
  for (let i = 0; i < personForms.length; i += batchSize) {
    const batch = personForms.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(personForms.length / batchSize);
    
    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);
    
    try {
      const result = await createPersonsBatch(batch, createdBy);
      if (result.success) {
        totalImported += result.created;
        console.log(`✅ Batch ${batchNumber} completed: ${result.created} records imported`);
      } else {
        totalErrors += batch.length;
        allErrors.push(...result.errors);
        console.error(`❌ Batch ${batchNumber} failed:`, result.errors);
      }
    } catch (error) {
      totalErrors += batch.length;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      allErrors.push(`Batch ${batchNumber}: ${errorMsg}`);
      console.error(`❌ Batch ${batchNumber} error:`, errorMsg);
    }
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < personForms.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log('\n📊 Import Summary:');
  console.log(`   Total rows in CSV: ${records.length}`);
  console.log(`   Valid records: ${personForms.length}`);
  console.log(`   Successfully imported: ${totalImported}`);
  console.log(`   Failed: ${totalErrors}`);
  if (allErrors.length > 0) {
    console.log(`\n❌ Errors (first 10):`);
    allErrors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
  }
  
  return {
    totalRows: records.length,
    validRecords: personForms.length,
    imported: totalImported,
    failed: totalErrors,
    errors: allErrors,
  };
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/import-spreadsheet-to-firebase.ts <csv-file-path> [created-by-user-id]');
    console.error('Example: npx tsx scripts/import-spreadsheet-to-firebase.ts NDIGBO_VIVA_DATABASE_ALL.csv');
    process.exit(1);
  }
  
  const csvFilePath = path.resolve(args[0]);
  const createdBy = args[1] || 'migration-script';
  
  importSpreadsheet(csvFilePath, createdBy)
    .then(result => {
      console.log('\n✅ Migration completed!');
      process.exit(result.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}

export { importSpreadsheet, csvRowToPersonForm };

