# 🇳🇬 Nigeria Political Import — How to Achieve It

This guide covers the **authoritative political scaffolding** (States, Senatorial Districts, Federal Constituencies, LGAs, State Constituencies, Political Wards) and the **next strategic options** (INEC ingestion, Igbo lineage, Sheets, security rules, verification workflow).

---

## Step-by-step: What you do

Do these in order.

| Step | What to do |
|------|------------|
| **1** | **Get your Firebase credentials** — In Firebase Console → Project settings → Service accounts, generate a new private key (or use an existing one). Put the JSON in a safe place. You will use: `project_id`, `client_email`, `private_key`. |
| **2** | **Set environment variables** — In the project root, create or edit `.env.local`. Add: `FIREBASE_PROJECT_ID` = your project id, `FIREBASE_CLIENT_EMAIL` = service account client_email, `FIREBASE_PRIVATE_KEY` = the full private key string (paste it in quotes; keep `\n` as literal backslash-n if needed). Alternatively, set `GOOGLE_APPLICATION_CREDENTIALS` to the path of the service account JSON file. |
| **3** | **Ensure Nigeria (country) exists in Firestore** — The States template uses parent `CO-NGA`. If your `ontology` collection does not yet have a document with id `CO-NGA`, add it first (e.g. via Firebase Console or a one-line CSV and import). Document should have: `id`: `CO-NGA`, `type`: `COUNTRY`, `name`: `NGA`, `displayName`: `Nigeria`, `isPublic`: true. |
| **4** | **Populate the CSV templates** — Open each file in `data/ontology-templates/` (States, Senatorial Districts, Federal Constituencies, LGAs, State Constituencies, Political Wards). Replace the example row with real data. Keep the header row. Use the ID rules in `data/ontology-templates/README.md` (e.g. State id = `ST-NGA-ANAMBRA`, LGA id = `LGA-ST-NGA-ANAMBRA-ANAOCHA`, Ward id = `WD-LGA-ST-NGA-ANAMBRA-ANAOCHA-W01`). Fill **parentId** so parents exist (States → `CO-NGA`, LGAs → state id, Wards → LGA id). |
| **5** | **Test import (dry run)** — In a terminal, from the project root run: `DRY_RUN=1 node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_States_Template.csv` (use one of your filled CSVs). Check the console for “Would write X documents”; fix any path or CSV errors. |
| **6** | **Import in order** — Run the script once per CSV, **in this order** (parents before children):  
  - `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_States_Template.csv`  
  - `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Senatorial_Districts_Template.csv`  
  - `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Federal_Constituencies_Template.csv`  
  - `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_LGAs_Template.csv`  
  - `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_State_Constituencies_Template.csv`  
  - `node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Political_Wards_Template.csv`  
  After each, check the console for “Imported X documents”. |
| **7** | **Deploy Firestore indexes** — From the project root run: `firebase deploy --only firestore:indexes`. Wait until the deploy finishes. |
| **8** | **Verify in Firebase** — Open Firebase Console → Firestore → `ontology` collection. Confirm you see documents with the ids and types you imported (e.g. states, LGAs, wards). |
| **9** | **Use data in the app** — The genealogy form dropdowns (Current Location and Town of Origin: State, LGA, Town, Political Ward) **automatically use this data** when it exists in Firestore. No code change needed: the app fetches from the `ontology` collection and falls back to static JSON when no imported data is present. |
| **10** | **(Optional) Next layers** — When ready, follow the “Next Strategic Options” section below for: INEC ingestion plan, Igbo towns template, Google Sheets, security rules, or verification/dispute workflow. |

---

## What You Have in This Repo

| Item | Location | Purpose |
|------|----------|---------|
| **CSV templates** | `data/ontology-templates/` | States, Senatorial Districts, Federal Constituencies, LGAs, State Constituencies, Political Wards — with `id`, `parentId`, `type`, `name`, `displayName`, `code`, `verified`, `createdAt` |
| **Template README** | `data/ontology-templates/README.md` | Column definitions and ID conventions (`ontology-ids.ts`) |
| **Bulk import script** | `scripts/firebase_bulk_import.js` | Reads CSV, uses `id` as doc ID, writes to Firestore `ontology` with server timestamp |
| **Firestore indexes** | `firestore.indexes.json` | Composite indexes for `ontology` (parentId + type + name) and `submissions` |

---

## Step 1: Populate Templates with INEC Data

1. **Download** the CSV templates from `data/ontology-templates/`:
   - `Nigeria_States_Template.csv`
   - `Nigeria_Senatorial_Districts_Template.csv`
   - `Nigeria_Federal_Constituencies_Template.csv`
   - `Nigeria_LGAs_Template.csv`
   - `Nigeria_State_Constituencies_Template.csv`
   - `Nigeria_Political_Wards_Template.csv`

2. **Fill** each with official INEC (or other authoritative) data. Keep:
   - **id** — must match conventions in `src/lib/ontology-ids.ts` (e.g. `ST-NGA-ANAMBRA`, `LGA-ST-NGA-ANAMBRA-ANAOCHA`, `WD-LGA-ST-NGA-ANAMBRA-ANAOCHA-W01`).
   - **parentId** — State’s parent = `CO-NGA`; LGA’s parent = state id; Ward’s parent = LGA id.
   - **type** — `STATE`, `SENATORIAL_ZONE`, `LGA`, `FEDERAL_CONSTITUENCY`, `STATE_CONSTITUENCY`, `WARD`.
   - **code** — INEC code where available.

3. **Import order** (parents before children):
   - States → Senatorial / Federal / State Constituencies / LGAs → Wards.

---

## Step 2: Run Bulk Import

**Env** (from `.env.local` or shell):

- `FIREBASE_PROJECT_ID` or `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`  
  **or** `GOOGLE_APPLICATION_CREDENTIALS` path to service account JSON.

**Commands:**

```bash
# Dry run (no writes)
DRY_RUN=1 node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_States_Template.csv

# Real import (run in dependency order)
node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_States_Template.csv
node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Senatorial_Districts_Template.csv
node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Federal_Constituencies_Template.csv
node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_LGAs_Template.csv
node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_State_Constituencies_Template.csv
node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Political_Wards_Template.csv
```

The script writes to the `ontology` collection and sets `createdAt` / `updatedAt` on the server.

---

## Step 3: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

Existing indexes support queries by `parentId` + `type` (and optional `isPublic`) with `orderBy('name')` — i.e. LGA→State and Ward→LGA style queries.

---

## Next Strategic Options — How to Achieve Each

### 1️⃣ Official INEC dataset ingestion plan (with column mapping spec)

**Goal:** Ingest INEC’s official lists (states, LGAs, wards, constituencies) into your CSVs and then into Firestore.

**Steps:**

1. **Obtain INEC data** (e.g. from [INEC](https://inecnigeria.org/) or official PDF/Excel — states, LGAs, wards, senatorial/federal/state constituencies).
2. **Column mapping spec:** Create a small doc (e.g. `docs/INEC_COLUMN_MAPPING.md`) that maps each INEC column to your template columns:
   - INEC “State Name” → `name` / `displayName`; derive `id` with `ST-NGA-{STATE}`.
   - INEC “LGA Name” + State → `name`, `parentId` = state id; `id` = `LGA-{STATE_ID}-{LGA}`.
   - INEC “Ward” / “Ward Code” → `name`, `code`; `parentId` = LGA id; `id` = `WD-{LGA_ID}-W{nn}`.
3. **Script (optional):** A one-off script (Node or Python) that reads INEC Excel/CSV and outputs your CSV format so you can run `firebase_bulk_import.js` without manual copy-paste.

---

### 2️⃣ Igbo states lineage ingestion (town-by-town template)

**Goal:** Add towns (and optionally villages) under LGAs for Igbo states, then import into `ontology`.

**Steps:**

1. **Town template:** Add `Nigeria_Towns_Template.csv` in `data/ontology-templates/` with columns: `id`, `parentId` (LGA id), `type` = `TOWN`, `name`, `displayName`, `code`, `verified`, `createdAt`. Use `TW-{LGA_ID}-{TOWN}` for `id` (see `ontology-ids.ts`).
2. **Data source:** Reuse/extend `towns-by-lga.json` or NDIGBO VIVA / GIGP data: one row per town, `parentId` = LGA id.
3. **Import:** Populate the towns CSV (e.g. from existing JSON or a small script), then run:
   ```bash
   node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_Towns_Template.csv
   ```
4. **Villages (optional):** Same pattern with `type` = `VILLAGE`, `parentId` = town id, and an ID convention (e.g. in `ontology-ids.ts`).

---

### 3️⃣ Cascading Google Sheets (fully wired) using these datasets

**Goal:** A Sheets UI where users pick Country → State → LGA → Ward (and optionally Town) with dropdowns driven by the same hierarchy.

**Steps:**

1. **Export Firestore → Sheets:** A scheduled or on-demand script that reads `ontology` (by `parentId` + `type`) and writes flattened tables to Sheets (e.g. States sheet, LGAs sheet with state name/id, Wards sheet with LGA name/id). Or use a single “lookup” sheet with columns: Level, ParentId, Id, Name, Code.
2. **Data validation:** In Sheets, use `INDIRECT`/named ranges or a simple Apps Script that fills “State” dropdown from the States sheet, “LGA” from LGAs where parent = selected State, “Ward” from Wards where parent = selected LGA.
3. **Sync back (optional):** If edits in Sheets must update Firestore, add an Apps Script or Cloud Function that reads the sheet and calls Firestore (or your API) to upsert ontology docs — with the same `id` / `parentId` / `type` rules.

---

### 4️⃣ Deploy production Firestore security rules

**Goal:** Lock down `ontology` and other collections so only admins can write; public can read only what’s marked `isPublic`.

**Steps:**

1. **Review** `firestore.rules` in the repo. Typical pattern:
   - `ontology`: allow read if `resource.data.isPublic == true` (or allow read for all and filter in app); allow create/update/delete only if `request.auth != null` and an admin claim/field is true.
   - `submissions`, `persons`: restrict write to authenticated admins; read per your app logic.
2. **Deploy:**
   ```bash
   firebase deploy --only firestore:rules
   ```
3. **Test** with the Firebase Emulator and with a test user (admin vs non-admin).

---

### 5️⃣ Lineage verification + dispute workflow

**Goal:** Allow “verified” vs “unverified” lineage and a simple dispute/correction flow.

**Steps:**

1. **Data model:** Use the existing `verified` (or `isPublic`) on ontology; add on **persons** or **submissions**: e.g. `verificationStatus` (`PENDING` | `VERIFIED` | `DISPUTED`), `verifiedAt`, `verifiedBy`, `disputeNotes`, `disputeReportedAt`.
2. **Verification UI (admin):** Admin list of submissions/lineage entries with “Verify” / “Flag dispute” actions that set status and timestamps.
3. **Dispute reporting (public):** A form or button “Report error” that creates a submission or a `disputes` collection (personId/lineageId, reporter contact, description, status: OPEN/REVIEWED/RESOLVED).
4. **Workflow:** Notify admins of new disputes; allow resolving with a note and optional status change on the related person/lineage.

---

## Quick Reference

| Task | Command / Location |
|------|--------------------|
| Import one CSV | `node scripts/firebase_bulk_import.js <path-to-csv>` |
| Dry run | `DRY_RUN=1 node scripts/firebase_bulk_import.js <path>` |
| Deploy indexes | `firebase deploy --only firestore:indexes` |
| Deploy rules | `firebase deploy --only firestore:rules` |
| ID conventions | `src/lib/ontology-ids.ts` |
| Ontology types | `src/lib/ontology-types.ts` |

You now have **structured import-ready political scaffolding**, **Firestore-compatible schema**, **indexing baseline**, **bulk uploader**, and **zero hardcoded data** in the templates — plus a clear path for each of the five strategic expansions above.
