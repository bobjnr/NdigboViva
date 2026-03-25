/**
 * Transfer data from NDIGBO VIVA DATABASE.xlsx to GIGP Updated Template structure.
 * Maps source columns to GIGP template columns and writes a new workbook.
 *
 * Run: npx tsx scripts/transfer-ndigbo-to-gigp.ts
 *
 * Input:  NDIGBO VIVA DATABASE.xlsx (project root)
 * Template: GIGP UPDATED TEMPLATE.xlsx (project root or parent Downloads folder)
 * Output: NDIGBO_VIVA_GIGP_Transferred.xlsx (project root)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

const PROJECT_ROOT = path.join(__dirname, '..');
const SOURCE_PATH = path.join(PROJECT_ROOT, 'NDIGBO VIVA DATABASE.xlsx');
const TEMPLATE_PATHS = [
  path.join(PROJECT_ROOT, 'GIGP UPDATED TEMPLATE.xlsx'),
  path.join(PROJECT_ROOT, '..', 'GIGP UPDATED TEMPLATE.xlsx'),
];
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'NDIGBO_VIVA_GIGP_Transferred.xlsx');

/** Normalize header for mapping: lowercase, remove spaces/special chars */
function normalizeHeader(h: string): string {
  return (h ?? '').toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

/** Source column name (any variant) -> GIGP template field name (from SPREADSHEET_TEMPLATE.md) */
const COLUMN_MAP: Record<string, string> = {
  // Identity
  personid: 'personId',
  fullname: 'fullName',
  name: 'fullName',
  'full name': 'fullName',
  individualname: 'fullName',
  'individual name': 'fullName',
  alternatenames: 'alternateNames',
  gender: 'gender',
  dateofbirth: 'dateOfBirth',
  dob: 'dateOfBirth',
  placeofbirth: 'placeOfBirth',
  photourl: 'photoUrl',
  photoconsent: 'photoConsent',
  // Lineage
  fatherid: 'fatherId',
  motherid: 'motherId',
  spouseids: 'spouseIds',
  childrenids: 'childrenIds',
  umunna: 'umunna',
  clan: 'clan',
  village: 'village',
  kindred: 'kindred',
  kindredhamlet: 'kindred',
  'kindred/hamlet': 'kindred',
  town: 'town',
  townquarter: 'townQuarter',
  'town quarter': 'townQuarter',
  obiareas: 'obiAreas',
  'obi areas': 'obiAreas',
  localgovernmentarea: 'localGovernmentArea',
  lga: 'localGovernmentArea',
  'local government area': 'localGovernmentArea',
  state: 'state',
  senatorialdistrict: 'senatorialDistrict',
  'senatorial district': 'senatorialDistrict',
  federalconstituency: 'federalConstituency',
  'federal constituency': 'federalConstituency',
  stateconstituency: 'stateConstituency',
  'state constituency': 'stateConstituency',
  nwaadalineagelink: 'nwaadaLineageLink',
  // Cultural
  titles: 'titles',
  occupation: 'occupation',
  familytrade: 'familyTrade',
  totem: 'totem',
  ancestralhousename: 'ancestralHouseName',
  notablecontributions: 'notableContributions',
  roles: 'roles',
  // Life events
  marriagedate: 'marriageDate',
  marriageplace: 'marriagePlace',
  deathdate: 'deathDate',
  deathplace: 'deathPlace',
  isdeceased: 'isDeceased',
  displacementnotes: 'displacementNotes',
  sensitivehistoryprivate: 'sensitiveHistoryPrivate',
  // Documentation
  sourcetype: 'sourceType',
  sourcedetails: 'sourceDetails',
  testifiernames: 'testifierNames',
  testifiercontact: 'testifierContact',
  documentscanids: 'documentScanIds',
  documenturls: 'documentUrls',
  story: 'story',
  notes: 'notes',
  // Verification
  verificationlevel: 'verificationLevel',
  consentstatus: 'consentStatus',
  visibilitysetting: 'visibilitySetting',
  // Diaspora
  isdiasporarelative: 'isDiasporaRelative',
  countryofresidence: 'countryOfResidence',
  currentcity: 'currentCity',
  currentstate: 'currentState',
  diasporaconnectioncaseid: 'diasporaConnectionCaseId',
  connectionstatus: 'connectionStatus',
  returnvisitstatus: 'returnVisitStatus',
  returnvisitdate: 'returnVisitDate',
  returnvisitnotes: 'returnVisitNotes',
  // Ext. family / genealogy-style (single column names)
  extfamily: 'fullName',
  'ext. family': 'fullName',
  familyname: 'fullName',
};

/** Build map: source header index -> GIGP field name */
function buildSourceToGigpMap(sourceHeaders: string[]): Map<number, string> {
  const map = new Map<number, string>();
  for (let i = 0; i < sourceHeaders.length; i++) {
    const raw = (sourceHeaders[i] ?? '').toString().trim();
    const normalized = normalizeHeader(raw);
    const gigpField = COLUMN_MAP[normalized];
    if (gigpField) map.set(i, gigpField);
  }
  return map;
}

/** Get value from cell (handle numbers/dates as string for spreadsheet) */
function cellValue(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val).trim();
}

/** Ensure required GIGP defaults on a row object */
function applyDefaults(row: Record<string, string>): void {
  if (!row.consentStatus) row.consentStatus = 'TRUE';
  if (!row.visibilitySetting) row.visibilitySetting = 'PRIVATE';
  if (!row.isDiasporaRelative) row.isDiasporaRelative = 'FALSE';
  if (!row.verificationLevel && row.verificationLevel !== '0') row.verificationLevel = '0';
}

function main() {
  if (!fs.existsSync(SOURCE_PATH)) {
    console.error('Source file not found:', SOURCE_PATH);
    process.exit(1);
  }

  const templatePath = TEMPLATE_PATHS.find((p) => fs.existsSync(p));
  if (!templatePath) {
    console.error('Template not found. Tried:', TEMPLATE_PATHS.join(', '));
    process.exit(1);
  }

  console.log('Reading source:', SOURCE_PATH);
  const sourceWb = XLSX.readFile(SOURCE_PATH, { cellDates: true });
  const sourceSheetName = sourceWb.SheetNames[0];
  const sourceSheet = sourceWb.Sheets[sourceSheetName];
  const sourceRows = XLSX.utils.sheet_to_json<string[]>(sourceSheet, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][];

  if (sourceRows.length === 0) {
    console.error('Source sheet is empty.');
    process.exit(1);
  }

  const sourceHeaders = sourceRows[0];
  const sourceDataRows = sourceRows.slice(1);
  const sourceToGigp = buildSourceToGigpMap(sourceHeaders);

  console.log('Reading template:', templatePath);
  const templateWb = XLSX.readFile(templatePath, { cellDates: true });
  const templateSheetName = templateWb.SheetNames[0];
  const templateSheet = templateWb.Sheets[templateSheetName];
  const templateRows = XLSX.utils.sheet_to_json<string[]>(templateSheet, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][];

  if (templateRows.length === 0) {
    console.error('Template sheet is empty.');
    process.exit(1);
  }

  const gigpHeaders = templateRows[0];
  const gigpHeaderSet = new Set(gigpHeaders);

  // Build output: header row + data rows
  const outputRows: string[][] = [gigpHeaders];

  let skipped = 0;
  for (let r = 0; r < sourceDataRows.length; r++) {
    const sourceRow = sourceDataRows[r];
    const rowObj: Record<string, string> = {};

    sourceToGigp.forEach((gigpField, colIndex) => {
      const val = cellValue(sourceRow[colIndex]);
      if (val !== '') rowObj[gigpField] = val;
    });

    // If no fullName but we have a single "name" column, use first non-empty cell as fallback
    if (!rowObj.fullName) {
      const firstVal = sourceRow.find((c) => cellValue(c) !== '');
      if (firstVal) rowObj.fullName = cellValue(firstVal);
    }

    if (!rowObj.fullName || rowObj.fullName.trim() === '') {
      skipped++;
      continue;
    }

    applyDefaults(rowObj);

    const outRow = gigpHeaders.map((h) => rowObj[h] ?? '');
    outputRows.push(outRow);
  }

  const outSheet = XLSX.utils.aoa_to_sheet(outputRows);
  const outWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(outWb, outSheet, 'Transferred');

  XLSX.writeFile(outWb, OUTPUT_PATH, { bookType: 'xlsx' });

  console.log('Done.');
  console.log('  Rows transferred:', outputRows.length - 1);
  console.log('  Rows skipped (no name):', skipped);
  console.log('  Output:', OUTPUT_PATH);
}

main();
