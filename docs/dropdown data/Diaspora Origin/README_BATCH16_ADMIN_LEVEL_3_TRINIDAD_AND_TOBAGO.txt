TRINIDAD AND TOBAGO - ADM3 BATCH 16

Model used
- Country: Trinidad and Tobago
- ADM1: region / borough / city / ward (existing file)
- ADM2: retained separately only for Tobago electoral districts in the ADM2 file
- ADM3: settlement seed

Implementation choice
- This country uses a mixed local-government structure.
- For genealogy capture, this batch seeds ADM3 directly from the published list of cities, towns, settlements, and villages.
- Rows are mapped to the existing ADM1 units in 07_administration_level_1.csv.
- ADM2 is intentionally left blank in this batch's ADM3 rows so the country can function as a mixed direct-ADM1-to-ADM3 seed while preserving the separate Tobago ADM2 structure already present in 08_administration_level_2.csv.

Scope
- 284 ADM3 rows added for Trinidad and Tobago.

Sources
- https://en.wikipedia.org/wiki/List_of_cities_and_towns_in_Trinidad_and_Tobago
- https://en.wikipedia.org/wiki/Regions_and_municipalities_of_Trinidad_and_Tobago
- https://ebctt.com/electoral-districts-for-2026-tha-elections/
