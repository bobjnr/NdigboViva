const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const CSV_DIR = path.join(__dirname, '..', 'docs', 'dropdown data', 'Nigeria Current Location Info');
const TOWN_DIR = path.join(CSV_DIR, 'town current location');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'csv-dropdown-data.json');
const NON_TOWN_PATTERNS = [
  /\baxis\b/i,
  /\bcommunit(?:y|ies)\b/i,
  /\bsettlement(?:s)?\b/i,
  /\bdistrict(?:s)?\b/i,
  /\blayout\b/i,
  /\bestate\b/i,
  /\bcamp\b/i,
  /\bgra\b/i,
  /\btown hall\b/i,
  /\burban\b/i,
  /\bheadquarters\b/i,
  /\barea\b/i,
];

function parseCsv(text) {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r/g, '');
  const lines = normalized.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current);

    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim();
    });

    return row;
  });
}

function readCsv(filename) {
  const filepath = path.join(CSV_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`Missing: ${filename}`);
    return [];
  }

  return parseCsv(fs.readFileSync(filepath, 'utf8'));
}

function normalizeSpreadsheetRows(rows) {
  return rows.map((row) => {
    const normalized = {};
    Object.entries(row || {}).forEach(([key, value]) => {
      normalized[String(key).trim()] = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
    });
    return normalized;
  });
}

function readTownFolderRows() {
  if (!fs.existsSync(TOWN_DIR)) return [];

  return fs.readdirSync(TOWN_DIR)
    .filter((file) => /\.(csv|xlsx)$/i.test(file))
    .flatMap((file) => {
      const filepath = path.join(TOWN_DIR, file);

      if (/\.csv$/i.test(file)) {
        return parseCsv(fs.readFileSync(filepath, 'utf8'));
      }

      const workbook = XLSX.readFile(filepath);
      return workbook.SheetNames.flatMap((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        return normalizeSpreadsheetRows(rows);
      });
    });
}

function buildParentMap(rows, parentField) {
  const map = {};
  for (const row of rows) {
    const parentId = row[parentField];
    if (!parentId) continue;
    if (!map[parentId]) map[parentId] = [];
    if (row.name && !map[parentId].includes(row.name)) {
      map[parentId].push(row.name);
    }
  }
  return map;
}

function buildParentMapWithIds(rows, parentField) {
  const map = {};
  for (const row of rows) {
    const parentId = row[parentField];
    if (!parentId) continue;
    if (!map[parentId]) map[parentId] = [];
    if (row.name && !map[parentId].find((entry) => entry.id === row.id)) {
      map[parentId].push({ id: row.id, name: row.name });
    }
  }
  return map;
}

function pushUnique(map, key, value) {
  if (!key || !value) return;
  if (!map[key]) map[key] = [];
  if (!map[key].includes(value)) map[key].push(value);
}

function toTitleCase(value) {
  return (value || '')
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function getLgaNameFromId(lgaId) {
  const value = String(lgaId || '').trim();
  if (!value) return '';

  const lower = value.toLowerCase();
  const prefixedMatch = lower.match(/^lga_[a-z]{2}_(.+)$/);
  if (prefixedMatch) {
    return toTitleCase(prefixedMatch[1]);
  }

  if (lower.includes('_')) {
    const parts = lower.split('_').filter(Boolean);
    if (parts.length > 1) {
      return toTitleCase(parts.slice(1).join(' '));
    }
  }

  return toTitleCase(lower);
}

function shouldIncludeTownName(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  return !NON_TOWN_PATTERNS.some((pattern) => pattern.test(value));
}

console.log('Reading CSVs...');
const towns = readCsv('towns.csv');
const townFolderRows = readTownFolderRows();
const level1s = readCsv('townAdminLevel1.csv');
const level2s = readCsv('townAdminLevel2.csv');
const clans = readCsv('clans.csv');
const villages = readCsv('villages.csv');
const hamlets = readCsv('hamlets.csv');
const kindreds = readCsv('kindreds.csv');
const umunnas = readCsv('umunna.csv');
const lgas = readCsv('lgas.csv');

const level1sByTown = buildParentMapWithIds(level1s, 'townId');
const level2sByLevel1 = buildParentMapWithIds(level2s, 'townAdminLevel1Id');
const clansByLevel2 = buildParentMapWithIds(clans, 'townAdminLevel2Id');
const villagesByClan = buildParentMapWithIds(villages, 'clanId');
const hamletsByVillage = buildParentMapWithIds(hamlets, 'villageId');
const kindredsByHamlet = buildParentMapWithIds(kindreds, 'hamletId');
const umunnasByKindred = buildParentMap(umunnas, 'kindredId');

const townIdToName = Object.fromEntries(towns.map((row) => [row.id, row.name]));
const level1IdToName = Object.fromEntries(level1s.map((row) => [row.id, row.name]));
const level2IdToName = Object.fromEntries(level2s.map((row) => [row.id, row.name]));
const clanIdToName = Object.fromEntries(clans.map((row) => [row.id, row.name]));
const villageIdToName = Object.fromEntries(villages.map((row) => [row.id, row.name]));
const hamletIdToName = Object.fromEntries(hamlets.map((row) => [row.id, row.name]));
const kindredIdToName = Object.fromEntries(kindreds.map((row) => [row.id, row.name]));
const lgaIdToName = Object.fromEntries(
  lgas
    .map((row) => [String(row.lga_id || row.id || '').trim().toLowerCase(), row.lga_name || row.name || ''])
    .filter(([, name]) => Boolean(name))
);

const level1sByTownName = {};
for (const [townId, items] of Object.entries(level1sByTown)) {
  const townName = townIdToName[townId];
  if (!townName) continue;
  for (const { name } of items) {
    pushUnique(level1sByTownName, townName, name);
  }
}

const level2sByLevel1Name = {};
for (const [level1Id, items] of Object.entries(level2sByLevel1)) {
  const level1Name = level1IdToName[level1Id];
  if (!level1Name) continue;
  for (const { name } of items) {
    pushUnique(level2sByLevel1Name, level1Name, name);
  }
}

const clansByLevel2Name = {};
for (const [level2Id, items] of Object.entries(clansByLevel2)) {
  const level2Name = level2IdToName[level2Id];
  if (!level2Name) continue;
  for (const { name } of items) {
    pushUnique(clansByLevel2Name, level2Name, name);
  }
}

const villagesByClanName = {};
for (const [clanId, items] of Object.entries(villagesByClan)) {
  const clanName = clanIdToName[clanId];
  if (!clanName) continue;
  for (const { name } of items) {
    pushUnique(villagesByClanName, clanName, name);
  }
}

const hamletsByVillageName = {};
for (const [villageId, items] of Object.entries(hamletsByVillage)) {
  const villageName = villageIdToName[villageId];
  if (!villageName) continue;
  for (const { name } of items) {
    pushUnique(hamletsByVillageName, villageName, name);
  }
}

const kindredsByHamletName = {};
for (const [hamletId, items] of Object.entries(kindredsByHamlet)) {
  const hamletName = hamletIdToName[hamletId];
  if (!hamletName) continue;
  for (const { name } of items) {
    pushUnique(kindredsByHamletName, hamletName, name);
  }
}

const umunnasByKindredName = {};
for (const [kindredId, names] of Object.entries(umunnasByKindred)) {
  const kindredName = kindredIdToName[kindredId];
  if (!kindredName) continue;
  for (const name of names) {
    pushUnique(umunnasByKindredName, kindredName, name);
  }
}

const townsByLgaName = {};
for (const row of townFolderRows) {
  const lgaId = String(row.lga_id || row.lgaId || '').trim().toLowerCase();
  const townName = String(row.town_name || row.name || '').trim();
  if (!lgaId || !shouldIncludeTownName(townName)) continue;

  const lgaName = lgaIdToName[lgaId] || getLgaNameFromId(lgaId);
  pushUnique(townsByLgaName, lgaName, townName);
}

Object.keys(townsByLgaName).forEach((lgaName) => {
  townsByLgaName[lgaName].sort((a, b) => a.localeCompare(b));
});

const output = {
  townsByLgaName,
  level1sByTownName,
  level2sByLevel1Name,
  clansByLevel2Name,
  villagesByClanName,
  hamletsByVillageName,
  kindredsByHamletName,
  umunnasByKindredName,
  _meta: {
    generatedAt: new Date().toISOString(),
    townFolderRowCount: townFolderRows.length,
    townCount: towns.length,
    level1Count: level1s.length,
    level2Count: level2s.length,
    clanCount: clans.length,
    villageCount: villages.length,
    hamletCount: hamlets.length,
    kindredCount: kindreds.length,
    umunnaCount: umunnas.length,
  },
};

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), 'utf8');
console.log(`Written ${OUT_FILE}`);
console.log('Stats:', output._meta);
