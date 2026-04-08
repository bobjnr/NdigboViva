BATCH 13 — GRENADA (ADM3)

Country:
- Grenada (CT_GRD)

Model used:
- ADM1 = Parish / dependency
- ADM2 = Skipped by design
- ADM3 = Settlement seed

Result:
- 344 ADM3 rows added for Grenada
- cumulative 09_administration_level_3.csv rows: 3177

Method:
- Built as a direct ADM1 -> ADM3 country.
- Seeded named settlements beneath the six parishes and the Carriacou and Petite Martinique dependency.
- Used the current parish-by-parish settlement compilation from WikiGrenada as the operational seed source.
- Filtered out obvious street-only micro-entries so the file stays closer to town / village / settlement ancestry logic.

Design note:
- Grenada is modeled without ADM2 because the parish/dependency -> settlement flow is cleaner for ancestry capture than forcing an artificial middle layer.
- This is a strong ancestry-ready partial seed, not a complete national gazetteer.

Files updated:
- 09_administration_level_3.csv
- 09_administration_level_3_country_status.csv
- 09_administration_level_3_batch13_grenada_summary.csv
