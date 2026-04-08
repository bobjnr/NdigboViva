BATCH 5 - MIXED ISLAND EXCEPTIONS

Countries covered
- Sao Tome and Principe
- Trinidad and Tobago

What was added
- Trinidad and Tobago: 15 current Tobago House of Assembly electoral districts were added under ADM1_TTO_TOBAGO.
- Sao Tome and Principe: no ADM2 rows were added.

Why Sao Tome and Principe has no ADM2 rows
- In the current national structure, districts are the only administrative subdivisions.
- For ancestry capture, the clean model is:
  country -> ADM1 district/autonomous region -> ADM3 town/city/settlement

Why Trinidad and Tobago was only selectively populated
- Tobago has a current, clearly defined electoral-district layer.
- Trinidad's municipal corporations do not share one simple ancestry-safe ADM2 layer across all corporation types.
- Rather than force a mixed or weak hierarchy, this batch adds only the clean Tobago layer.

Numbering correction
- The earlier island-model batch should be treated as Batch 4.
- This package is the corrected Batch 5.
