Batch 4 — Benin ADM3

This batch adds Benin to 09_administration_level_3.csv.

Model used
- ADM1 = Department
- ADM2 = Commune
- ADM3 = Arrondissement

Notes
- Each Benin ADM2 commune row received its published arrondissement children.
- This is a strong ancestry-ready base because arrondissements sit below communes and above villages / quartiers.
- The commune-by-arrondissement list yields 546 named rows in this build; later enrichment can proceed to village, town, and neighborhood detail.
