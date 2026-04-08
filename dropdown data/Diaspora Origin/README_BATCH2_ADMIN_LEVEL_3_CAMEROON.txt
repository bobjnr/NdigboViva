README_BATCH2_ADMIN_LEVEL_3_CAMEROON.txt

Scope
- Country covered: Cameroon (CT_CMR)
- File updated: 09_administration_level_3.csv

Model used
- ADM1 = Region
- ADM2 = Department
- ADM3 = Commune / municipality seed layer

Implementation notes
- ADM3 rows were generated conservatively from the published municipality/commune list and linked to the existing department-level ADM2 structure.
- This gives a broad ancestry-ready dropdown seed for Cameroon.
- This batch is not a full all-arrondissement gazetteer; Douala and Yaoundé urban district subdivisions can be added later in an enrichment pass if needed.
- A later enrichment pass can also add town, village, settlement, ethnic-community, and migration-lineage annotations beneath or alongside this layer.

Files added / updated
- 09_administration_level_3.csv
- 09_administration_level_3_country_status.csv
- 09_administration_level_3_batch2_cameroon_summary.csv

Row count
- Cameroon ADM3 rows added: 332
