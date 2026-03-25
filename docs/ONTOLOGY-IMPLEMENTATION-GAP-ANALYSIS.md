# Ontology Implementation — Gap Analysis

This document compares your **current system** to the **institutional ontology spec** (strict ID conventions + cascading dropdown logic + Firebase registry model) and lists what remains to complete it.

---

## 1. What You Already Have ✅

### 1.1 Hierarchy Layers (Conceptually Present)

| Spec layer | Your system | Data source | Notes |
|------------|-------------|-------------|--------|
| Continent | ✅ | `world-locations.json`, `continents` | Name-based |
| Sub-Continent | ✅ | `extended-location-data.ts` → `continentSubContinents` | Name-based |
| Country | ✅ | `world-locations` → `continentCountries`, `countries` | Name-based |
| National Region | ✅ (as “Region”) | `nigerianGeoZones` (SE, SW, NC, etc.) | Name-based; Nigeria-only |
| State | ✅ | `nigerianStates`, `countryStates` | Name-based |
| Senatorial Zone | ✅ | `senatorialDistricts[state]` | Name-based; partial states |
| LGA | ✅ | `nigeriaWards` → state→lgas | Name-based |
| Federal Constituency | ✅ | `federalConstituencies[state]` | Name-based; partial states |
| State Constituency | ⚠️ | Text input only | `stateConstituencies` is `{}` |
| Political Ward | ⚠️ | Data in `nigeria-wards.json` (wards per LGA) | Not exposed as dropdown; form uses text input |
| Town | ✅ | `townsData` (towns-by-lga + wards fallback) | Name-based |
| Town Admin 1–4 | ⚠️ | Form fields only | **Text inputs**, no registry/dropdown |
| Village | ✅ | `townHierarchy` (Quarter→Obi→Clan→Village) + `villagesData` (empty) | Name-based |
| Hamlet | ⚠️ | Form field `originHamlet` | **Text input** only; no dropdown/registry |
| Lineage | ❌ | — | Not in spec’s “Town → Lineage → Kindred” sense |
| Kindred | ✅ | `townHierarchy` → village.kindreds | Name-based |
| Extended Family (Umunna) | ✅ | `townHierarchy` → kindred → umunna array | Name-based |
| Nuclear Family | ✅ | `familyName` (surname) | Name only; no EF/NF entity or ID |

### 1.2 Cascading Logic (Partially Implemented)

- **Primary geographic:** Continent → Country → State → LGA → Town is wired (current + origin). Sub-**Region** exists for Nigeria (geo zones); **Sub-Region** in the global sense (SR-AFRICA-WEST-WESTAFRICA) is not a dropdown.
- **Political overlay:** State → Senatorial, State → Federal Constituency exist. **State Constituency** is text. **Political Ward** is not filtered by LGA + State Constituency.
- **Town structure:** Town → Quarter → Obi → Clan → Village → Kindred → Umunna is fully cascaded from `genealogy-hierarchy.json`. Town Admin 1–4 do not cascade (no parent-child registry).
- **Cultural overlay (Lineage branch):** Spec wants **Town → Lineage → Kindred**. You only have **Village → Kindred**. No Lineage entity or “Kindred by Lineage vs by Hamlet” logic.

### 1.3 Data Storage

- **Person / submission:** All location and kinship fields are **names (strings)**. No ontology IDs (CT-, ST-, LGA-, TW-, VL-, KD-, etc.) are stored.
- **Firebase:** Used for `submissions`, `people`, `public_persons`, `subscribers`, `users`. No Firestore **registry** collections for continents, states, LGAs, towns, etc., with `Parent_ID` and `Is_Public`.

### 1.4 ID Conventions

- **Person:** `generatePersonId()` → `P{timestamp}_{random}`. No ontology IDs.
- **Submission:** `generateSubmissionId()` → `SUB{timestamp}_{random}`.
- **GenealogyRecord (legacy):** `generateRecordId()` → `GENEALOGY_{timestamp}_{random}`.
- None of the 19 ontology ID types (CT-, SC-, SR-, CO-, NR-, ST-, SZ-, LGA-, FC-, WD-, TW-, TL1–4-, VL-, HM-, LN-, KD-, EF-, NF-) exist in code or data.

### 1.5 UX / Design Rules

- Manual text entry is **allowed** when list is empty or “Other” (e.g. Village, Kindred, Umunna, Town Level 1–4, State Constituency, Political Ward). Spec: *“Never allow manual text entry if dropdown exists”* and *“If value not found → Request addition”*.
- No “Request addition” workflow.

---

## 2. What Is Left to Implement

### 2.1 ID Generation and Registry Model (Net New)

1. **Define and implement all 19 ID formats** (e.g. in `src/lib/ontology-ids.ts` or similar):
   - CT-, SC-, SR-, CO- (ISO3), NR-, ST-, SZ-, LGA-, FC-, SC- (state const), WD-, TW-, TL1–4-, VL-, HM-, LN-, KD-, EF-, NF-.
   - Rules: uppercase, hyphen only, embed parent for uniqueness, no reuse after soft delete.

2. **Firebase (or equivalent) registry collections** per entity type, e.g.:
   - Documents with: `id`, `name`, `parentId`, `isPublic`, `sortOrder` (or `name` for ordering), optional metadata.
   - Query pattern: `WHERE parentId == selectedParent AND isPublic == true ORDER BY name`.
   - Indexes on `parentId` (and optionally `isPublic`) for lazy loading.

3. **Soft delete:** Never delete; set `isPublic = false` (or equivalent) and treat as inactive in dropdowns.

### 2.2 Data Layer Gaps

| Gap | Action |
|-----|--------|
| **Sub-Region** (SR-) | Add Sub-Region under Sub-Continent in data/registry (e.g. West Africa → “West Africa” sub-region). Currently only Nigerian “Region” exists. |
| **Country as ISO3** | Store/lookup country by ISO 3-letter code (e.g. NGA, USA). Map display names to CO-NGA, etc. |
| **National Region** | Already as “Region”; ensure it has NR-{ISO3}-{NAME} when moving to ID-based registry. |
| **State Constituency** | Populate `stateConstituencies` (or registry) by LGA/State and expose as dropdown; no manual text when list exists. |
| **Political Ward** | Expose wards from `nigeria-wards.json` as dropdown filtered by **LGA and State Constituency** (spec: `WHERE LGA_ID == selected_LGA AND State_Constituency_ID == selected_SC`). |
| **Town Admin 1–4** | Move from text inputs to **registry + dropdowns**: TL1 by Town, TL2 by TL1, TL3 by TL2, TL4 by TL3. Requires seeded or user-requestable data. |
| **Hamlet** | First-class entity HM-{VL_ID}-{HAMLET}; dropdown by Village (from registry or existing hierarchy). |
| **Lineage** | New entity LN-{TOWN_ID}-{LINEAGE}; cultural overlay branch Town → Lineage → Kindred. |
| **Kindred (dual path)** | Kindred dropdown: if **Lineage** selected → filter by Lineage; else filter by **Hamlet**. |
| **Extended Family / Nuclear Family as entities** | Optional: EF- and NF- entities in registry (e.g. EF under Kindred, NF under EF) for compound-level tracing; currently only surname/family name stored. |

### 2.3 Cascading Dropdown Logic (Align to Spec)

1. **Primary cascade (full order):**  
   Continent → Sub-Continent → Sub-Region → Country → National Region → State → Senatorial Zone → LGA → Town → Town Admin 1 → 2 → 3 → 4 → Village → Hamlet → Kindred → Extended Family → Nuclear Family.  
   Ensure each step filters by **parent ID** (once IDs exist) and resets children on parent change.

2. **Political overlay branch:**  
   From State: Senatorial Zone, Federal Constituency, State Constituency, Political Ward.  
   Ward: filter by `LGA_ID` and `State_Constituency_ID`.

3. **Cultural overlay branch:**  
   Town → Lineage → Kindred; and Kindred logic: by Lineage **or** by Hamlet (as above).

4. **Lazy loading:**  
   Use registry queries (e.g. Firestore) per parent; cache only Continent→Country and Country→State if desired (spec’s performance strategy).

### 2.4 Schema and Submission Storage

1. **Person / Submission schema:**  
   Add **ID fields** for every level you want to persist (e.g. `originContinentId`, `originStateId`, `originLgaId`, `originTownId`, …, `originKindredId`, etc.). Keep name fields for display/backward compatibility if needed.

2. **Form submission:**  
   Store **IDs** (and optionally names) in submissions and person records. Validation: only allow values that exist in the registry (dropdown selection).

3. **Display:**  
   Resolve ID → name from registry or cache when showing records.

### 2.5 UX and Governance

1. **No manual entry where dropdown exists:**  
   Remove free-text fallbacks for levels that have a registry/dropdown; use “Request addition” instead of “Other (Enter Manually)” where spec applies.

2. **“Request addition” workflow:**  
   When value not in list, user requests addition; admin/curator adds to registry (with correct parent and generated ID); user can then select.

3. **Validation rules matrix:**  
   Optional but recommended: document allowed parent-child pairs and validation rules (e.g. State must belong to selected Country/Region) to prevent structural errors.

---

## 3. Implementation Order (Suggested)

1. **Phase 1 – IDs and registry model**  
   - Add ontology ID generation (all 19 types).  
   - Add Firestore (or JSON/API) registry collections with `id`, `name`, `parentId`, `isPublic`.  
   - Seed or migrate: continents, countries (with ISO3), Nigerian regions/states/LGAs/wards, towns (from existing JSON), then villages/kindreds/umunna from hierarchy where possible.

2. **Phase 2 – Political and town admin**  
   - State Constituency list/registry; Political Ward dropdown by LGA + State Constituency.  
   - Town Admin Level 1–4 as registry + cascaded dropdowns.

3. **Phase 3 – Cultural overlay and Kindred dual path**  
   - Lineage entity and Town → Lineage → Kindred.  
   - Hamlet as entity; Kindred filter by Lineage or Hamlet.

4. **Phase 4 – Schema and form**  
   - Add ID fields to person/submission schema; form writes IDs from dropdowns.  
   - Replace manual entry with “Request addition” where applicable.  
   - Optional: Extended Family / Nuclear Family as registry entities.

5. **Phase 5 – Performance and governance**  
   - Caching (e.g. continent→country, country→state); lazy-load below LGA; Firestore indexes on `parentId`.  
   - Researcher governance manual and validation rules matrix.

---

## 4. Summary Table

| Area | Status | Left to do |
|------|--------|------------|
| **ID conventions (19 types)** | ❌ Not started | Implement generators; use in registry and submissions |
| **Registry (Firebase/API)** | ❌ Not started | Collections with parentId, isPublic; lazy load by parent |
| **Sub-Region (global)** | ⚠️ Only Nigerian Region | Add SR layer and data |
| **Country ISO3** | ❌ Names only | Store/link ISO3; CO-{ISO3} IDs |
| **State Constituency** | ⚠️ Empty / text | Populate and dropdown |
| **Political Ward** | ⚠️ Data exists, not wired | Dropdown by LGA + State Constituency |
| **Town Admin 1–4** | ⚠️ Text only | Registry + cascaded dropdowns |
| **Hamlet** | ⚠️ Text only | Entity + dropdown by Village |
| **Lineage** | ❌ Missing | Entity LN-{TOWN_ID}; Town→Lineage→Kindred |
| **Kindred (Lineage vs Hamlet)** | ⚠️ Village only | Add Lineage path; Kindred by Lineage or Hamlet |
| **Store IDs in submission/person** | ❌ Names only | Add ID fields; persist from dropdowns |
| **No manual entry / Request addition** | ❌ Manual allowed | Remove text fallbacks; add request workflow |
| **Caching / indexes** | ❌ N/A | Cache top levels; index parentId |

This gives you a clear checklist to complete the institutional ontology in your codebase.

---

## 5. Implemented (Current Codebase)

- **`src/lib/ontology-ids.ts`** — All 19 ID generators (CT-, SC-, SR-, CO-, NR-, ST-, SZ-, LGA-, FC-, SC-, WD-, TW-, TL1–4-, VL-, HM-, LN-, KD-, EF-, NF-) with `toIdSegment` and country ISO3 helper.
- **`src/lib/ontology-types.ts`** — `OntologyType`, `OntologyEntity`, `OntologyDocument`.
- **`src/lib/ontology-registry.ts`** — Firestore collection `ontology`; `getOntologyById`, `getOntologyChildren`, `getOntologyRoots`; typed helpers (`getContinents`, `getStates`, `getLgas`, `getTowns`, `getVillages`, `getKindreds`, etc.); `upsertOntologyEntity` / `upsertOntologyEntities` for seed and admin.
- **`src/lib/ontology-seed.ts`** — `buildOntologySeed()`: continents, sub-continents, countries, Nigerian national regions, states, senatorial zones, federal constituencies, **state constituencies** (by state), LGAs, wards, towns, villages and kindreds from genealogy hierarchy.
- **`src/app/api/admin/seed-ontology/route.ts`** — POST to seed the registry (run once after deploy or when refreshing data).
- **`src/app/api/ontology/children/route.ts`** — GET `?parentId=...&type=...` for lazy-loading dropdown options.
- **`firestore.indexes.json`** — Composite indexes for `parentId` + `type` + `isPublic` + `name`.
- **Person schema** — `LineageFields` and `PersonFormSubmission` include optional `origin*Id` fields (e.g. `originStateId`, `originLgaId`, `originTownId`, `originVillageId`, `originKindredId`, etc.); `createPersonFromForm` maps them into the saved record.
- **State constituencies** — `stateConstituenciesByState` in `extended-location-data.ts` (Abia, Anambra, Ebonyi, Enugu, Imo) and seeded as `STATE_CONSTITUENCY` entities.

### How to use

1. **Deploy Firestore indexes** (if using Firebase CLI): `firebase deploy --only firestore:indexes`
2. **Seed the ontology**: `POST /api/admin/seed-ontology` (e.g. from browser or curl). Creates/updates all continents, countries, Nigerian regions/states/LGAs/wards/towns and hierarchy villages/kindreds.
3. **Form integration**: Use `GET /api/ontology/children?parentId=CO-NGA&type=STATE` (and similar) to populate dropdowns; store selected `id` in `originStateId`, etc., and submit with the form so person records persist ontology IDs.
