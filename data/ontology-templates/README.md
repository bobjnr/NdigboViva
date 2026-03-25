# Nigeria Political Import Templates (Authoritative Structure)

CSV templates for bulk import into Firestore `ontology` collection. Populate with official INEC data before running the bulk import script.

## Column definitions

| Column      | Required | Description |
|------------|----------|-------------|
| `id`       | Yes      | Unique document ID (used as Firestore document ID). Must match ontology ID conventions. |
| `parentId` | No       | Parent entity ID (e.g. State for LGA, LGA for Ward). Empty for root (e.g. States under country). |
| `type`     | Yes      | One of: `STATE`, `SENATORIAL_ZONE`, `LGA`, `FEDERAL_CONSTITUENCY`, `STATE_CONSTITUENCY`, `WARD`. |
| `name`     | Yes      | Canonical name (ID-safe: uppercase, hyphens, no spaces). |
| `displayName` | No   | Human-readable name (e.g. "Anambra North"). |
| `code`     | No       | INEC code (or official code). |
| `verified` | No       | `1` = verified/official, `0` or empty = unverified. Stored as `isPublic` (1 → true). |
| `createdAt`| No       | ISO timestamp; leave empty for server timestamp. |

## ID conventions (must match `src/lib/ontology-ids.ts`)

- **State:** `ST-NGA-{STATE}` e.g. `ST-NGA-ANAMBRA`
- **Senatorial zone:** `SZ-{STATE_ID}-{ZONE}` e.g. `SZ-ST-NGA-ANAMBRA-NORTH`
- **LGA:** `LGA-{STATE_ID}-{LGA}` e.g. `LGA-ST-NGA-ANAMBRA-ANAOCHA`
- **Federal constituency:** `FC-{STATE_ID}-{NAME}` e.g. `FC-ST-NGA-ANAMBRA-AGUATA`
- **State constituency:** `SC-{STATE_ID}-{NAME}` e.g. `SC-ST-NGA-ANAMBRA-AGUATA-I`
- **Ward:** `WD-{LGA_ID}-W{NUMBER}` e.g. `WD-LGA-ST-NGA-ANAMBRA-ANAOCHA-W01`

Parent references:

- States → `parentId`: `CO-NGA` (Nigeria)
- LGAs → `parentId`: state id (e.g. `ST-NGA-ANAMBRA`)
- Wards → `parentId`: LGA id (e.g. `LGA-ST-NGA-ANAMBRA-ANAOCHA`)

## Files

- `Nigeria_States_Template.csv` — 37 states (incl. FCT)
- `Nigeria_Senatorial_Districts_Template.csv` — ~109
- `Nigeria_Federal_Constituencies_Template.csv` — 360
- `Nigeria_LGAs_Template.csv` — 774
- `Nigeria_State_Constituencies_Template.csv` — ~993
- `Nigeria_Political_Wards_Template.csv` — ~8,800+

## Usage

1. Download or export INEC data into these column structures.
2. Run bulk import: `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_LGAs_Template.csv`
3. Deploy indexes: `firebase deploy --only firestore:indexes`
