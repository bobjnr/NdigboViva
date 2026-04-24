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

  // DNA/Medical information
  genotype?: string; // e.g., AA, AS, SS
  bloodGroup?: string; // e.g., O+, A-, B+

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
  fatherName?: string; // Name of father (if ID not known)
  motherName?: string; // Name of mother (if ID not known)

  // ORIGIN INFORMATION - Complete hierarchical location structure
  // Geographic hierarchy (largest to smallest)
  originContinent?: string; // e.g., AFRICA
  originSubContinent?: string; // e.g., WEST AFRICA
  originSubRegion?: string; // Sub-region within sub-continent
  originNationality?: string; // Country, e.g., NIGERIA
  originRegion?: string; // Geographic region, e.g., SOUTH-EAST
  originState?: string; // State
  originSenatorialDistrict?: string; // Senatorial district
  originFederalConstituency?: string; // Federal constituency
  originLocalGovernmentArea?: string; // LGA
  originStateConstituency?: string; // State constituency
  originTown?: string; // Town
  originTownDivision?: string; // Town division/section
  originTownLevel1?: string;
  originTownLevel2?: string;
  originTownLevel3?: string;
  originTownLevel4?: string;
  originWard?: string; // Political ward (e.g. Ward 1)
  originTownQuarter?: string; // Town quarter (EZI, etc.)

  // Origin ontology IDs (immutable; stored with submission for registry consistency)
  originContinentId?: string; // CT-*
  originSubContinentId?: string; // SC-*
  originCountryId?: string; // CO-*
  originRegionId?: string; // NR-*
  originStateId?: string; // ST-*
  originSenatorialZoneId?: string; // SZ-*
  originLgaId?: string; // LGA-*
  originFederalConstituencyId?: string; // FC-*
  originStateConstituencyId?: string; // SC-*
  originWardId?: string; // WD-*
  originTownId?: string; // TW-*
  originClanId?: string; // CL-*
  originTownLevel1Id?: string; // TL1-*
  originTownLevel2Id?: string; // TL2-*
  originTownLevel3Id?: string; // TL3-*
  originTownLevel4Id?: string; // TL4-*
  originVillageId?: string; // VL-*
  originHamletId?: string; // HM-*
  originLineageId?: string; // LN-*
  originKindredId?: string; // KD-*
  originExtendedFamilyId?: string; // EF-*
  originNuclearFamilyId?: string; // NF-*

  // Cultural/lineage hierarchy (largest to smallest)
  originClan?: string; // Clan affiliation
  originVillage?: string; // Village
  originHamlet?: string; // Hamlet/sub-village
  originKindred?: string; // Kindred
  originUmunna?: string; // Extended family group - most essential Igbo identity unit

  // Legacy fields (for backward compatibility)
  umunna?: string; // Maps to originUmunna
  clan?: string; // Maps to originClan
  village?: string; // Maps to originVillage
  kindred?: string; // Maps to originKindred
  town?: string; // Maps to originTown
  townQuarter?: string; // Maps to originTownQuarter
  obiAreas?: string; // AMAMU, etc.
  localGovernmentArea?: string; // Maps to originLocalGovernmentArea
  state?: string; // Maps to originState
  region?: string; // Maps to originRegion
  subRegion?: string; // Maps to originSubRegion
  senatorialDistrict?: string; // Maps to originSenatorialDistrict
  federalConstituency?: string; // Maps to originFederalConstituency
  stateConstituency?: string; // Maps to originStateConstituency

  // Maternal lineage tracking
  nwaadaLineageLink?: string; // Maternal village tracking for maternal rights & ties

  // ORIGIN BRANCHING & DIASPORA ORIGIN
  originType?: 'DIRECT_NIGERIA' | 'DIASPORA_KNOWN' | 'DIASPORA_UNKNOWN' | 'MIXED';
  generationalDepth?: string;
  associatedEthnicIdentity?: string;
  migrationPathNarrative?: string;
  speaksIgbo?: boolean;
  speaksEthnicLanguage?: boolean;
  hasVisitedNigeria?: boolean;
  knowsAncestralTown?: boolean;
  
  // Ancestral Location (Non-Nigerian roots)
  ancestralCountry?: string;
  ancestralCountryId?: string;
  ancestralRegion?: string;
  ancestralRegionId?: string;
  ancestralDistrict?: string;
  ancestralDistrictId?: string;
  ancestralTown?: string;
  ancestralTownId?: string;
  
  selfDeclaredEthnicIdentity?: string; // Igbo, Igbo-descendant, Mixed (Igbo + other), Not sure
  familyMigrationPath?: string;
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
  ethnicity?: string; // Ethnic identity (e.g., Igbo, Yoruba, Hausa, etc.)
  totem?: string; // Sacred animal/forbidden food
  ancestralHouseName?: string; // Compound name for locational proof
  language?: string; // Primary language(s) spoken

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

  // Other significant life events
  otherLifeEvents?: {
    eventName?: string; // Name of the event (e.g., "Graduation", "Coronation", "Initiation")
    eventDate?: string; // When the event occurred
    eventPlace?: string; // Where the event occurred
    eventDescription?: string; // Description of the event
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
  year?: string; // Year of the source/documentation

  // Testifiers/Validators
  testifierNames?: string[]; // Names of elders/testifiers who provided information
  testifierContact?: string; // How to reach testifiers for validation

  // Document references
  documentScanIds?: string[]; // References to scanned documents
  documentUrls?: string[]; // URLs to document storage

  // Narrative
  story?: string; // Family narratives, oral history
  notes?: string; // Additional notes, context

  // Optional Document Uploads (legacy; uploads no longer used in form)
  birthCertificateUrl?: string;
  ninUrl?: string; // National Identification Number
  nationalIdentityCardUrl?: string;
  internationalPassportUrl?: string;
  personalBankAccountUrl?: string;
  votersCardUrl?: string;
  driversLicenseUrl?: string;
  taxIdentificationNumberUrl?: string;
  bvnUrl?: string; // Bank Verification Number

  // Identity documents the person has (ticked in form; no upload)
  identityDocumentsHeld?: string[]; // e.g. ['birthCertificate', 'nin', 'internationalPassport']
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

  // CURRENT/DIASPORA LOCATION - Complete hierarchical structure
  // Geographic hierarchy (largest to smallest)
  currentContinent?: string; // e.g., NORTH AMERICA, EUROPE
  currentSubContinent?: string; // e.g., WEST AFRICA, CARIBBEAN
  currentSubRegion?: string; // Sub-region within sub-continent
  currentNationality?: string; // Current nationality
  currentCountry?: string; // Current country of residence
  currentRegion?: string; // Geographic region within country
  currentState?: string; // Current state/province
  currentSenatorialDistrict?: string; // Senatorial district (if applicable)
  currentFederalConstituency?: string; // Federal constituency (if applicable)
  currentLocalGovernmentArea?: string; // LGA (if applicable)
  currentStateConstituency?: string; // State constituency (if applicable)
  currentTown?: string; // Current town/city
  currentTownDivision?: string; // Town division
  currentTownQuarter?: string; // Town quarter
  currentPoliticalWard?: string; // Political ward (for Nigeria)
  currentIgboOrganizations?: string; // Igbo organizations (for Diaspora/Nigeria)
  citizenshipStatus?: string; // Citizenship status (for Diaspora)

  // Cultural/community hierarchy in current location
  currentClan?: string; // Clan affiliation in current location
  currentVillage?: string; // Village/neighborhood
  currentHamlet?: string; // Hamlet
  currentKindred?: string; // Kindred
  currentUmunna?: string; // Umunna in diaspora

  // Legacy fields (for backward compatibility)
  subContinent?: string; // Maps to currentSubContinent
  countryOfResidence?: string; // Maps to currentNationality
  currentCity?: string; // Maps to currentTown

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

  // Official registry (e.g. Gramps Web) – set after export so users can "View in registry"
  registryUrl?: string; // e.g. https://your-gramps.instance/person/{handle}
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
  genotype?: string;
  bloodGroup?: string;

  // Lineage - Family Relationships
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  childrenIds?: string[];
  fatherName?: string;
  motherName?: string;
  nwaadaLineageLink?: string;

  // ORIGIN INFORMATION - Complete hierarchy
  originContinent?: string;
  originSubContinent?: string;
  originSubRegion?: string;
  originNationality?: string;
  originRegion?: string;
  originState?: string;
  originSenatorialDistrict?: string;
  originFederalConstituency?: string;
  originLocalGovernmentArea?: string;
  originStateConstituency?: string;
  originTown?: string;
  originTownDivision?: string; // Kept for backward compatibility
  originTownLevel1?: string;
  originTownLevel2?: string;
  originTownLevel3?: string;
  originTownLevel4?: string;
  originWard?: string;
  originTownQuarter?: string;
  originClan?: string;
  originVillage?: string;
  originHamlet?: string;
  originKindred?: string;
  originUmunna?: string;

  // Origin ontology IDs (optional; set when form uses registry dropdowns)
  originContinentId?: string;
  originSubContinentId?: string;
  originCountryId?: string;
  originRegionId?: string;
  originStateId?: string;
  originSenatorialZoneId?: string;
  originLgaId?: string;
  originFederalConstituencyId?: string;
  originStateConstituencyId?: string;
  originWardId?: string;
  originTownId?: string;
  originClanId?: string;
  originTownLevel1Id?: string;
  originTownLevel2Id?: string;
  originTownLevel3Id?: string;
  originTownLevel4Id?: string;
  originVillageId?: string;
  originHamletId?: string;
  originLineageId?: string;
  originKindredId?: string;
  originExtendedFamilyId?: string;
  originNuclearFamilyId?: string;

  // Legacy lineage fields (for backward compatibility)
  umunna?: string;
  clan?: string;
  village?: string;
  kindred?: string;
  town?: string;
  townQuarter?: string;
  obiAreas?: string;
  localGovernmentArea?: string;
  state?: string;
  region?: string;
  subRegion?: string;
  senatorialDistrict?: string;
  federalConstituency?: string;
  stateConstituency?: string;

  // Cultural
  titles?: string[];
  occupation?: string;
  familyTrade?: string;
  ethnicity?: string;
  totem?: string;
  ancestralHouseName?: string;
  language?: string;
  notableContributions?: string;
  roles?: string[];

  // Life Events
  marriageDate?: string;
  marriagePlace?: string;
  deathDate?: string;
  deathPlace?: string;
  isDeceased?: boolean;
  migrationHistory?: LifeEventFields['migrationHistory'];
  otherLifeEvents?: LifeEventFields['otherLifeEvents'];
  displacementNotes?: string;
  sensitiveHistoryPrivate?: boolean;

  // Documentation
  sourceType?: SourceType;
  sourceDetails?: string;
  year?: string;
  testifierNames?: string[];
  testifierContact?: string;
  documentScanIds?: string[];
  documentUrls?: string[];

  // Specific Document Uploads (legacy)
  birthCertificateUrl?: string;
  ninUrl?: string;
  nationalIdentityCardUrl?: string;
  internationalPassportUrl?: string;
  personalBankAccountUrl?: string;
  votersCardUrl?: string;
  driversLicenseUrl?: string;
  taxIdentificationNumberUrl?: string;
  bvnUrl?: string;

  // Identity documents the person has (checkboxes in form)
  identityDocumentsHeld?: string[];

  story?: string;
  notes?: string;

  // Verification (defaults)
  verificationLevel?: VerificationLevel;
  consentStatus: boolean;
  visibilitySetting?: VisibilitySetting;

  // CURRENT/DIASPORA LOCATION - Complete hierarchy
  isDiasporaRelative: boolean;
  currentContinent?: string;
  currentSubContinent?: string;
  currentSubRegion?: string;
  currentNationality?: string;
  currentCountry?: string;
  currentRegion?: string;
  currentState?: string;
  currentSenatorialDistrict?: string;
  currentFederalConstituency?: string;
  currentLocalGovernmentArea?: string;
  currentStateConstituency?: string;
  currentTown?: string;
  currentTownDivision?: string;
  currentTownQuarter?: string;
  currentPoliticalWard?: string;
  currentIgboOrganizations?: string;
  citizenshipStatus?: string;
  currentClan?: string;
  currentVillage?: string;
  currentHamlet?: string;
  currentKindred?: string;
  currentUmunna?: string;

  // Origin Branching & Diaspora Origin
  originType?: 'DIRECT_NIGERIA' | 'DIASPORA_KNOWN' | 'DIASPORA_UNKNOWN' | 'MIXED';
  generationalDepth?: string;
  associatedEthnicIdentity?: string;
  migrationPathNarrative?: string;
  speaksIgbo?: boolean;
  speaksEthnicLanguage?: boolean;
  hasVisitedNigeria?: boolean;
  knowsAncestralTown?: boolean;
  
  ancestralCountry?: string;
  ancestralCountryId?: string;
  ancestralRegion?: string;
  ancestralRegionId?: string;
  ancestralDistrict?: string;
  ancestralDistrictId?: string;
  ancestralTown?: string;
  ancestralTownId?: string;
  
  selfDeclaredEthnicIdentity?: string;
  familyMigrationPath?: string;

  // Legacy diaspora fields (for backward compatibility)
  subContinent?: string;
  countryOfResidence?: string;
  currentCity?: string;

  // Connection tracking
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

  // Helper function to remove undefined and empty array values
  const cleanForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return undefined;
    }
    if (Array.isArray(obj)) {
      return obj.length > 0 ? obj : undefined;
    }
    if (typeof obj === 'object' && !(obj instanceof Timestamp)) {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = cleanForFirestore(value);
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    return obj;
  };

  const record = {
    identity: {
      personId,
      fullName: formData.fullName.toUpperCase().trim(),
      ...(formData.alternateNames && formData.alternateNames.length > 0 && {
        alternateNames: formData.alternateNames.map(n => n.toUpperCase().trim())
      }),
      gender: formData.gender,
      ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
      ...(formData.placeOfBirth && { placeOfBirth: formData.placeOfBirth.toUpperCase().trim() }),
      ...(formData.photoUrl && { photoUrl: formData.photoUrl }),
      photoConsent: formData.photoConsent || false,
      ...(formData.genotype && { genotype: formData.genotype.toUpperCase().trim() }),
      ...(formData.bloodGroup && { bloodGroup: formData.bloodGroup.toUpperCase().trim() }),
    },
    lineage: {
      // Family relationships
      ...(formData.fatherId && { fatherId: formData.fatherId }),
      ...(formData.motherId && { motherId: formData.motherId }),
      ...(formData.spouseIds && formData.spouseIds.length > 0 && { spouseIds: formData.spouseIds }),
      ...(formData.childrenIds && formData.childrenIds.length > 0 && { childrenIds: formData.childrenIds }),
      ...(formData.fatherName && { fatherName: formData.fatherName.toUpperCase().trim() }),
      ...(formData.motherName && { motherName: formData.motherName.toUpperCase().trim() }),
      ...(formData.nwaadaLineageLink && { nwaadaLineageLink: formData.nwaadaLineageLink.toUpperCase().trim() }),

      // ORIGIN INFORMATION - New hierarchical fields
      ...(formData.originContinent && { originContinent: formData.originContinent.toUpperCase().trim() }),
      ...(formData.originSubContinent && { originSubContinent: formData.originSubContinent.toUpperCase().trim() }),
      ...(formData.originSubRegion && { originSubRegion: formData.originSubRegion.toUpperCase().trim() }),
      ...(formData.originNationality && { originNationality: formData.originNationality.toUpperCase().trim() }),
      ...(formData.originRegion && { originRegion: formData.originRegion.toUpperCase().trim() }),
      ...(formData.originState && { originState: formData.originState.toUpperCase().trim() }),
      ...(formData.originSenatorialDistrict && { originSenatorialDistrict: formData.originSenatorialDistrict.toUpperCase().trim() }),
      ...(formData.originFederalConstituency && { originFederalConstituency: formData.originFederalConstituency.toUpperCase().trim() }),
      ...(formData.originLocalGovernmentArea && { originLocalGovernmentArea: formData.originLocalGovernmentArea.toUpperCase().trim() }),
      ...(formData.originStateConstituency && { originStateConstituency: formData.originStateConstituency.toUpperCase().trim() }),
      ...(formData.originTown && { originTown: formData.originTown.toUpperCase().trim() }),
      ...(formData.originTown && { originTown: formData.originTown.toUpperCase().trim() }),
      ...(formData.originTownDivision && { originTownDivision: formData.originTownDivision.toUpperCase().trim() }),
      ...(formData.originTownLevel1 && { originTownLevel1: formData.originTownLevel1.toUpperCase().trim() }),
      ...(formData.originTownLevel2 && { originTownLevel2: formData.originTownLevel2.toUpperCase().trim() }),
      ...(formData.originTownLevel3 && { originTownLevel3: formData.originTownLevel3.toUpperCase().trim() }),
      ...(formData.originTownLevel4 && { originTownLevel4: formData.originTownLevel4.toUpperCase().trim() }),
      ...(formData.originWard && { originWard: formData.originWard.toUpperCase().trim() }),
      ...(formData.originTownQuarter && { originTownQuarter: formData.originTownQuarter.toUpperCase().trim() }),
      ...(formData.originClan && { originClan: formData.originClan.toUpperCase().trim() }),
      ...(formData.originVillage && { originVillage: formData.originVillage.toUpperCase().trim() }),
      ...(formData.originHamlet && { originHamlet: formData.originHamlet.toUpperCase().trim() }),
      ...(formData.originKindred && { originKindred: formData.originKindred.toUpperCase().trim() }),
      ...(formData.originUmunna && { originUmunna: formData.originUmunna.toUpperCase().trim() }),
      
      // ORIGIN BRANCHING & DIASPORA ORIGIN
      ...(formData.originType && { originType: formData.originType }),
      ...(formData.generationalDepth && { generationalDepth: formData.generationalDepth.toUpperCase().trim() }),
      ...(formData.associatedEthnicIdentity && { associatedEthnicIdentity: formData.associatedEthnicIdentity.toUpperCase().trim() }),
      ...(formData.migrationPathNarrative && { migrationPathNarrative: formData.migrationPathNarrative.trim() }),
      ...(formData.speaksIgbo !== undefined && { speaksIgbo: formData.speaksIgbo }),
      ...(formData.speaksEthnicLanguage !== undefined && { speaksEthnicLanguage: formData.speaksEthnicLanguage }),
      ...(formData.hasVisitedNigeria !== undefined && { hasVisitedNigeria: formData.hasVisitedNigeria }),
      ...(formData.knowsAncestralTown !== undefined && { knowsAncestralTown: formData.knowsAncestralTown }),
      ...(formData.ancestralCountry && { ancestralCountry: formData.ancestralCountry.toUpperCase().trim() }),
      ...(formData.ancestralCountryId && { ancestralCountryId: formData.ancestralCountryId }),
      ...(formData.ancestralRegion && { ancestralRegion: formData.ancestralRegion.toUpperCase().trim() }),
      ...(formData.ancestralRegionId && { ancestralRegionId: formData.ancestralRegionId }),
      ...(formData.ancestralDistrict && { ancestralDistrict: formData.ancestralDistrict.toUpperCase().trim() }),
      ...(formData.ancestralDistrictId && { ancestralDistrictId: formData.ancestralDistrictId }),
      ...(formData.ancestralTown && { ancestralTown: formData.ancestralTown.toUpperCase().trim() }),
      ...(formData.ancestralTownId && { ancestralTownId: formData.ancestralTownId }),
      ...(formData.selfDeclaredEthnicIdentity && { selfDeclaredEthnicIdentity: formData.selfDeclaredEthnicIdentity.toUpperCase().trim() }),
      ...(formData.familyMigrationPath && { familyMigrationPath: formData.familyMigrationPath.trim() }),

      // Origin ontology IDs (immutable registry references)
      ...(formData.originContinentId && { originContinentId: formData.originContinentId }),
      ...(formData.originSubContinentId && { originSubContinentId: formData.originSubContinentId }),
      ...(formData.originCountryId && { originCountryId: formData.originCountryId }),
      ...(formData.originRegionId && { originRegionId: formData.originRegionId }),
      ...(formData.originStateId && { originStateId: formData.originStateId }),
      ...(formData.originSenatorialZoneId && { originSenatorialZoneId: formData.originSenatorialZoneId }),
      ...(formData.originLgaId && { originLgaId: formData.originLgaId }),
      ...(formData.originFederalConstituencyId && { originFederalConstituencyId: formData.originFederalConstituencyId }),
      ...(formData.originStateConstituencyId && { originStateConstituencyId: formData.originStateConstituencyId }),
      ...(formData.originWardId && { originWardId: formData.originWardId }),
      ...(formData.originTownId && { originTownId: formData.originTownId }),
      ...(formData.originClanId && { originClanId: formData.originClanId }),
      ...(formData.originTownLevel1Id && { originTownLevel1Id: formData.originTownLevel1Id }),
      ...(formData.originTownLevel2Id && { originTownLevel2Id: formData.originTownLevel2Id }),
      ...(formData.originTownLevel3Id && { originTownLevel3Id: formData.originTownLevel3Id }),
      ...(formData.originTownLevel4Id && { originTownLevel4Id: formData.originTownLevel4Id }),
      ...(formData.originVillageId && { originVillageId: formData.originVillageId }),
      ...(formData.originHamletId && { originHamletId: formData.originHamletId }),
      ...(formData.originLineageId && { originLineageId: formData.originLineageId }),
      ...(formData.originKindredId && { originKindredId: formData.originKindredId }),
      ...(formData.originExtendedFamilyId && { originExtendedFamilyId: formData.originExtendedFamilyId }),
      ...(formData.originNuclearFamilyId && { originNuclearFamilyId: formData.originNuclearFamilyId }),

      // Legacy fields (for backward compatibility)
      umunna: (formData.umunna || formData.originUmunna || '').toUpperCase().trim(),
      clan: (formData.clan || formData.originClan || '').toUpperCase().trim(),
      village: (formData.village || formData.originVillage || '').toUpperCase().trim(),
      kindred: (formData.kindred || formData.originKindred || '').toUpperCase().trim(),
      town: (formData.town || formData.originTown || '').toUpperCase().trim(),
      townQuarter: (formData.townQuarter || formData.originTownQuarter || '').toUpperCase().trim(),
      ...(formData.obiAreas && { obiAreas: formData.obiAreas.toUpperCase().trim() }),
      localGovernmentArea: (formData.localGovernmentArea || formData.originLocalGovernmentArea || '').toUpperCase().trim(),
      state: (formData.state || formData.originState || '').toUpperCase().trim(),
      region: (formData.region || formData.originRegion || '').toUpperCase().trim(),
      subRegion: (formData.subRegion || formData.originSubRegion || '').toUpperCase().trim(),
      senatorialDistrict: (formData.senatorialDistrict || formData.originSenatorialDistrict || '').toUpperCase().trim(),
      federalConstituency: (formData.federalConstituency || formData.originFederalConstituency || '').toUpperCase().trim(),
      stateConstituency: (formData.stateConstituency || formData.originStateConstituency || '').toUpperCase().trim(),
    },
    cultural: {
      ...(formData.titles && formData.titles.length > 0 && {
        titles: formData.titles.map(t => t.toUpperCase().trim())
      }),
      ...(formData.occupation && { occupation: formData.occupation.trim() }),
      ...(formData.familyTrade && { familyTrade: formData.familyTrade.trim() }),
      ...(formData.ethnicity && { ethnicity: formData.ethnicity.trim() }),
      ...(formData.totem && { totem: formData.totem.trim() }),
      ...(formData.ancestralHouseName && { ancestralHouseName: formData.ancestralHouseName.trim() }),
      ...(formData.language && { language: formData.language.trim() }),
      ...(formData.notableContributions && { notableContributions: formData.notableContributions.trim() }),
      ...(formData.roles && formData.roles.length > 0 && {
        roles: formData.roles.map(r => r.trim())
      }),
    },
    lifeEvents: {
      ...(formData.marriageDate && { marriageDate: formData.marriageDate }),
      ...(formData.marriagePlace && { marriagePlace: formData.marriagePlace.toUpperCase().trim() }),
      ...(formData.deathDate && { deathDate: formData.deathDate }),
      ...(formData.deathPlace && { deathPlace: formData.deathPlace.toUpperCase().trim() }),
      isDeceased: formData.isDeceased || false,
      ...(formData.migrationHistory && formData.migrationHistory.length > 0 && {
        migrationHistory: formData.migrationHistory
      }),
      ...(formData.otherLifeEvents && formData.otherLifeEvents.length > 0 && {
        otherLifeEvents: formData.otherLifeEvents
      }),
      ...(formData.displacementNotes && { displacementNotes: formData.displacementNotes }),
      sensitiveHistoryPrivate: formData.sensitiveHistoryPrivate || false,
    },
    documentation: {
      ...(formData.sourceType && { sourceType: formData.sourceType }),
      ...(formData.sourceDetails && { sourceDetails: formData.sourceDetails.trim() }),
      ...(formData.year && { year: formData.year.trim() }),
      ...(formData.testifierNames && formData.testifierNames.length > 0 && {
        testifierNames: formData.testifierNames
      }),
      ...(formData.testifierContact && { testifierContact: formData.testifierContact.trim() }),
      ...(formData.documentScanIds && formData.documentScanIds.length > 0 && {
        documentScanIds: formData.documentScanIds
      }),
      ...(formData.documentUrls && formData.documentUrls.length > 0 && {
        documentUrls: formData.documentUrls
      }),

      // Map specific document uploads
      ...(formData.birthCertificateUrl && { birthCertificateUrl: formData.birthCertificateUrl }),
      ...(formData.ninUrl && { ninUrl: formData.ninUrl }),
      ...(formData.nationalIdentityCardUrl && { nationalIdentityCardUrl: formData.nationalIdentityCardUrl }),
      ...(formData.internationalPassportUrl && { internationalPassportUrl: formData.internationalPassportUrl }),
      ...(formData.personalBankAccountUrl && { personalBankAccountUrl: formData.personalBankAccountUrl }),
      ...(formData.votersCardUrl && { votersCardUrl: formData.votersCardUrl }),
      ...(formData.driversLicenseUrl && { driversLicenseUrl: formData.driversLicenseUrl }),
      ...(formData.taxIdentificationNumberUrl && { taxIdentificationNumberUrl: formData.taxIdentificationNumberUrl }),
      ...(formData.bvnUrl && { bvnUrl: formData.bvnUrl }),
      ...(formData.identityDocumentsHeld && formData.identityDocumentsHeld.length > 0 && {
        identityDocumentsHeld: formData.identityDocumentsHeld
      }),

      ...(formData.story && { story: formData.story.trim() }),
      ...(formData.notes && { notes: formData.notes.trim() }),
    },
    verification: {
      verificationLevel: formData.verificationLevel || 0,
      verified: (formData.verificationLevel || 0) >= 2,
      consentStatus: formData.consentStatus,
      visibilitySetting: formData.visibilitySetting || 'PRIVATE',
      ...(createdBy && { createdBy }),
    },
    diaspora: {
      isDiasporaRelative: formData.isDiasporaRelative,

      // CURRENT/DIASPORA LOCATION - New hierarchical fields
      ...(formData.currentContinent && { currentContinent: formData.currentContinent.toUpperCase().trim() }),
      ...(formData.currentSubContinent && { currentSubContinent: formData.currentSubContinent.toUpperCase().trim() }),
      ...(formData.currentSubRegion && { currentSubRegion: formData.currentSubRegion.toUpperCase().trim() }),
      ...(formData.currentNationality && { currentNationality: formData.currentNationality.toUpperCase().trim() }),
      ...(formData.currentCountry && { currentCountry: formData.currentCountry.toUpperCase().trim() }),
      ...(formData.currentRegion && { currentRegion: formData.currentRegion.toUpperCase().trim() }),
      ...(formData.currentState && { currentState: formData.currentState.toUpperCase().trim() }),
      ...(formData.currentSenatorialDistrict && { currentSenatorialDistrict: formData.currentSenatorialDistrict.toUpperCase().trim() }),
      ...(formData.currentFederalConstituency && { currentFederalConstituency: formData.currentFederalConstituency.toUpperCase().trim() }),
      ...(formData.currentLocalGovernmentArea && { currentLocalGovernmentArea: formData.currentLocalGovernmentArea.toUpperCase().trim() }),
      ...(formData.currentStateConstituency && { currentStateConstituency: formData.currentStateConstituency.toUpperCase().trim() }),
      ...(formData.currentTown && { currentTown: formData.currentTown.toUpperCase().trim() }),
      ...(formData.currentTownDivision && { currentTownDivision: formData.currentTownDivision.toUpperCase().trim() }),
      ...(formData.currentTownQuarter && { currentTownQuarter: formData.currentTownQuarter.toUpperCase().trim() }),
      ...(formData.currentPoliticalWard && { currentPoliticalWard: formData.currentPoliticalWard.toUpperCase().trim() }),
      ...(formData.currentIgboOrganizations && { currentIgboOrganizations: formData.currentIgboOrganizations.trim() }),
      ...(formData.citizenshipStatus && { citizenshipStatus: formData.citizenshipStatus.toUpperCase().trim() }),
      ...(formData.currentClan && { currentClan: formData.currentClan.toUpperCase().trim() }),
      ...(formData.currentVillage && { currentVillage: formData.currentVillage.toUpperCase().trim() }),
      ...(formData.currentHamlet && { currentHamlet: formData.currentHamlet.toUpperCase().trim() }),
      ...(formData.currentKindred && { currentKindred: formData.currentKindred.toUpperCase().trim() }),
      ...(formData.currentUmunna && { currentUmunna: formData.currentUmunna.toUpperCase().trim() }),

      // Legacy fields (for backward compatibility)
      subContinent: (formData.subContinent || formData.currentSubContinent || '').trim(),
      countryOfResidence: (formData.countryOfResidence || formData.currentCountry || formData.currentNationality || '').trim(),
      currentCity: (formData.currentCity || formData.currentTown || '').trim(),

      // Connection tracking
      ...(formData.diasporaConnectionCaseId && { diasporaConnectionCaseId: formData.diasporaConnectionCaseId }),
      connectionStatus: formData.connectionStatus || 'NOT_APPLICABLE',
      ...(formData.returnVisitStatus && { returnVisitStatus: formData.returnVisitStatus }),
      ...(formData.returnVisitDate && { returnVisitDate: formData.returnVisitDate }),
      ...(formData.returnVisitNotes && { returnVisitNotes: formData.returnVisitNotes.trim() }),

      // ORIGIN BRANCHING & DIASPORA ORIGIN (Stored in diaspora section as well for redundancy/context)
      ...(formData.originType && { originType: formData.originType }),
      ...(formData.knowsAncestralTown !== undefined && { knowsAncestralTown: formData.knowsAncestralTown }),
    },
    createdAt: now,
    updatedAt: now,
    source: 'FORM_SUBMISSION',
  };

  // Remove all undefined values recursively before returning
  const cleaned = cleanForFirestore(record);

  // Ensure required fields are always present
  return {
    ...cleaned,
    identity: {
      ...cleaned.identity,
      personId,
      fullName: formData.fullName.toUpperCase().trim(),
      gender: formData.gender,
      photoConsent: formData.photoConsent || false,
    },
    verification: {
      ...cleaned.verification,
      verificationLevel: formData.verificationLevel || 0,
      verified: (formData.verificationLevel || 0) >= 2,
      consentStatus: formData.consentStatus,
      visibilitySetting: formData.visibilitySetting || 'PRIVATE',
    },
    diaspora: {
      ...cleaned.diaspora,
      isDiasporaRelative: formData.isDiasporaRelative,
      connectionStatus: formData.connectionStatus || 'NOT_APPLICABLE',
    },
    lifeEvents: {
      ...cleaned.lifeEvents,
      isDeceased: formData.isDeceased || false,
      sensitiveHistoryPrivate: formData.sensitiveHistoryPrivate || false,
    },
    createdAt: now,
    updatedAt: now,
    source: 'FORM_SUBMISSION',
  } as PersonRecord;
}
