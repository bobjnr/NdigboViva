# IGBO ANCESTRY NETWORK - SPREADSHEET TEMPLATE GUIDE

**Template Structure for Manual Data Entry**

This document provides the column structure for spreadsheet-based data entry that can later be imported into the system.

---

## 📊 SPREADSHEET STRUCTURE

### Column Headers (Row 1)

| Column | Field Name | Required | Data Type | Example | Notes |
|--------|------------|----------|-----------|---------|-------|
| A | personId | Auto | Text | P1734567890_abc123 | Auto-generated if blank |
| B | fullName | Yes | Text | CHUKWUEMEKA OKAFOR | |
| C | alternateNames | No | Text (comma-separated) | CHUKWU EMEKA,EMEKA | Multiple names separated by comma |
| D | gender | Yes | Text | MALE | MALE, FEMALE, OTHER, UNKNOWN |
| E | dateOfBirth | No | Text | 1945-03-15 | ISO format or year only |
| F | placeOfBirth | No | Text | ACHINA | |
| G | photoUrl | No | URL | https://... | |
| H | photoConsent | No | Boolean | TRUE | TRUE/FALSE |
| I | fatherId | No | Text | P1234567890_abc123 | Reference to another person |
| J | motherId | No | Text | P1234567891_def456 | Reference to another person |
| K | spouseIds | No | Text (comma-separated) | P123,P456 | Multiple IDs separated by comma |
| L | childrenIds | No | Text (comma-separated) | P789,P012 | Multiple IDs separated by comma |
| M | umunna | No | Text | UMUNNEBOGBU | Highly recommended |
| N | clan | No | Text | DIOHA | |
| O | village | No | Text | ELEKECHEM | |
| P | kindred | No | Text | UMUOKPARAUGHANZE | |
| Q | town | No | Text | ACHINA | |
| R | townQuarter | No | Text | EZI | |
| S | obiAreas | No | Text | AMAMU | |
| T | localGovernmentArea | No | Text | AGUATA | |
| U | state | No | Text | ANAMBRA | |
| V | senatorialDistrict | No | Text | ANAMBRA SOUTH | |
| W | federalConstituency | No | Text | AGUATA | |
| X | stateConstituency | No | Text | AGUATA I | |
| Y | nwaadaLineageLink | No | Text | ELEKECHEM | Maternal village |
| Z | titles | No | Text (comma-separated) | OZO,NZE | Multiple titles |
| AA | occupation | No | Text | FARMER | |
| AB | familyTrade | No | Text | BLACKSMITHING | |
| AC | totem | No | Text | LEOPARD | |
| AD | ancestralHouseName | No | Text | UMUOKAFOR COMPOUND | |
| AE | notableContributions | No | Text | Built first school in village | |
| AF | roles | No | Text (comma-separated) | ELDER,CHIEF | Multiple roles |
| AG | marriageDate | No | Text | 1970-05-20 | |
| AH | marriagePlace | No | Text | ACHINA | |
| AI | deathDate | No | Text | 2020-03-15 | |
| AJ | deathPlace | No | Text | LAGOS | |
| AK | isDeceased | No | Boolean | TRUE | TRUE/FALSE |
| AL | displacementNotes | No | Text | Family displaced during Biafran War | |
| AM | sensitiveHistoryPrivate | No | Boolean | TRUE | TRUE/FALSE |
| AN | sourceType | No | Text | CHURCH_RECORD | See source types below |
| AO | sourceDetails | No | Text | St. Mary's Church, Achina | |
| AP | testifierNames | No | Text (comma-separated) | CHIEF OKAFOR,ELDER NWANKWO | |
| AQ | testifierContact | No | Text | +234 801 234 5678 | |
| AR | documentScanIds | No | Text (comma-separated) | DOC_001,DOC_002 | |
| AS | documentUrls | No | Text (comma-separated) | https://...,https://... | |
| AT | story | No | Text | Our ancestor migrated from Nri... | Long text field |
| AU | notes | No | Text | Additional context... | |
| AV | verificationLevel | No | Number | 0 | 0, 1, 2, or 3 |
| AW | consentStatus | Yes | Boolean | TRUE | Must be TRUE |
| AX | visibilitySetting | Yes | Text | PRIVATE | PRIVATE, PARTIAL, PUBLIC |
| AY | isDiasporaRelative | Yes | Boolean | FALSE | TRUE/FALSE |
| AZ | countryOfResidence | No | Text | UNITED STATES | If diaspora |
| BA | currentCity | No | Text | HOUSTON | If diaspora |
| BB | currentState | No | Text | TEXAS | If diaspora |
| BC | diasporaConnectionCaseId | No | Text | CASE_2024_001 | |
| BD | connectionStatus | No | Text | NOT_APPLICABLE | See statuses below |
| BE | returnVisitStatus | No | Text | COMPLETED | See statuses below |
| BF | returnVisitDate | No | Text | 2023-12-15 | |
| BG | returnVisitNotes | No | Text | Visited ancestral village... | |

---

## 📋 ENUM VALUES REFERENCE

### Gender
- `MALE`
- `FEMALE`
- `OTHER`
- `UNKNOWN`

### Source Type
- `ORAL`
- `CHURCH_RECORD`
- `PALACE_ARCHIVE`
- `CIVIL_REGISTRY`
- `FAMILY_DOCUMENT`
- `OTHER`

### Verification Level
- `0` - Unverified
- `1` - Basic
- `2` - Verified
- `3` - Authoritative

### Visibility Setting
- `PRIVATE`
- `PARTIAL`
- `PUBLIC`

### Connection Status
- `PENDING`
- `IN_PROGRESS`
- `CONNECTED`
- `NOT_APPLICABLE`

### Return Visit Status
- `PLANNED`
- `COMPLETED`
- `NOT_PLANNED`

---

## 📝 DATA ENTRY GUIDELINES

### Required Fields
- **fullName**: Must be provided
- **gender**: Must be one of the enum values
- **consentStatus**: Must be TRUE
- **visibilitySetting**: Must be one of the enum values
- **isDiasporaRelative**: Must be TRUE or FALSE

### Text Formatting
- All names should be **UPPERCASE**
- Dates should follow ISO format: `YYYY-MM-DD` or just `YYYY`
- Boolean values: Use `TRUE` or `FALSE` (case-insensitive)
- Comma-separated lists: No spaces after commas (e.g., `OZO,NZE,LOLO`)

### Person ID References
- When linking to family members, use their `personId`
- If person doesn't exist yet, leave blank and link later
- Person IDs are auto-generated if left blank

### Multi-Value Fields
Fields that accept multiple values should be comma-separated:
- `alternateNames`: `CHUKWU EMEKA,EMEKA,CHUKWUEMEKA`
- `titles`: `OZO,NZE`
- `spouseIds`: `P123,P456`
- `childrenIds`: `P789,P012`
- `testifierNames`: `CHIEF OKAFOR,ELDER NWANKWO`

---

## 📥 IMPORT PROCESS

1. **Prepare Spreadsheet**
   - Use the column structure above
   - Fill in all available data
   - Ensure required fields are populated
   - Validate enum values

2. **Export to CSV**
   - Save spreadsheet as CSV (UTF-8 encoding)
   - Ensure column headers match exactly

3. **Import via API or Admin Tool**
   - Use batch import endpoint (to be created)
   - Or use migration utility for bulk imports

---

## ✅ VALIDATION CHECKLIST

Before importing, verify:

- [ ] All required fields are filled
- [ ] Gender values are valid enum values
- [ ] Verification level is 0-3
- [ ] Visibility setting is valid
- [ ] Consent status is TRUE
- [ ] Person ID references (if any) point to existing records
- [ ] Dates are in correct format
- [ ] Boolean values are TRUE/FALSE
- [ ] Text fields are uppercase where appropriate
- [ ] Comma-separated lists are properly formatted

---

## 📊 EXAMPLE ROW

```
P1734567890_abc123,CHUKWUEMEKA OKAFOR,CHUKWU EMEKA,MALE,1945-03-15,ACHINA,,FALSE,,,UMUNNEBOGBU,DIOHA,ELEKECHEM,UMUOKPARAUGHANZE,ACHINA,EZI,AMAMU,AGUATA,ANAMBRA,ANAMBRA SOUTH,AGUATA,AGUATA I,,OZO,FARMER,,,ELDER,1970-05-20,ACHINA,2020-03-15,LAGOS,TRUE,,FALSE,CHURCH_RECORD,St. Mary's Church,,,DOC_001,,Family story here...,,2,TRUE,PRIVATE,FALSE,,,,NOT_APPLICABLE,NOT_PLANNED,,
```

---

## 🔄 BATCH IMPORT FORMAT

For programmatic imports, use JSON format:

```json
[
  {
    "fullName": "CHUKWUEMEKA OKAFOR",
    "gender": "MALE",
    "dateOfBirth": "1945-03-15",
    "umunna": "UMUNNEBOGBU",
    "village": "ELEKECHEM",
    "town": "ACHINA",
    "state": "ANAMBRA",
    "consentStatus": true,
    "visibilitySetting": "PRIVATE",
    "isDiasporaRelative": false
  }
]
```

---

**Last Updated**: 2024
**Version**: 1.0

