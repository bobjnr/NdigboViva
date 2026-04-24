/**
 * Institutional Ontology — Strict ID Generation Conventions
 * All IDs: uppercase, hyphen only, no spaces, immutable, embed parent for uniqueness.
 */

/** Normalize a name to ID-safe segment: UPPERCASE, spaces/special → hyphen, no leading/trailing hyphen */
export function toIdSegment(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || '';
}

/** Country name → ISO 3-letter code (subset used in app; extend as needed) */
const COUNTRY_ISO3: Record<string, string> = {
  NIGERIA: 'NGA',
  'UNITED STATES': 'USA',
  'UNITED KINGDOM': 'GBR',
  CANADA: 'CAN',
  GERMANY: 'DEU',
  FRANCE: 'FRA',
  GHANA: 'GHA',
  'SOUTH AFRICA': 'ZAF',
  CAMEROON: 'CMR',
  'IVORY COAST': 'CIV',
  'BENIN': 'BEN',
  TOGO: 'TGO',
  'EQUATORIAL GUINEA': 'GNQ',
};
/** Derive ISO3 from country name when not in map: first 3 letters of normalized name, padded */
function countryToIso3(countryName: string): string {
  const key = countryName.trim().toUpperCase().replace(/\s+/g, ' ');
  if (COUNTRY_ISO3[key]) return COUNTRY_ISO3[key];
  const segment = toIdSegment(countryName);
  if (segment.length >= 3) return segment.slice(0, 3);
  return segment.padEnd(3, 'X');
}

// ─── 1. CONTINENT ─────────────────────────────────────────────────────────
/** Format: CT-{CODE} e.g. CT-AFRICA */
export function continentId(code: string): string {
  return `CT-${toIdSegment(code) || 'UNKNOWN'}`;
}

// ─── 2. SUB-CONTINENT ─────────────────────────────────────────────────────
/** Format: SC-{CONTINENT}-{NAME} e.g. SC-AFRICA-WEST */
export function subContinentId(continentIdVal: string, name: string): string {
  const cont = continentIdVal.replace(/^CT-/, '');
  return `SC-${cont}-${toIdSegment(name) || 'UNKNOWN'}`;
}

// ─── 3. SUB-REGION ────────────────────────────────────────────────────────
/** Format: SR-{CONTINENT}-{SUBCONTINENT}-{NAME} */
export function subRegionId(subContinentIdVal: string, name: string): string {
  const parts = subContinentIdVal.replace(/^SC-/, '').split('-');
  return `SR-${parts.join('-')}-${toIdSegment(name) || 'UNKNOWN'}`;
}

// ─── 4. COUNTRY ───────────────────────────────────────────────────────────
/** Format: CO-{ISO3} e.g. CO-NGA. Pass country name or existing ISO3. */
export function countryId(countryNameOrIso3: string): string {
  const upper = countryNameOrIso3.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(upper)) return `CO-${upper}`;
  return `CO-${countryToIso3(countryNameOrIso3)}`;
}

// ─── 5. NATIONAL REGION ───────────────────────────────────────────────────
/** Format: NR-{ISO3}-{REGION_NAME} e.g. NR-NGA-SOUTHEAST */
export function nationalRegionId(countryIdVal: string, regionName: string): string {
  const iso3 = countryIdVal.replace(/^CO-/, '');
  return `NR-${iso3}-${toIdSegment(regionName) || 'UNKNOWN'}`;
}

// ─── 6. STATE ────────────────────────────────────────────────────────────
/** Format: ST-{ISO3}-{STATE} e.g. ST-NGA-ANAMBRA */
export function stateId(countryIdVal: string, stateName: string): string {
  const iso3 = countryIdVal.replace(/^CO-/, '');
  return `ST-${iso3}-${toIdSegment(stateName) || 'UNKNOWN'}`;
}

// ─── 7. SENATORIAL ZONE ───────────────────────────────────────────────────
/** Format: SZ-{STATE_ID}-{ZONE} e.g. SZ-ST-NGA-ANAMBRA-NORTH */
export function senatorialZoneId(stateIdVal: string, zoneName: string): string {
  return `SZ-${stateIdVal}-${toIdSegment(zoneName) || 'UNKNOWN'}`;
}

// ─── 8. LGA ──────────────────────────────────────────────────────────────
/** Format: LGA-{STATE_ID}-{LGA} */
export function lgaId(stateIdVal: string, lgaName: string): string {
  return `LGA-${stateIdVal}-${toIdSegment(lgaName) || 'UNKNOWN'}`;
}

// ─── 9. FEDERAL CONSTITUENCY ─────────────────────────────────────────────
/** Format: FC-{STATE_ID}-{NAME} */
export function federalConstituencyId(stateIdVal: string, name: string): string {
  return `FC-${stateIdVal}-${toIdSegment(name) || 'UNKNOWN'}`;
}

// ─── 10. STATE CONSTITUENCY ───────────────────────────────────────────────
/** Format: SC-{STATE_ID}-{NAME}. Distinguishable from Sub-Continent (SC-{CONTINENT}-{NAME}) by STATE_ID starting with ST-. */
export function stateConstituencyId(stateIdVal: string, name: string): string {
  return `SC-${stateIdVal}-${toIdSegment(name) || 'UNKNOWN'}`;
}

// ─── 11. POLITICAL WARD ──────────────────────────────────────────────────
/** Format: WD-{LGA_ID}-W{NUMBER} e.g. WD-LGA-ST-NGA-ANAMBRA-ANAOCHA-W01 */
export function wardId(lgaIdVal: string, wardNumberOrName: string): string {
  const num = /^\d+$/.test(wardNumberOrName) ? wardNumberOrName.padStart(2, '0') : toIdSegment(wardNumberOrName).slice(0, 8);
  return `WD-${lgaIdVal}-W${num}`;
}

// ─── 12. TOWN ─────────────────────────────────────────────────────────────
/** Format: TW-{LGA_ID}-{TOWN} */
export function townId(lgaIdVal: string, townName: string): string {
  return `TW-${lgaIdVal}-${toIdSegment(townName) || 'UNKNOWN'}`;
}

export function clanId(townIdVal: string, clanName: string): string {
  return `CL-${townIdVal}-${toIdSegment(clanName) || 'UNKNOWN'}`;
}

// ─── 13. TOWN ADMIN LEVELS ───────────────────────────────────────────────
/** TL1-{TOWN_ID}-{NAME} */
export function townLevel1Id(townIdVal: string, name: string): string {
  return `TL1-${townIdVal}-${toIdSegment(name) || 'UNKNOWN'}`;
}
/** TL2-{TL1_ID}-{NAME} */
export function townLevel2Id(tl1Id: string, name: string): string {
  return `TL2-${tl1Id}-${toIdSegment(name) || 'UNKNOWN'}`;
}
/** TL3-{TL2_ID}-{NAME} */
export function townLevel3Id(tl2Id: string, name: string): string {
  return `TL3-${tl2Id}-${toIdSegment(name) || 'UNKNOWN'}`;
}
/** TL4-{TL3_ID}-{NAME} */
export function townLevel4Id(tl3Id: string, name: string): string {
  return `TL4-${tl3Id}-${toIdSegment(name) || 'UNKNOWN'}`;
}

// ─── 14. VILLAGE ─────────────────────────────────────────────────────────
/** Format: VL-{TOWN_ID}-{VILLAGE} */
export function villageId(clanIdVal: string, villageName: string): string {
  return `VL-${clanIdVal}-${toIdSegment(villageName) || 'UNKNOWN'}`;
}

// ─── 15. HAMLET ──────────────────────────────────────────────────────────
/** Format: HM-{VILLAGE_ID}-{HAMLET} */
export function hamletId(villageIdVal: string, hamletName: string): string {
  return `HM-${villageIdVal}-${toIdSegment(hamletName) || 'UNKNOWN'}`;
}

// ─── 16. LINEAGE ──────────────────────────────────────────────────────────
/** Format: LN-{TOWN_ID}-{LINEAGE} */
export function lineageId(townIdVal: string, lineageName: string): string {
  return `LN-${townIdVal}-${toIdSegment(lineageName) || 'UNKNOWN'}`;
}

// ─── 17. KINDRED ─────────────────────────────────────────────────────────
/** Format: KD-{HAMLET_ID}-{KINDRED} or KD-{VILLAGE_ID}-{KINDRED} or KD-{LINEAGE_ID}-{KINDRED} */
export function kindredId(parentIdVal: string, kindredName: string): string {
  return `KD-${parentIdVal}-${toIdSegment(kindredName) || 'UNKNOWN'}`;
}

// ─── 18. EXTENDED FAMILY ──────────────────────────────────────────────────
/** Format: EF-{KINDRED_ID}-{HOUSE} */
export function extendedFamilyId(kindredIdVal: string, houseName: string): string {
  return `EF-${kindredIdVal}-${toIdSegment(houseName) || 'UNKNOWN'}`;
}

// ─── 19. NUCLEAR FAMILY ───────────────────────────────────────────────────
/** Format: NF-{EXTENDED_FAMILY_ID}-{HEADSURNAME} */
export function nuclearFamilyId(extendedFamilyIdVal: string, headSurname: string): string {
  return `NF-${extendedFamilyIdVal}-${toIdSegment(headSurname) || 'UNKNOWN'}`;
}

/** Parse ontology ID prefix (CT, SC, CO, ST, LGA, TW, VL, etc.) */
export function getOntologyIdPrefix(id: string): string {
  const match = id?.match(/^([A-Z0-9]{2,4})-/) ?? null;
  return match ? match[1] : '';
}

/** Check if a string looks like a valid ontology ID (prefix-body with hyphens) */
export function isOntologyId(id: string): boolean {
  return typeof id === 'string' && /^[A-Z]{2,4}-[A-Z0-9-]+$/.test(id.trim());
}
