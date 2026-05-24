const fs = require('fs');
const path = require('path');

const ORIGIN_DIR = path.join(__dirname, '..', 'docs', 'dropdown data', 'Nigerian Origin Information');
const ORIGIN_TOWN_DIR = path.join(ORIGIN_DIR, 'town origin info');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'nigerian-origin-dropdown-data.json');
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

function readCsv(primaryFileName, fallbackFileName) {
  const fileNames = [primaryFileName, fallbackFileName].filter(Boolean);

  for (const fileName of fileNames) {
    const filePath = path.join(ORIGIN_DIR, fileName);
    if (fs.existsSync(filePath)) {
      return {
        fileName,
        rows: parseCsv(fs.readFileSync(filePath, 'utf8')),
      };
    }
  }

  return {
    fileName: primaryFileName,
    rows: [],
  };
}

function readOriginTownFolderRows() {
  if (!fs.existsSync(ORIGIN_TOWN_DIR)) return [];

  return fs.readdirSync(ORIGIN_TOWN_DIR)
    .filter((fileName) => /\.csv$/i.test(fileName))
    .flatMap((fileName) => parseCsv(fs.readFileSync(path.join(ORIGIN_TOWN_DIR, fileName), 'utf8')));
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

function getStateNameFromLgaId(lgaId) {
  return toTitleCase((lgaId || '').split('_')[0] || '');
}

function getLgaNameFromLgaId(lgaId) {
  const parts = (lgaId || '').split('_');
  return toTitleCase(parts.slice(1).join(' '));
}

function getStateNameFromStateId(stateId) {
  return toTitleCase(stateId);
}

function shouldIncludeTownName(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  return !NON_TOWN_PATTERNS.some((pattern) => pattern.test(value));
}

function main() {
  const statesFile = readCsv('state origin.csv');
  const townsFile = readCsv('town origin.csv');
  const originTownFolderRows = readOriginTownFolderRows();
  const wardsFile = readCsv('politicalWards.csv');
  const level1File = readCsv('townAdminLevel1.csv', 'townAdminLevel1 clean test data.csv');
  const level2File = readCsv('townAdminLevel2.csv');
  const clansFile = readCsv('clans.csv');

  const states = statesFile.rows;
  const towns = townsFile.rows;
  const wards = wardsFile.rows;
  const level1s = level1File.rows;
  const level2s = level2File.rows;
  const clans = clansFile.rows;

  const stateMap = new Map();
  for (const row of states) {
    const state = row.stateName || row.name || row.state;
    if (!state) continue;

    if (!stateMap.has(state)) {
      stateMap.set(state, {
        state,
        region: row.regionName || row.region || '',
        lgas: [],
      });
    }
  }

  const townIdToName = Object.fromEntries(
    towns.map((row) => [row.id, row.name]).filter(([, name]) => Boolean(name))
  );
  const level1IdToName = Object.fromEntries(
    level1s.map((row) => [row.id, row.name]).filter(([, name]) => Boolean(name))
  );
  const level2IdToName = Object.fromEntries(
    level2s.map((row) => [row.id, row.name]).filter(([, name]) => Boolean(name))
  );
  const lgaIdToName = Object.fromEntries(
    towns
      .map((row) => [String(row.lgaId || row.lga_id || '').trim().toLowerCase(), row.lgaName || row.lga || ''])
      .filter(([, name]) => Boolean(name))
  );

  const townsByLgaName = {};
  for (const row of originTownFolderRows) {
    const lgaId = String(row.lga_id || row.lgaId || '').trim();
    const lgaName = row.lga_name || row.lgaName || lgaIdToName[lgaId.toLowerCase()] || getLgaNameFromLgaId(lgaId);
    const townName = row.town_name || row.name || '';
    const stateName = row.state_name || row.stateName || getStateNameFromStateId(row.state_id) || getStateNameFromLgaId(lgaId);
    if (!shouldIncludeTownName(townName)) continue;

    pushUnique(townsByLgaName, lgaName, townName);

    if (stateName && !stateMap.has(stateName)) {
      stateMap.set(stateName, {
        state: stateName,
        region: '',
        lgas: [],
      });
    }

    const entry = stateMap.get(stateName);
    if (entry) {
      pushUnique({ [stateName]: entry.lgas }, stateName, lgaName);
    }
  }

  Object.keys(townsByLgaName).forEach((lgaName) => {
    townsByLgaName[lgaName].sort((a, b) => a.localeCompare(b));
  });

  const originWardsByLgaName = {};
  const sortedWards = [...wards].sort((a, b) => {
    const orderA = Number.parseInt(a.officialOrder || '', 10);
    const orderB = Number.parseInt(b.officialOrder || '', 10);
    return (Number.isNaN(orderA) ? Number.MAX_SAFE_INTEGER : orderA) - (Number.isNaN(orderB) ? Number.MAX_SAFE_INTEGER : orderB);
  });

  for (const row of sortedWards) {
    const lgaId = String(row.lgaId || row.lga_id || '').trim();
    const lgaName = row.lgaName || row.lga_name || lgaIdToName[lgaId.toLowerCase()] || getLgaNameFromLgaId(lgaId);
    pushUnique(originWardsByLgaName, lgaName, row.name);
  }

  const level1sByTownName = {};
  for (const row of level1s) {
    pushUnique(level1sByTownName, townIdToName[row.townId], row.name);
  }

  const level2sByLevel1Name = {};
  for (const row of level2s) {
    pushUnique(level2sByLevel1Name, level1IdToName[row.townAdminLevel1Id], row.name);
  }

  const clansByLevel1Name = {};
  const clansByLevel2Name = {};
  for (const row of clans) {
    pushUnique(clansByLevel1Name, level1IdToName[row.townAdminLevel2Id], row.name);
    pushUnique(clansByLevel2Name, level2IdToName[row.townAdminLevel2Id], row.name);
  }

  const output = {
    originStates: Array.from(stateMap.values()),
    townsByLgaName,
    originWardsByLgaName,
    level1sByTownName,
    level2sByLevel1Name,
    clansByLevel1Name,
    clansByLevel2Name,
    stateRegions: Object.fromEntries(
      Array.from(stateMap.values()).map((entry) => [entry.state, entry.region])
    ),
    _meta: {
      generatedAt: new Date().toISOString(),
      sourceFiles: [
        `docs/dropdown data/Nigerian Origin Information/${statesFile.fileName}`,
        `docs/dropdown data/Nigerian Origin Information/${townsFile.fileName}`,
        'docs/dropdown data/Nigerian Origin Information/town origin info/*.csv',
        `docs/dropdown data/Nigerian Origin Information/${wardsFile.fileName}`,
        `docs/dropdown data/Nigerian Origin Information/${level1File.fileName}`,
        `docs/dropdown data/Nigerian Origin Information/${level2File.fileName}`,
        `docs/dropdown data/Nigerian Origin Information/${clansFile.fileName}`,
      ],
    },
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Written ${OUT_FILE}`);
}

main();
