/**
 * generate-csv-dropdown-data.js
 *
 * Reads all CSV files from "dropdown data/" and generates
 * src/lib/csv-dropdown-data.json with keyed lookup maps for
 * the cascading dropdowns in GenealogyForm.
 *
 * Hierarchy chain:
 *   LGA → Town → TownAdminLevel1 → TownAdminLevel2 → Clan → Village → Hamlet → Kindred → Umunna
 *
 * Run:  node scripts/generate-csv-dropdown-data.js
 */

const fs = require('fs');
const path = require('path');

const CSV_DIR = path.join(__dirname, '..', 'dropdown data');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'csv-dropdown-data.json');

/** Parse CSV text into array of objects using the header row */
function parseCsv(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Handle values that may contain commas inside quotes
    const values = [];
    let cur = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { values.push(cur); cur = ''; }
      else cur += ch;
    }
    values.push(cur);
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
    return obj;
  });
}

function readCsv(filename) {
  const filepath = path.join(CSV_DIR, filename);
  if (!fs.existsSync(filepath)) { console.warn(`Missing: ${filename}`); return []; }
  return parseCsv(fs.readFileSync(filepath, 'utf8'));
}

/** Build a map: parentId → [childName, ...] */
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

/** Build a map: parentId → [{id, name}, ...] (includes child IDs for further cascade) */
function buildParentMapWithIds(rows, parentField) {
  const map = {};
  for (const row of rows) {
    const parentId = row[parentField];
    if (!parentId) continue;
    if (!map[parentId]) map[parentId] = [];
    if (row.name) {
      // Avoid duplicates by id
      if (!map[parentId].find(e => e.id === row.id)) {
        map[parentId].push({ id: row.id, name: row.name });
      }
    }
  }
  return map;
}

console.log('Reading CSVs...');
const towns       = readCsv('towns.csv');           // id, name, lgaId
const level1s     = readCsv('townAdminLevel1.csv'); // id, name, townId
const level2s     = readCsv('townAdminLevel2.csv'); // id, name, townAdminLevel1Id
const clans       = readCsv('clans.csv');           // id, name, townAdminLevel2Id
const villages    = readCsv('villages.csv');        // id, name, clanId
const hamlets     = readCsv('hamlets.csv');         // id, name, villageId
const kindreds    = readCsv('kindreds.csv');        // id, name, hamletId
const umunnas     = readCsv('umunna.csv');          // id, name, kindredId

// --- Build lookup maps (parentId → [child names]) ---
const townsByLga        = buildParentMap(towns,    'lgaId');            // lgaId → [town names]
const level1sByTown     = buildParentMapWithIds(level1s,  'townId');   // townId → [{id, name}]
const level2sByLevel1   = buildParentMapWithIds(level2s,  'townAdminLevel1Id'); // level1Id → [{id,name}]
const clansByLevel2     = buildParentMapWithIds(clans,    'townAdminLevel2Id'); // level2Id → [{id,name}]
const villagesByClan    = buildParentMapWithIds(villages, 'clanId');   // clanId → [{id,name}]
const hamletsByVillage  = buildParentMapWithIds(hamlets,  'villageId'); // villageId → [{id,name}]
const kindredsByHamlet  = buildParentMapWithIds(kindreds, 'hamletId'); // hamletId → [{id,name}]
const umunnasByKindred  = buildParentMap(umunnas, 'kindredId');        // kindredId → [umunna names]

// Build a name-keyed version for the form (uses names, not IDs, as the selected values)
// The form needs: given "Town Admin Level 1 name" → list of "Town Admin Level 2 names"
// But the IDs in different rows can share the same name — use id for robustness.

// ID lookup maps (id → name)
const townIdToName    = Object.fromEntries(towns.map(r => [r.id, r.name]));
const level1IdToName  = Object.fromEntries(level1s.map(r => [r.id, r.name]));
const level2IdToName  = Object.fromEntries(level2s.map(r => [r.id, r.name]));
const clanIdToName    = Object.fromEntries(clans.map(r => [r.id, r.name]));
const villageIdToName = Object.fromEntries(villages.map(r => [r.id, r.name]));
const hamletIdToName  = Object.fromEntries(hamlets.map(r => [r.id, r.name]));
const kindredIdToName = Object.fromEntries(kindreds.map(r => [r.id, r.name]));

// Build name-keyed maps for the form to use (the form stores names as values, not IDs)
// townName → [level1Name, ...]
const level1sByTownName = {};
for (const [townId, items] of Object.entries(level1sByTown)) {
  const townName = townIdToName[townId];
  if (!townName) continue;
  if (!level1sByTownName[townName]) level1sByTownName[townName] = [];
  for (const { name } of items) {
    if (!level1sByTownName[townName].includes(name)) level1sByTownName[townName].push(name);
  }
}

// level1Name → [level2Name, ...]  (level1 names can collide across towns — use id-keyed + name-keyed)
const level2sByLevel1Name = {};
// Also build id-keyed for internal cascade
const level2IdsByLevel1Id = {};
for (const [l1Id, items] of Object.entries(level2sByLevel1)) {
  const l1Name = level1IdToName[l1Id];
  if (l1Name) {
    if (!level2sByLevel1Name[l1Name]) level2sByLevel1Name[l1Name] = [];
    for (const { name } of items) {
      if (!level2sByLevel1Name[l1Name].includes(name)) level2sByLevel1Name[l1Name].push(name);
    }
  }
  level2IdsByLevel1Id[l1Id] = items.map(i => i.id);
}

// level2Name → [clanName, ...]
const clansByLevel2Name = {};
for (const [l2Id, items] of Object.entries(clansByLevel2)) {
  const l2Name = level2IdToName[l2Id];
  if (l2Name) {
    if (!clansByLevel2Name[l2Name]) clansByLevel2Name[l2Name] = [];
    for (const { name } of items) {
      if (!clansByLevel2Name[l2Name].includes(name)) clansByLevel2Name[l2Name].push(name);
    }
  }
}

// clanName → [villageName, ...]
const villagesByClanName = {};
for (const [clanId, items] of Object.entries(villagesByClan)) {
  const clanName = clanIdToName[clanId];
  if (clanName) {
    if (!villagesByClanName[clanName]) villagesByClanName[clanName] = [];
    for (const { name } of items) {
      if (!villagesByClanName[clanName].includes(name)) villagesByClanName[clanName].push(name);
    }
  }
}

// villageName → [hamletName, ...]
const hamletsByVillageName = {};
for (const [villageId, items] of Object.entries(hamletsByVillage)) {
  const villageName = villageIdToName[villageId];
  if (villageName) {
    if (!hamletsByVillageName[villageName]) hamletsByVillageName[villageName] = [];
    for (const { name } of items) {
      if (!hamletsByVillageName[villageName].includes(name)) hamletsByVillageName[villageName].push(name);
    }
  }
}

// hamletName → [kindredName, ...]
const kindredsByHamletName = {};
for (const [hamletId, items] of Object.entries(kindredsByHamlet)) {
  const hamletName = hamletIdToName[hamletId];
  if (hamletName) {
    if (!kindredsByHamletName[hamletName]) kindredsByHamletName[hamletName] = [];
    for (const { name } of items) {
      if (!kindredsByHamletName[hamletName].includes(name)) kindredsByHamletName[hamletName].push(name);
    }
  }
}

// kindredName → [umunnaName, ...]
const umunnasByKindredName = {};
for (const [kindredId, names] of Object.entries(umunnasByKindred)) {
  const kindredName = kindredIdToName[kindredId];
  if (kindredName) {
    if (!umunnasByKindredName[kindredName]) umunnasByKindredName[kindredName] = [];
    for (const name of names) {
      if (!umunnasByKindredName[kindredName].includes(name)) umunnasByKindredName[kindredName].push(name);
    }
  }
}

// Towns by LGA name (already have by ID, build by LGA name)
// The LGA IDs look like anambra_aguata — extract the LGA name from ID
const lgaNames = {};
for (const t of towns) {
  const lgaId = t.lgaId; // e.g. anambra_aguata
  if (!lgaId) continue;
  // Try to derive LGA name from id: take last segment, replace underscores with spaces, title-case
  const parts = lgaId.split('_');
  const lgaName = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  lgaNames[lgaId] = lgaName;
}

const townsByLgaName = {};
for (const [lgaId, tNames] of Object.entries(townsByLga)) {
  const lgaName = lgaNames[lgaId] || lgaId;
  if (!townsByLgaName[lgaName]) townsByLgaName[lgaName] = [];
  for (const n of tNames) {
    if (!townsByLgaName[lgaName].includes(n)) townsByLgaName[lgaName].push(n);
  }
}

const output = {
  // Maps used at each step of the cascade
  townsByLgaName,          // lgaName → [townName]
  level1sByTownName,       // townName → [level1Name]
  level2sByLevel1Name,     // level1Name → [level2Name]
  clansByLevel2Name,       // level2Name → [clanName]
  villagesByClanName,      // clanName → [villageName]
  hamletsByVillageName,    // villageName → [hamletName]
  kindredsByHamletName,    // hamletName → [kindredName]
  umunnasByKindredName,    // kindredName → [umunnaName]

  // Stats
  _meta: {
    generatedAt: new Date().toISOString(),
    townCount: towns.length,
    level1Count: level1s.length,
    level2Count: level2s.length,
    clanCount: clans.length,
    villageCount: villages.length,
    hamletCount: hamlets.length,
    kindredCount: kindreds.length,
    umunnaCount: umunnas.length,
  }
};

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ Written to ${OUT_FILE}`);
console.log('Stats:', output._meta);
