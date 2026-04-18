/**
 * Builds dropdown-data.json from CSV files in "dropdown data" folder.
 * Run: node scripts/build-dropdown-data.js
 * Output: src/lib/dropdown-data.json
 */

const fs = require('fs');
const path = require('path');

const DROPDOWN_DIR = path.join(__dirname, '..', 'docs', 'dropdown data');
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'dropdown-data.json');

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    if (values.length && values[0] === '') continue; // skip empty rows
    const row = {};
    header.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function main() {
  const continents = parseCsv(path.join(DROPDOWN_DIR, 'continents.csv'));
  const countries = parseCsv(path.join(DROPDOWN_DIR, 'countries.csv'));
  const states = parseCsv(path.join(DROPDOWN_DIR, 'states.csv'));
  const lgas = parseCsv(path.join(DROPDOWN_DIR, 'lgas.csv'));
  const wards = parseCsv(path.join(DROPDOWN_DIR, 'wards.csv'));
  const senatorial = parseCsv(path.join(DROPDOWN_DIR, 'senatorial_districts.csv'));
  const federal = parseCsv(path.join(DROPDOWN_DIR, 'federal_constituencies.csv'));
  const stateConst = parseCsv(path.join(DROPDOWN_DIR, 'state_constituencies.csv'));
  const economicRegions = parseCsv(path.join(DROPDOWN_DIR, 'economicRegions.csv'));
  const culturalRegions = parseCsv(path.join(DROPDOWN_DIR, 'culturalRegions.csv'));
  const geopoliticalBlocs = parseCsv(path.join(DROPDOWN_DIR, 'geopoliticalBlocs.csv'));

  // ── COMPLETE mapping of ST_XX codes → state name (all 36 states + FCT) ──
  // This is required because senatorial_districts.csv, federal_constituencies.csv,
  // and state_constituencies.csv use these codes, while states.csv / lgas.csv
  // use snake_case IDs.
  const STATE_CODE_TO_NAME = {
    ST_AB: 'Abia',
    ST_AD: 'Adamawa',
    ST_AK: 'Akwa Ibom',
    ST_AN: 'Anambra',
    ST_BA: 'Bauchi',
    ST_BY: 'Bayelsa',
    ST_BE: 'Benue',
    ST_BO: 'Borno',
    ST_CR: 'Cross River',
    ST_DE: 'Delta',
    ST_EB: 'Ebonyi',
    ST_ED: 'Edo',
    ST_EK: 'Ekiti',
    ST_EN: 'Enugu',
    ST_GO: 'Gombe',
    ST_IM: 'Imo',
    ST_JI: 'Jigawa',
    ST_KD: 'Kaduna',
    ST_KN: 'Kano',
    ST_KT: 'Katsina',
    ST_KE: 'Kebbi',
    ST_KO: 'Kogi',
    ST_KW: 'Kwara',
    ST_LA: 'Lagos',
    ST_NA: 'Nasarawa',
    ST_NI: 'Niger',
    ST_OG: 'Ogun',
    ST_ON: 'Ondo',
    ST_OS: 'Osun',
    ST_OY: 'Oyo',
    ST_PL: 'Plateau',
    ST_RI: 'Rivers',
    ST_SO: 'Sokoto',
    ST_TA: 'Taraba',
    ST_YO: 'Yobe',
    ST_ZA: 'Zamfara',
    ST_FC: 'FCT Abuja',
  };

  // Also map the snake_case IDs used in lgas.csv stateId column to state names
  const STATE_SNAKE_TO_NAME = {
    abia: 'Abia',
    adamawa: 'Adamawa',
    akwa_ibom: 'Akwa Ibom',
    anambra: 'Anambra',
    bauchi: 'Bauchi',
    bayelsa: 'Bayelsa',
    benue: 'Benue',
    borno: 'Borno',
    cross_river: 'Cross River',
    delta: 'Delta',
    ebonyi: 'Ebonyi',
    edo: 'Edo',
    ekiti: 'Ekiti',
    enugu: 'Enugu',
    gombe: 'Gombe',
    imo: 'Imo',
    jigawa: 'Jigawa',
    kaduna: 'Kaduna',
    kano: 'Kano',
    katsina: 'Katsina',
    kebbi: 'Kebbi',
    kogi: 'Kogi',
    kwara: 'Kwara',
    lagos: 'Lagos',
    nasarawa: 'Nasarawa',
    niger: 'Niger',
    ogun: 'Ogun',
    ondo: 'Ondo',
    osun: 'Osun',
    oyo: 'Oyo',
    plateau: 'Plateau',
    rivers: 'Rivers',
    sokoto: 'Sokoto',
    taraba: 'Taraba',
    yobe: 'Yobe',
    zamfara: 'Zamfara',
    fct: 'FCT Abuja',
    abuja: 'FCT Abuja',
  };

  function getStateName(stateId) {
    if (!stateId) return null;
    // Try ST_XX code directly
    if (STATE_CODE_TO_NAME[stateId]) return STATE_CODE_TO_NAME[stateId];
    // Try snake_case
    const lower = stateId.toLowerCase();
    if (STATE_SNAKE_TO_NAME[lower]) return STATE_SNAKE_TO_NAME[lower];
    // Fallback: from states.csv
    const s = states.find((st) => st.id && st.id.toLowerCase() === lower);
    return s ? s.name : null;
  }

  const continentById = {};
  continents.forEach((c) => {
    if (c.id) continentById[c.id] = c.name;
  });

  // LGA lookup by ID (snake_case as in lgas.csv)
  const lgaById = {};
  lgas.forEach((l) => {
    if (l.id) lgaById[l.id.toLowerCase()] = l.name;
  });

  // Wards reference LGAs using the LGA_AB_ABA_NORTH format.
  // Convert: LGA_AB_ABA_NORTH → lga_id prefix "ab" → map "ab" to state code "ST_AB"
  // Then look up if abia_aba_north is in lgaById.
  // Strategy: derive snake_case from LGA_XX_... by mapping the 2-char state code to the state snake and removing LGA_ prefix.
  const STATE_CODE2_TO_SNAKE = {};
  Object.entries(STATE_CODE_TO_NAME).forEach(([code, name]) => {
    // e.g. ST_AB → ab
    const twoChar = code.replace('ST_', '').toLowerCase();
    // find matching snake from STATE_SNAKE_TO_NAME
    const snake = Object.keys(STATE_SNAKE_TO_NAME).find(
      (k) => STATE_SNAKE_TO_NAME[k] === name
    );
    if (snake) STATE_CODE2_TO_SNAKE[twoChar] = snake;
  });

  function getLgaName(lga_id) {
    if (!lga_id) return null;
    const lower = lga_id.toLowerCase();
    // Direct match (snake_case IDs from lgas.csv)
    if (lgaById[lower]) return lgaById[lower];
    // Handle LGA_AB_ABA_NORTH format
    const m = lower.match(/^lga_([a-z]{2})_(.+)$/);
    if (m) {
      const stateSnake = STATE_CODE2_TO_SNAKE[m[1]];
      if (stateSnake) {
        const candidate = `${stateSnake}_${m[2]}`;
        if (lgaById[candidate]) return lgaById[candidate];
      }
    }
    return null;
  }

  // ── continentCountries ──
  const continentCountries = {};
  continents.forEach((c) => {
    if (c.id && c.name) continentCountries[c.name] = [];
  });
  countries
    .filter((c) => c.continentId && c.name)
    .sort((a, b) => (parseInt(a.officialOrder, 10) || 0) - (parseInt(b.officialOrder, 10) || 0))
    .forEach((c) => {
      const continentName = continentById[c.continentId];
      if (continentName && continentCountries[continentName]) {
        continentCountries[continentName].push(c.name);
      }
    });

  // ── nigerianStates: derived from lgas.csv so ALL states appear ──
  // Group LGAs by their stateId
  const lgasByStateId = {};
  lgas.forEach((l) => {
    if (!l.stateId || !l.name) return;
    const stateId = l.stateId.toLowerCase();
    if (!lgasByStateId[stateId]) lgasByStateId[stateId] = [];
    lgasByStateId[stateId].push({ name: l.name, order: parseInt(l.officialOrder, 10) || 999 });
  });

  // Collect all unique state IDs that appear in lgas.csv and map to names
  const allStateNames = new Set(Object.values(STATE_CODE_TO_NAME));
  const stateNameToLgas = {};
  Object.entries(lgasByStateId).forEach(([stateId, lgaList]) => {
    const stateName = getStateName(stateId);
    if (!stateName) return;
    allStateNames.add(stateName);
    if (!stateNameToLgas[stateName]) stateNameToLgas[stateName] = [];
    stateNameToLgas[stateName].push(...lgaList);
  });

  // Sort states alphabetically, build the array
  const nigerianStates = Array.from(allStateNames)
    .sort()
    .map((stateName) => {
      const lgaList = (stateNameToLgas[stateName] || [])
        .sort((a, b) => a.order - b.order)
        .map((l) => l.name);
      return { state: stateName, lgas: lgaList };
    });

  // ── wardsData ──
  const wardsData = {};
  wards.forEach((w) => {
    const lga_id = w.lga_id || w.lgaId;
    const ward_name = w.ward_name || w.name;
    if (!lga_id || !ward_name) return;
    const lgaName = getLgaName(lga_id);
    if (!lgaName) return;
    if (!wardsData[lgaName]) wardsData[lgaName] = [];
    wardsData[lgaName].push(ward_name);
  });
  Object.keys(wardsData).forEach((lga) => { wardsData[lga].sort(); });

  // ── Senatorial districts ──
  const senatorialZoneById = {};
  senatorial.forEach((r) => {
    const id = r.senatorial_id || r.id;
    const name = r.senatorial_name || r.name;
    if (id && name) senatorialZoneById[id] = name;
  });

  const senatorialDistricts = {};
  senatorial.forEach((r) => {
    const state_id = r.state_id || r.stateId;
    const name = r.senatorial_name || r.name;
    if (!state_id || !name) return;
    const stateName = getStateName(state_id);
    if (!stateName) { console.warn('Unknown state_id in senatorial_districts:', state_id); return; }
    if (!senatorialDistricts[stateName]) senatorialDistricts[stateName] = [];
    senatorialDistricts[stateName].push(name);
  });
  Object.keys(senatorialDistricts).forEach((s) => { senatorialDistricts[s].sort(); });

  // ── Federal constituencies ──
  const federalById = {};
  federal.forEach((r) => {
    const id = r.federal_constituency_id || r.id;
    const name = r.federal_constituency_name || r.name;
    if (id && name) federalById[id] = name;
  });

  const federalConstituencies = {};
  const federalConstituenciesByStateAndSenatorialDistrict = {};
  federal.forEach((r) => {
    const state_id = r.state_id || r.stateId;
    const name = r.federal_constituency_name || r.name;
    const s_id = r.senatorial_id || r.senatorialZoneId;
    if (!state_id || !name) return;
    const stateName = getStateName(state_id);
    if (!stateName) { console.warn('Unknown state_id in federal_constituencies:', state_id); return; }
    if (!federalConstituencies[stateName]) federalConstituencies[stateName] = [];
    federalConstituencies[stateName].push(name);
    const zoneName = s_id ? senatorialZoneById[s_id] : null;
    if (zoneName) {
      if (!federalConstituenciesByStateAndSenatorialDistrict[stateName]) federalConstituenciesByStateAndSenatorialDistrict[stateName] = {};
      if (!federalConstituenciesByStateAndSenatorialDistrict[stateName][zoneName]) federalConstituenciesByStateAndSenatorialDistrict[stateName][zoneName] = [];
      federalConstituenciesByStateAndSenatorialDistrict[stateName][zoneName].push(name);
    }
  });
  Object.keys(federalConstituencies).forEach((s) => { federalConstituencies[s].sort(); });
  Object.keys(federalConstituenciesByStateAndSenatorialDistrict).forEach((sn) => {
    Object.keys(federalConstituenciesByStateAndSenatorialDistrict[sn]).forEach((zn) => {
      federalConstituenciesByStateAndSenatorialDistrict[sn][zn].sort();
    });
  });

  // ── State constituencies ──
  const stateConstituenciesByState = {};
  const stateConstituenciesByStateAndFederalConstituency = {};
  stateConst.forEach((r) => {
    const state_id = r.state_id || r.stateId;
    const name = r.state_constituency_name || r.name;
    const f_id = r.federal_constituency_id || r.federalConstituencyId;
    if (!state_id || !name) return;
    const stateName = getStateName(state_id);
    if (!stateName) { console.warn('Unknown state_id in state_constituencies:', state_id); return; }
    if (!stateConstituenciesByState[stateName]) stateConstituenciesByState[stateName] = [];
    stateConstituenciesByState[stateName].push(name);
    const federalName = f_id ? federalById[f_id] : null;
    if (federalName) {
      if (!stateConstituenciesByStateAndFederalConstituency[stateName]) stateConstituenciesByStateAndFederalConstituency[stateName] = {};
      if (!stateConstituenciesByStateAndFederalConstituency[stateName][federalName]) stateConstituenciesByStateAndFederalConstituency[stateName][federalName] = [];
      stateConstituenciesByStateAndFederalConstituency[stateName][federalName].push(name);
    }
  });
  Object.keys(stateConstituenciesByState).forEach((s) => { stateConstituenciesByState[s].sort(); });
  Object.keys(stateConstituenciesByStateAndFederalConstituency).forEach((sn) => {
    Object.keys(stateConstituenciesByStateAndFederalConstituency[sn]).forEach((fn) => {
      stateConstituenciesByStateAndFederalConstituency[sn][fn].sort();
    });
  });

  // ── Economic / cultural regions, geopolitical blocs ──
  const continentSubContinents = {};
  continents.forEach((c) => { if (c.id && c.name) continentSubContinents[c.name] = []; });
  economicRegions
    .filter((e) => e.continentId && e.name)
    .sort((a, b) => (parseInt(a.officialOrder, 10) || 0) - (parseInt(b.officialOrder, 10) || 0))
    .forEach((e) => {
      const continentName = continentById[e.continentId];
      if (continentName && continentSubContinents[continentName]) continentSubContinents[continentName].push(e.name);
    });

  const culturalRegionsByContinent = {};
  continents.forEach((c) => { if (c.id && c.name) culturalRegionsByContinent[c.name] = []; });
  culturalRegions
    .filter((e) => e.continentId && e.name)
    .sort((a, b) => (parseInt(a.officialOrder, 10) || 0) - (parseInt(b.officialOrder, 10) || 0))
    .forEach((e) => {
      const continentName = continentById[e.continentId];
      if (continentName && culturalRegionsByContinent[continentName]) culturalRegionsByContinent[continentName].push(e.name);
    });

  const geopoliticalBlocNames = geopoliticalBlocs
    .filter((g) => g.name)
    .sort((a, b) => (parseInt(a.officialOrder, 10) || 0) - (parseInt(b.officialOrder, 10) || 0))
    .map((g) => g.name);

  const output = {
    continents: continents.filter((c) => c.name).map((c) => c.name),
    continentCountries,
    nigerianStates,
    wardsData,
    senatorialDistricts,
    federalConstituencies,
    federalConstituenciesByStateAndSenatorialDistrict,
    stateConstituenciesByState,
    stateConstituenciesByStateAndFederalConstituency,
    continentSubContinents,
    culturalRegionsByContinent,
    geopoliticalBlocs: geopoliticalBlocNames,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), 'utf8');

  // Summary
  console.log('Wrote', OUT_FILE);
  console.log(`  Nigerian states covered: ${nigerianStates.length}`);
  console.log(`  States with senatorial districts: ${Object.keys(senatorialDistricts).length}`);
  console.log(`  States with federal constituencies: ${Object.keys(federalConstituencies).length}`);
  console.log(`  LGAs with ward data: ${Object.keys(wardsData).length}`);
}

main();
