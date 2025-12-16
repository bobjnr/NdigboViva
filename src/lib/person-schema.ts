/**
 * IGBO ANCESTRY NETWORK - COMPREHENSIVE PERSON SCHEMA
 * 
 * This schema implements the complete data structure for individual person records
 * in the Igbo Ancestry Network, covering all 7 critical data layers.
 * 
 * Database: Firebase Firestore
 * Collection: "persons"
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// A) IDENTITY FIELDS
// ============================================================================

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';

export interface IdentityFields {
  // Primary identifier
  personId: string; // Unique ID: "P" + timestamp + random (e.g., "P1734567890_abc123")
  
  // Name information
  fullName: string; // Complete name including baptismal + ancestral
  alternateNames?: string[]; // All spelling variations (Igbo orthography varies)
  
  // Basic demographics
  gender: Gender;
  dateOfBirth?: string; // ISO format or approximate (e.g., "1945", "1945-03", "1945-03-15")
  placeOfBirth?: string; // Town/Village where born
  
  // Visual identification
  photoUrl?: string; // URL to photo (if consent given)
  photoConsent?: boolean; // Explicit consent for photo storage/display
}

// ============================================================================
// B) LINEAGE & FAMILY RELATIONSHIPS
// ============================================================================

export interface LineageFields {
  // Direct family relationships (by Person ID reference)
  fatherId?: string; // Reference to father's personId
  motherId?: string; // Reference to mother's personId
  spouseIds?: string[]; // Array of spouse personIds (polygamy support)
  childrenIds?: string[]; // Array of children personIds
  
  // Igbo lineage structure
  umunna?: string; // Extended family group - most essential Igbo identity unit
  clan?: string; // Clan affiliation
  
  // Multi-level location classification
  village?: string;
  kindred?: string; // Kindred/Hamlet
  town?: string;
  townQuarter?: string; // EZI, etc.
  obiAreas?: string; // AMAMU, etc.
  localGovernmentArea?: string; // LGA
  state?: string;
  senatorialDistrict?: string;
  federalConstituency?: string;
  stateConstituency?: string;
  
  // Maternal lineage tracking
  nwaadaLineageLink?: string; // Maternal village tracking for maternal rights & ties
}

// ============================================================================
// C) CULTURAL & SOCIAL IDENTITY
// ============================================================================

export interface CulturalFields {
  // Titles (defines social status + cultural responsibilities)
  titles?: string[]; // ["OZO", "NZE", "LOLO", "ICHIE", etc.]
  
  // Professional identity
  occupation?: string; // Current or primary occupation
  familyTrade?: string; // Traditional family profession/trade
  
  // Cultural markers
  totem?: string; // Sacred animal/forbidden food
  ancestralHouseName?: string; // Compound name for locational proof
  
  // Achievements
  notableContributions?: string; // Civic achievements, roles, contributions
  roles?: string[]; // ["Community Leader", "Elder", "Chief", etc.]
}

// ============================================================================
// D) LIFE EVENTS
// ============================================================================

export interface LifeEventFields {
  // Marriage
  marriageDate?: string; // ISO format
  marriagePlace?: string; // Location of marriage
  
  // Death
  deathDate?: string; // ISO format or approximate
  deathPlace?: string; // Location of death
  isDeceased?: boolean; // Quick flag for living/deceased status
  
  // Migration
  migrationHistory?: {
    from?: string; // Origin location
    to?: string; // Destination
    date?: string; // When migration occurred
    reason?: string; // Why they migrated
  }[];
  
  // Historical displacement
  displacementNotes?: string; // Slave trade, war displacement, etc.
  sensitiveHistoryPrivate?: boolean; // Flag for private sensitive information
}

// ============================================================================
// E) DOCUMENTATION & SOURCES
// ============================================================================

export type SourceType = 'ORAL' | 'CHURCH_RECORD' | 'PALACE_ARCHIVE' | 'CIVIL_REGISTRY' | 'FAMILY_DOCUMENT' | 'OTHER';

export interface DocumentationFields {
  // Source information
  sourceType?: SourceType; // Reliability level indicator
  sourceDetails?: string; // Additional source information
  
  // Testifiers/Validators
  testifierNames?: string[]; // Names of elders/testifiers who provided information
  testifierContact?: string; // How to reach testifiers for validation
  
  // Document references
  documentScanIds?: string[]; // References to scanned documents
  documentUrls?: string[]; // URLs to document storage
  
  // Narrative
  story?: string; // Family narratives, oral history
  notes?: string; // Additional notes, context
}

// ============================================================================
// F) VERIFICATION STATUS & SECURITY
// ============================================================================

export type VerificationLevel = 0 | 1 | 2 | 3; // 0=Unverified, 1=Basic, 2=Verified, 3=Authoritative
export type VisibilitySetting = 'PUBLIC' | 'PRIVATE' | 'PARTIAL';
export type ValidationAuthority = 'EZE' | 'COUNCIL' | 'CHURCH' | 'FAMILY_ELDER' | 'ADMIN' | 'NONE';

export interface VerificationFields {
  // Verification status
  verificationLevel: VerificationLevel; // Determines what can be publicly displayed
  verified: boolean; // Quick boolean flag
  
  // Privacy controls
  consentStatus: boolean; // Family consent for data storage
  visibilitySetting: VisibilitySetting; // Public/Private/Partial display
  
  // Validation
  validationAuthority?: ValidationAuthority; // Who validated this record
  validatedBy?: string; // Name/ID of validator
  validatedAt?: Timestamp; // When validation occurred
  
  // Data protection
  recordLockDate?: Timestamp; // Prevents unapproved edits after this date
  lockedBy?: string; // Who locked the record
  
  // Audit trail
  createdBy?: string; // User ID who created record
  lastModifiedBy?: string; // User ID who last modified
  editHistory?: {
    editedBy: string;
    editedAt: Timestamp;
    changes: string; // Description of changes
  }[];
}

// ============================================================================
// G) DIASPORA LINK FIELDS
// ============================================================================

export interface DiasporaFields {
  // Diaspora identification
  isDiasporaRelative: boolean; // Flags reconnection potential
  countryOfResidence?: string; // Current country if diaspora
  currentCity?: string; // Current city if diaspora
  currentState?: string; // Current state/province if diaspora
  
  // Connection tracking
  diasporaConnectionCaseId?: string; // Matchmaking process tracking ID
  connectionStatus?: 'PENDING' | 'IN_PROGRESS' | 'CONNECTED' | 'NOT_APPLICABLE';
  
  // Return journey
  returnVisitStatus?: 'PLANNED' | 'COMPLETED' | 'NOT_PLANNED';
  returnVisitDate?: string; // When they visited/plan to visit
  returnVisitNotes?: string; // Experience, reconnection story
}

// ============================================================================
// COMPLETE PERSON RECORD
// ============================================================================

export interface PersonRecord {
  // All 7 data layers
  identity: IdentityFields;
  lineage: LineageFields;
  cultural: CulturalFields;
  lifeEvents: LifeEventFields;
  documentation: DocumentationFields;
  verification: VerificationFields;
  diaspora: DiasporaFields;
  
  // System metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  source: 'FORM_SUBMISSION' | 'MANUAL_ENTRY' | 'IMPORTED' | 'MIGRATED';
  
  // Legacy compatibility (for migration)
  legacyRecordId?: string; // Reference to old GenealogyRecord if migrated
}

// ============================================================================
// HELPER TYPES FOR FORM SUBMISSIONS
// ============================================================================

export interface PersonFormSubmission {
  // Identity
  fullName: string;
  alternateNames?: string[];
  gender: Gender;
  dateOfBirth?: string;
  placeOfBirth?: string;
  photoUrl?: string;
  photoConsent?: boolean;
  
  // Lineage
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  childrenIds?: string[];
  umunna?: string;
  clan?: string;
  village?: string;
  kindred?: string;
  town?: string;
  townQuarter?: string;
  obiAreas?: string;
  localGovernmentArea?: string;
  state?: string;
  nwaadaLineageLink?: string;
  
  // Cultural
  titles?: string[];
  occupation?: string;
  familyTrade?: string;
  totem?: string;
  ancestralHouseName?: string;
  notableContributions?: string;
  roles?: string[];
  
  // Life Events
  marriageDate?: string;
  marriagePlace?: string;
  deathDate?: string;
  deathPlace?: string;
  isDeceased?: boolean;
  migrationHistory?: LifeEventFields['migrationHistory'];
  displacementNotes?: string;
  sensitiveHistoryPrivate?: boolean;
  
  // Documentation
  sourceType?: SourceType;
  sourceDetails?: string;
  testifierNames?: string[];
  testifierContact?: string;
  documentScanIds?: string[];
  documentUrls?: string[];
  story?: string;
  notes?: string;
  
  // Verification (defaults)
  verificationLevel?: VerificationLevel;
  consentStatus: boolean;
  visibilitySetting?: VisibilitySetting;
  
  // Diaspora
  isDiasporaRelative: boolean;
  countryOfResidence?: string;
  currentCity?: string;
  currentState?: string;
  diasporaConnectionCaseId?: string;
  connectionStatus?: DiasporaFields['connectionStatus'];
  returnVisitStatus?: DiasporaFields['returnVisitStatus'];
  returnVisitDate?: string;
  returnVisitNotes?: string;
  
  // Contact (for form submitter)
  submitterEmail?: string;
  submitterPhone?: string;
  submitterRelationship?: string; // Relationship to person being registered
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique Person ID
 */
export function generatePersonId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `P${timestamp}_${random}`;
}

/**
 * Create a new PersonRecord from form submission
 */
export function createPersonFromForm(
  formData: PersonFormSubmission,
  createdBy?: string
): PersonRecord {
  const now = Timestamp.now();
  const personId = generatePersonId();
  
  return {
    identity: {
      personId,
      fullName: formData.fullName.toUpperCase().trim(),
      alternateNames: formData.alternateNames?.map(n => n.toUpperCase().trim()),
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      placeOfBirth: formData.placeOfBirth?.toUpperCase().trim(),
      photoUrl: formData.photoUrl,
      photoConsent: formData.photoConsent || false,
    },
    lineage: {
      fatherId: formData.fatherId,
      motherId: formData.motherId,
      spouseIds: formData.spouseIds,
      childrenIds: formData.childrenIds,
      umunna: formData.umunna?.toUpperCase().trim(),
      clan: formData.clan?.toUpperCase().trim(),
      village: formData.village?.toUpperCase().trim(),
      kindred: formData.kindred?.toUpperCase().trim(),
      town: formData.town?.toUpperCase().trim(),
      townQuarter: formData.townQuarter?.toUpperCase().trim(),
      obiAreas: formData.obiAreas?.toUpperCase().trim(),
      localGovernmentArea: formData.localGovernmentArea?.toUpperCase().trim(),
      state: formData.state?.toUpperCase().trim(),
      nwaadaLineageLink: formData.nwaadaLineageLink?.toUpperCase().trim(),
    },
    cultural: {
      titles: formData.titles?.map(t => t.toUpperCase().trim()),
      occupation: formData.occupation?.trim(),
      familyTrade: formData.familyTrade?.trim(),
      totem: formData.totem?.trim(),
      ancestralHouseName: formData.ancestralHouseName?.trim(),
      notableContributions: formData.notableContributions?.trim(),
      roles: formData.roles?.map(r => r.trim()),
    },
    lifeEvents: {
      marriageDate: formData.marriageDate,
      marriagePlace: formData.marriagePlace?.toUpperCase().trim(),
      deathDate: formData.deathDate,
      deathPlace: formData.deathPlace?.toUpperCase().trim(),
      isDeceased: formData.isDeceased || false,
      migrationHistory: formData.migrationHistory,
      displacementNotes: formData.displacementNotes,
      sensitiveHistoryPrivate: formData.sensitiveHistoryPrivate || false,
    },
    documentation: {
      sourceType: formData.sourceType,
      sourceDetails: formData.sourceDetails?.trim(),
      testifierNames: formData.testifierNames,
      testifierContact: formData.testifierContact?.trim(),
      documentScanIds: formData.documentScanIds,
      documentUrls: formData.documentUrls,
      story: formData.story?.trim(),
      notes: formData.notes?.trim(),
    },
    verification: {
      verificationLevel: formData.verificationLevel || 0,
      verified: (formData.verificationLevel || 0) >= 2,
      consentStatus: formData.consentStatus,
      visibilitySetting: formData.visibilitySetting || 'PRIVATE',
      createdBy,
    },
    diaspora: {
      isDiasporaRelative: formData.isDiasporaRelative,
      countryOfResidence: formData.countryOfResidence?.trim(),
      currentCity: formData.currentCity?.trim(),
      currentState: formData.currentState?.trim(),
      diasporaConnectionCaseId: formData.diasporaConnectionCaseId,
      connectionStatus: formData.connectionStatus || 'NOT_APPLICABLE',
      returnVisitStatus: formData.returnVisitStatus,
      returnVisitDate: formData.returnVisitDate,
      returnVisitNotes: formData.returnVisitNotes?.trim(),
    },
    createdAt: now,
    updatedAt: now,
    source: 'FORM_SUBMISSION',
  };
}

