# Igbo Diaspora Origin – ADM2 Execution Plan

This pack updates `07_administration_level_1.csv` to include `admin_level_1_type` and adds a batch plan for building `08_administration_level_2.csv`.

## Structural rules

1. **Nigeria is excluded** from this diaspora-origin batch.
2. `admin_level_1_type` is captured **row by row**, not just country by country, because some countries use mixed first-level structures.
3. `08_administration_level_2.csv` should only be populated where Level 2 is genuinely useful for routing users toward **indigenous towns/cities/settlements at Level 3**.
4. Where a country has weak or non-genealogical ADM2 layers, keep ADM2 lean and move quickly to **Level 3 settlement mapping**.
5. Town-level capture should remain the layer where you encode:
   - Ethnic / Cultural Identity
   - Migration Lineage
   - Local Community Mapping
   - Atlantic Slave Trade Cultural Diaspora
   - Trade Migration

## Updated Level 1 schema

`07_administration_level_1.csv`
- `admin_level_1_id`
- `admin_level_1_name`
- `country_id`
- `admin_level_1_type`

## Batch execution order for `08_administration_level_2.csv`

### Batch 1 – Region model
Countries:
- Cameroon
- Ghana
- Togo
- Guyana

Execution rule:
- Build the official child layer under each ADM1 region.
- Normalize country-specific labels into a consistent Level 2 storage model.

### Batch 2 – Province model
Countries:
- Equatorial Guinea
- Gabon
- Dominican Republic
- Cuba

Execution rule:
- Build the official child layer under each province.
- Preserve special ADM1 rows such as national districts or special municipalities via `admin_level_1_type`.

### Batch 3 – Department model
Countries:
- Benin
- Haiti

Execution rule:
- Build full ADM2 under each department.
- Use the historical / genealogy-useful layer, not purely electoral units.

### Batch 4 – County / district model
Countries:
- Liberia
- Belize

Execution rule:
- Liberia can support a fuller county → district build.
- Belize should stay lean where ADM2 does not improve ancestry routing.

### Batch 5 – Parish / quarter island model
Countries:
- Jamaica
- Barbados
- Dominica
- Grenada
- Saint Lucia
- Saint Vincent and the Grenadines

Execution rule:
- Use sparse or selective ADM2.
- Prioritize movement from parish / quarter to verified towns, villages, and settlements.

### Batch 6 – Mixed island exceptions
Countries:
- Sao Tome and Principe
- Trinidad and Tobago

Execution rule:
- Handle row-level `admin_level_1_type` differences explicitly before creating children.
- Do not force one ADM2 label across all ADM1 parents.

### Batch 7 – Federal model
Countries:
- United States
- Canada
- Brazil

Execution rule:
- Use country-appropriate county / municipality / equivalent layers.
- Preserve mixed or special rows such as federal districts where present.

### Batch 8 – European special structures
Countries:
- United Kingdom
- Spain
- Portugal

Execution rule:
- Build country-specific ADM2 rules instead of forcing one Europe-wide pattern.
- UK should be split by constituent country during build.
- Spain can follow autonomous community → province.
- Portugal should distinguish mainland districts from autonomous regions.

### Batch 9 – Mixed province / area exception
Country:
- Sierra Leone

Execution rule:
- Preserve the `province` and `area` split in ADM1.
- Normalize districts as ADM2 beneath both.

## Recommended production workflow

For each batch:
1. Confirm the filtered ADM1 parents.
2. Build only clean child rows.
3. Reject purely electoral or unstable units unless they materially help ancestry routing.
4. Tag exceptions in a status file.
5. Move to Level 3 town / settlement capture as soon as the ADM2 layer is stable.
