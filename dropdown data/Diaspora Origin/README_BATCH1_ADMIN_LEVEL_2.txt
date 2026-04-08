Igbo Diaspora Origin - Administration Level 2 - Batch 1

This pack adds 08_administration_level_2.csv for the Batch 1 region-model countries:
- Cameroon
- Ghana
- Togo
- Guyana

Schema:
- admin_level_2_id
- admin_level_2_name
- admin_level_1_id
- country_id

Batch 1 logic:
- Cameroon: full region -> division build
- Ghana: full region -> district/MMDA build
- Togo: full region -> prefecture build
- Guyana: selective region -> stable NDC/local authority build

Important note for Guyana:
This is intentionally selective. It is not a forced countrywide second-level build.
Potaro-Siparuni and Upper Takutu-Upper Essequibo currently remain without active clean ADM2 rows in this file.

This file is ancestry-routing infrastructure for later Administration Level 3 town/city/settlement work.