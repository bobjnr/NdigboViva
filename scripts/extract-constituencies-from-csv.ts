/**
 * Extracts senatorial districts, federal and state constituencies from NDIGBO_VIVA_DATABASE CSV
 * and writes src/lib/ndigbo-viva-constituencies.json for use in forms.
 *
 * Run: npx tsx scripts/extract-constituencies-from-csv.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CSV_PATH = path.join(__dirname, '..', 'NDIGBO_VIVA_DATABASE_ALL.csv');
const OUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'ndigbo-viva-constituencies.json');

// CSV column indices (0-based): STATE=8, SENATORIAL DISTRICT=9, FEDERAL CONSTITUENCY=10, STATE CONSTITUENCY=12
const IDX_STATE = 8;
const IDX_SENATORIAL = 9;
const IDX_FEDERAL = 10;
const IDX_STATE_CONST = 12;

function normalizeState(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  // Title case: "ANAMBRA" -> "Anambra", "AKWA IBOM" -> "Akwa Ibom"
  return t
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function normalizeConstituency(raw: string): string {
  return raw.trim();
}

function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === ',' && !inQuotes) || (c === '\n' && !inQuotes)) {
      result.push(current);
      current = '';
      if (c === '\n') break;
    } else {
      if (c !== '\r') current += c;
    }
  }
  if (current.length > 0 || inQuotes) result.push(current);
  return result;
}

function main() {
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split(/\r?\n/);

  const senatorialByState: Record<string, Set<string>> = {};
  const federalByState: Record<string, Set<string>> = {};
  const stateConstByState: Record<string, Set<string>> = {};

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = parseCsvRow(line);
    if (row.length <= Math.max(IDX_STATE, IDX_SENATORIAL, IDX_FEDERAL, IDX_STATE_CONST)) continue;

    const stateRaw = row[IDX_STATE] ?? '';
    const senatorialRaw = row[IDX_SENATORIAL] ?? '';
    const federalRaw = row[IDX_FEDERAL] ?? '';
    const stateConstRaw = row[IDX_STATE_CONST] ?? '';

    const state = normalizeState(stateRaw);
    if (!state) continue;

    if (!senatorialByState[state]) senatorialByState[state] = new Set();
    if (normalizeConstituency(senatorialRaw)) senatorialByState[state].add(normalizeConstituency(senatorialRaw));

    if (!federalByState[state]) federalByState[state] = new Set();
    if (normalizeConstituency(federalRaw)) federalByState[state].add(normalizeConstituency(federalRaw));

    if (!stateConstByState[state]) stateConstByState[state] = new Set();
    if (normalizeConstituency(stateConstRaw)) stateConstByState[state].add(normalizeConstituency(stateConstRaw));
  }

  const senatorialDistricts: Record<string, string[]> = {};
  const federalConstituencies: Record<string, string[]> = {};
  const stateConstituenciesByState: Record<string, string[]> = {};

  for (const [state, set] of Object.entries(senatorialByState)) {
    senatorialDistricts[state] = Array.from(set).sort();
  }
  for (const [state, set] of Object.entries(federalByState)) {
    federalConstituencies[state] = Array.from(set).sort();
  }
  for (const [state, set] of Object.entries(stateConstByState)) {
    stateConstituenciesByState[state] = Array.from(set).sort();
  }

  const out = {
    senatorialDistricts,
    federalConstituencies,
    stateConstituenciesByState,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');
  console.log('Wrote', OUT_PATH);
  console.log('States with senatorial districts:', Object.keys(senatorialDistricts).length);
  console.log('States with federal constituencies:', Object.keys(federalConstituencies).length);
  console.log('States with state constituencies:', Object.keys(stateConstituenciesByState).length);
}

main();
