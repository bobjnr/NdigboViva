Igbo Genealogy Diaspora Template Pack - City/Town Added

Files included:
- Continent.csv
- Sub-continent.csv
- Citizenship Status.csv
- Country of Residence.csv
- First-Level Administrative Division.csv
- Second-Level Administrative Division.csv
- City-Town.csv

City-Town.csv headers:
city_town_id,city_town_name,country_id,first_level_admin_division_id

Population summary:
- City/Town rows: 153669
- Countries/territories covered in City-Town.csv: 217
- Rows linked to first-level administrative divisions: 152483
- Rows retained with blank first_level_admin_division_id (no reliable link in current pack): 1186

Mapping summary:
- first_level_code: 132808
- first_level_name: 639
- second_level_code_parent: 19036
- second_level_name_parent: 0
- unresolved: 1186

Source basis:
- Global city/state/country dataset from dr5hn/countries-states-cities-database
- Mapped into this pack's existing country_id and first_level_admin_division_id structure

Notes:
- Kosovo/XK rows from the source were excluded because XK is not present in the current Country of Residence.csv file.
- Some rows remain without first_level_admin_division_id where the source administrative layer could not be reconciled to the existing first-level structure without forcing incorrect mappings.
