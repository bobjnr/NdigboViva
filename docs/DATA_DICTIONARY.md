# IGBO ANCESTRY NETWORK - DATA DICTIONARY

**Complete Field Reference Guide for Person Records**

This document defines every field in the Igbo Ancestry Network database, explaining what each field means, why it's important, and how to use it.

---

## 📋 TABLE OF CONTENTS

- [A) Identity Fields](#a-identity-fields)
- [B) Lineage & Family Relationships](#b-lineage--family-relationships)
- [C) Cultural & Social Identity](#c-cultural--social-identity)
- [D) Life Events](#d-life-events)
- [E) Documentation & Sources](#e-documentation--sources)
- [F) Verification Status & Security](#f-verification-status--security)
- [G) Diaspora Link Fields](#g-diaspora-link-fields)

---

## A) IDENTITY FIELDS

### `personId` (Required)
- **Type**: String
- **Format**: `P{timestamp}_{random}` (e.g., `P1734567890_abc123`)
- **Why**: Primary unique identifier. Prevents duplicates and enables data merging across towns.
- **Example**: `P1734567890_xyz789`
- **Auto-generated**: Yes

### `fullName` (Required)
- **Type**: String
- **Format**: Uppercase, trimmed
- **Why**: Cultural identity. Can include both baptismal and ancestral names.
- **Example**: `"CHUKWUEMEKA OKAFOR"` or `"EMMANUEL NONYE OKAFOR"`
- **Notes**: Include all names the person is known by in one field

### `alternateNames` (Optional)
- **Type**: Array of Strings
- **Format**: Array of uppercase names
- **Why**: Igbo orthography varies. Must capture all spelling versions to prevent missed matches.
- **Example**: `["CHUKWUEMEKA", "CHUKWU EMEKA", "EMEKA"]`
- **Notes**: Include all known variations and spellings

### `gender` (Required)
- **Type**: Enum
- **Values**: `"MALE"` | `"FEMALE"` | `"OTHER"` | `"UNKNOWN"`
- **Why**: Important for lineage mapping. Paternal lines ≠ maternal lines in Igbo culture.
- **Example**: `"MALE"`

### `dateOfBirth` (Optional)
- **Type**: String (ISO format or approximate)
- **Format**: 
  - Full date: `"1945-03-15"`
  - Year + Month: `"1945-03"`
  - Year only: `"1945"`
  - Approximate: `"~1945"` or `"circa 1945"`
- **Why**: Timeline placement. Prevents generation confusion in family trees.
- **Example**: `"1945-03-15"` or `"1945"`

### `placeOfBirth` (Optional)
- **Type**: String
- **Format**: Uppercase town/village name
- **Why**: Confirms origin, validates link to town/village.
- **Example**: `"ACHINA"` or `"AGULUEZECHUKWU"`

### `photoUrl` (Optional)
- **Type**: String (URL)
- **Format**: Full URL to stored image
- **Why**: Avoids mistaken identity and duplicate entries.
- **Example**: `"https://storage.firebase.com/photos/person_123.jpg"`
- **Privacy**: Requires `photoConsent`

### `photoConsent` (Required if photo provided)
- **Type**: Boolean
- **Why**: Explicit consent for photo storage/display. Legal requirement.
- **Example**: `true`

---

## B) LINEAGE & FAMILY RELATIONSHIPS

### `fatherId` (Optional)
- **Type**: String (Person ID reference)
- **Format**: Another person's `personId`
- **Why**: Creates hereditary tree — core lineage path.
- **Example**: `"P1734567890_abc123"`
- **Notes**: Must reference an existing person record

### `motherId` (Optional)
- **Type**: String (Person ID reference)
- **Format**: Another person's `personId`
- **Why**: Critical for diaspora. Maternal identity often carries stories.
- **Example**: `"P1734567891_def456"`

### `spouseIds` (Optional)
- **Type**: Array of Strings (Person ID references)
- **Format**: Array of spouse `personId`s
- **Why**: Maps marital ties, inter-clan fusion. Supports polygamy.
- **Example**: `["P1734567892_ghi789", "P1734567893_jkl012"]`
- **Notes**: Can have multiple spouses

### `childrenIds` (Optional)
- **Type**: Array of Strings (Person ID references)
- **Format**: Array of children's `personId`s
- **Why**: Enables bottom-up family growth. Builds descendant trees.
- **Example**: `["P1734567894_mno345", "P1734567895_pqr678"]`

### `umunna` (Optional but Recommended)
- **Type**: String
- **Format**: Uppercase
- **Why**: **MOST ESSENTIAL** Igbo identity unit. Binds lineage to ancestors.
- **Example**: `"UMUNNEBOGBU"`
- **Notes**: This is the core Igbo family structure

### `clan` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Clan affiliation for broader lineage grouping.
- **Example**: `"DIOHA"`

### `village` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Village-level location for diaspora search and validation.
- **Example**: `"ELEKECHEM"`

### `kindred` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Kindred/Hamlet level classification.
- **Example**: `"UMUOKPARAUGHANZE"`

### `town` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Town-level location classification.
- **Example**: `"ACHINA"`

### `townQuarter` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Quarter-level location (e.g., EZI).
- **Example**: `"EZI"`

### `obiAreas` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Obi area classification.
- **Example**: `"AMAMU"`

### `localGovernmentArea` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: LGA-level classification for administrative purposes.
- **Example**: `"AGUATA"`

### `state` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: State-level classification.
- **Example**: `"ANAMBRA"`

### `senatorialDistrict` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Political district classification.
- **Example**: `"ANAMBRA SOUTH"`

### `federalConstituency` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: Federal constituency classification.
- **Example**: `"AGUATA"`

### `stateConstituency` (Optional)
- **Type**: String
- **Format**: Uppercase
- **Why**: State constituency classification.
- **Example**: `"AGUATA I"`

### `nwaadaLineageLink` (Optional)
- **Type**: String
- **Format**: Uppercase village name
- **Why**: Maternal village tracking to respect maternal rights & ties.
- **Example**: `"ELEKECHEM"`
- **Notes**: Important for women's lineage tracking

---

## C) CULTURAL & SOCIAL IDENTITY

### `titles` (Optional)
- **Type**: Array of Strings
- **Format**: Uppercase title names
- **Why**: These define social status + cultural responsibilities.
- **Examples**: 
  - `["OZO"]` - Ozo title holder
  - `["NZE"]` - Nze title
  - `["LOLO"]` - Lolo title (women)
  - `["ICHIE"]` - Ichie title
- **Notes**: Can have multiple titles

### `occupation` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Helps connect lost diaspora descendants by profession clues.
- **Example**: `"FARMER"`, `"TRADER"`, `"TEACHER"`

### `familyTrade` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Traditional family profession/trade. Cultural continuity marker.
- **Example**: `"BLACKSMITHING"`, `"POTTERY"`, `"WEAVING"`

### `totem` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Igbo omens, forbidden foods. Helps tribe migration mapping.
- **Example**: `"LEOPARD"`, `"PYTHON"`, `"EAGLE"`
- **Notes**: Sacred animal or forbidden food for this lineage

### `ancestralHouseName` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Locational proof for returnees from diaspora.
- **Example**: `"UMUOKAFOR COMPOUND"`, `"EZI OKOLI"`

### `notableContributions` (Optional)
- **Type**: String
- **Format**: Free text (can be long)
- **Why**: Preserves achievements → civic pride + research value.
- **Example**: `"Built the first school in the village in 1960"`

### `roles` (Optional)
- **Type**: Array of Strings
- **Format**: Array of role names
- **Why**: Community roles and responsibilities.
- **Examples**: 
  - `["COMMUNITY LEADER"]`
  - `["ELDER"]`
  - `["CHIEF"]`
  - `["VILLAGE HEAD"]`

---

## D) LIFE EVENTS

### `marriageDate` (Optional)
- **Type**: String (ISO format or approximate)
- **Format**: Same as `dateOfBirth`
- **Why**: Helps verify multi-village lineage claims.
- **Example**: `"1970-05-20"` or `"1970"`

### `marriagePlace` (Optional)
- **Type**: String
- **Format**: Uppercase location
- **Why**: Location of marriage for verification.
- **Example**: `"ACHINA"`

### `deathDate` (Optional)
- **Type**: String (ISO format or approximate)
- **Format**: Same as `dateOfBirth`
- **Why**: Historical population studies, grave record links.
- **Example**: `"2020-03-15"` or `"2020"`

### `deathPlace` (Optional)
- **Type**: String
- **Format**: Uppercase location
- **Why**: Location of death for historical records.
- **Example**: `"LAGOS"`

### `isDeceased` (Optional)
- **Type**: Boolean
- **Why**: Quick flag for living/deceased status.
- **Example**: `true`

### `migrationHistory` (Optional)
- **Type**: Array of Objects
- **Format**: 
  ```json
  [
    {
      "from": "ACHINA",
      "to": "LAGOS",
      "date": "1960",
      "reason": "Employment"
    }
  ]
  ```
- **Why**: Tracks internal & global movement routes.
- **Notes**: Can have multiple migration entries

### `displacementNotes` (Optional)
- **Type**: String
- **Format**: Free text (can be long)
- **Why**: Essential to reconnect Afro-diaspora families lost generations ago.
- **Example**: `"Family displaced during Biafran War, relocated to Port Harcourt"`
- **Privacy**: Can be marked private with `sensitiveHistoryPrivate`

### `sensitiveHistoryPrivate` (Optional)
- **Type**: Boolean
- **Why**: Flags sensitive information that should remain private.
- **Example**: `true`
- **Notes**: When true, displacement notes may be hidden from public view

---

## E) DOCUMENTATION & SOURCES

### `sourceType` (Optional)
- **Type**: Enum
- **Values**: 
  - `"ORAL"` - Oral tradition/storytelling
  - `"CHURCH_RECORD"` - Church baptism/marriage records
  - `"PALACE_ARCHIVE"` - Palace/royal records
  - `"CIVIL_REGISTRY"` - Government civil registry
  - `"FAMILY_DOCUMENT"` - Family papers/documents
  - `"OTHER"` - Other sources
- **Why**: Tells reliability level & verification needed.
- **Example**: `"CHURCH_RECORD"`

### `sourceDetails` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Additional source information.
- **Example**: `"St. Mary's Catholic Church, Achina, Baptism Register 1945"`

### `testifierNames` (Optional)
- **Type**: Array of Strings
- **Format**: Array of names
- **Why**: Accountability + follow-up validation.
- **Example**: `["CHIEF OKAFOR", "ELDER NWANKWO"]`

### `testifierContact` (Optional)
- **Type**: String
- **Format**: Phone, email, or address
- **Why**: How to reach testifiers for validation.
- **Example**: `"+234 801 234 5678"` or `"elder@example.com"`

### `documentScanIds` (Optional)
- **Type**: Array of Strings
- **Format**: Array of document reference IDs
- **Why**: Archival reference and fraud prevention.
- **Example**: `["DOC_001", "DOC_002"]`

### `documentUrls` (Optional)
- **Type**: Array of Strings (URLs)
- **Format**: Array of full URLs
- **Why**: Direct links to scanned documents.
- **Example**: `["https://storage.firebase.com/documents/doc_001.pdf"]`

### `story` (Optional)
- **Type**: String
- **Format**: Free text (can be very long)
- **Why**: Holds family narratives. Essential for diaspora connection.
- **Example**: `"Our ancestor migrated from Nri in the 18th century..."`

### `notes` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Additional notes, context, observations.
- **Example**: `"Verified by village elder in 2020"`

---

## F) VERIFICATION STATUS & SECURITY

### `verificationLevel` (Required)
- **Type**: Number (0-3)
- **Values**:
  - `0` - Unverified (new entry, not yet checked)
  - `1` - Basic verification (self-reported, needs review)
  - `2` - Verified (checked by authority)
  - `3` - Authoritative (highest level, multiple sources)
- **Why**: Determines what can be publicly displayed.
- **Example**: `2`

### `verified` (Auto-calculated)
- **Type**: Boolean
- **Why**: Quick boolean flag (true if verificationLevel >= 2).
- **Example**: `true`
- **Auto-set**: Yes, based on verificationLevel

### `consentStatus` (Required)
- **Type**: Boolean
- **Why**: Family consent for data storage. Legal requirement.
- **Example**: `true`
- **Notes**: Must be true to store record

### `visibilitySetting` (Required)
- **Type**: Enum
- **Values**:
  - `"PUBLIC"` - Visible to all users
  - `"PRIVATE"` - Only visible to family/admins
  - `"PARTIAL"` - Some fields visible, others private
- **Why**: Hybrid model enforcement. Privacy control.
- **Example**: `"PARTIAL"`

### `validationAuthority` (Optional)
- **Type**: Enum
- **Values**:
  - `"EZE"` - Traditional ruler
  - `"COUNCIL"` - Village/town council
  - `"CHURCH"` - Church authority
  - `"FAMILY_ELDER"` - Family elder
  - `"ADMIN"` - System administrator
  - `"NONE"` - Not yet validated
- **Why**: Cultural legitimacy. Who validated this record.
- **Example**: `"FAMILY_ELDER"`

### `validatedBy` (Optional)
- **Type**: String
- **Format**: Name or user ID of validator
- **Why**: Accountability. Who performed the validation.
- **Example**: `"CHIEF OKAFOR"` or `"user_123"`

### `validatedAt` (Optional)
- **Type**: Timestamp
- **Format**: Firestore timestamp
- **Why**: When validation occurred.
- **Example**: `2024-01-15T10:30:00Z`
- **Auto-set**: Yes, when validation occurs

### `recordLockDate` (Optional)
- **Type**: Timestamp
- **Format**: Firestore timestamp
- **Why**: Prevents unapproved edits after this date.
- **Example**: `2024-01-15T10:30:00Z`
- **Notes**: Once locked, record cannot be modified without admin override

### `lockedBy` (Optional)
- **Type**: String
- **Format**: User ID or name
- **Why**: Who locked the record.
- **Example**: `"admin_001"`

### `createdBy` (Optional)
- **Type**: String
- **Format**: User ID
- **Why**: User ID who created record.
- **Example**: `"user_123"`

### `lastModifiedBy` (Optional)
- **Type**: String
- **Format**: User ID
- **Why**: User ID who last modified.
- **Example**: `"user_456"`

### `editHistory` (Auto-maintained)
- **Type**: Array of Objects
- **Format**:
  ```json
  [
    {
      "editedBy": "user_123",
      "editedAt": "2024-01-15T10:30:00Z",
      "changes": "Updated date of birth"
    }
  ]
  ```
- **Why**: Protects truth. Stops historical manipulation.
- **Auto-maintained**: Yes, system tracks all changes

---

## G) DIASPORA LINK FIELDS

### `isDiasporaRelative` (Required)
- **Type**: Boolean
- **Why**: Flags reconnection potential.
- **Example**: `true`
- **Notes**: Set to true if person lives outside Igboland/Nigeria

### `countryOfResidence` (Optional, required if diaspora)
- **Type**: String
- **Format**: Country name
- **Why**: Diaspora mapping & outreach.
- **Example**: `"UNITED STATES"`, `"UNITED KINGDOM"`, `"CANADA"`

### `currentCity` (Optional)
- **Type**: String
- **Format**: City name
- **Why**: Current city if diaspora.
- **Example**: `"HOUSTON"`, `"LONDON"`

### `currentState` (Optional)
- **Type**: String
- **Format**: State/province name
- **Why**: Current state/province if diaspora.
- **Example**: `"TEXAS"`, `"ONTARIO"`

### `diasporaConnectionCaseId` (Optional)
- **Type**: String
- **Format**: Case tracking ID
- **Why**: Matchmaking process tracking.
- **Example**: `"CASE_2024_001"`

### `connectionStatus` (Optional)
- **Type**: Enum
- **Values**:
  - `"PENDING"` - Connection request pending
  - `"IN_PROGRESS"` - Connection being processed
  - `"CONNECTED"` - Successfully connected
  - `"NOT_APPLICABLE"` - Not a diaspora case
- **Why**: Track reconnection progress.
- **Example**: `"CONNECTED"`

### `returnVisitStatus` (Optional)
- **Type**: Enum
- **Values**:
  - `"PLANNED"` - Visit planned
  - `"COMPLETED"` - Visit completed
  - `"NOT_PLANNED"` - No visit planned
- **Why**: Tourism & spiritual reconnection journey tracking.
- **Example**: `"COMPLETED"`

### `returnVisitDate` (Optional)
- **Type**: String (ISO format)
- **Format**: Date string
- **Why**: When they visited/plan to visit.
- **Example**: `"2023-12-15"`

### `returnVisitNotes` (Optional)
- **Type**: String
- **Format**: Free text
- **Why**: Experience, reconnection story.
- **Example**: `"Visited ancestral village, met extended family, very emotional reunion"`

---

## 📊 FIELD SUMMARY BY CATEGORY

| Category | Required Fields | Optional Fields | Total |
|----------|----------------|-----------------|-------|
| Identity | 3 | 5 | 8 |
| Lineage | 0 | 15 | 15 |
| Cultural | 0 | 7 | 7 |
| Life Events | 0 | 8 | 8 |
| Documentation | 0 | 8 | 8 |
| Verification | 3 | 9 | 12 |
| Diaspora | 1 | 8 | 9 |
| **TOTAL** | **7** | **60** | **67** |

---

## ✅ DATA ENTRY CHECKLIST

When entering a new person record, ensure you have:

- [ ] **Identity**: Full name, gender, person ID (auto-generated)
- [ ] **Lineage**: At least one location field (village, town, or state)
- [ ] **Verification**: Consent status, visibility setting, verification level
- [ ] **Diaspora**: isDiasporaRelative flag

All other fields are optional but recommended for complete records.

---

## 🔒 PRIVACY NOTES

- **Living persons**: Use `visibilitySetting: "PRIVATE"` or `"PARTIAL"`
- **Deceased persons**: Can use `visibilitySetting: "PUBLIC"` if family consents
- **Sensitive history**: Use `sensitiveHistoryPrivate: true` for displacement/slave trade notes
- **Photos**: Always require `photoConsent: true` before storing

---

## 📝 VALIDATION RULES

1. **personId** must be unique (system enforces)
2. **fullName** cannot be empty
3. **gender** must be one of: MALE, FEMALE, OTHER, UNKNOWN
4. **verificationLevel** must be 0, 1, 2, or 3
5. **consentStatus** must be true to save record
6. **visibilitySetting** must be PUBLIC, PRIVATE, or PARTIAL
7. **Relationship IDs** (fatherId, motherId, etc.) must reference existing person records
8. **Dates** should follow ISO format when possible

---

**Last Updated**: 2024
**Version**: 1.0

