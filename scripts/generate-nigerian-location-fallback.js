const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const INPUT_FILE = path.join(
  __dirname,
  '..',
  'docs',
  'dropdown data',
  'Diaspora Current Location Information',
  'towns_current location information.csv'
);

const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'nigerian-location-fallback.json');

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

function titleCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((part) => {
      const upper = ['FCT', 'GRA'];
      if (upper.includes(part.toUpperCase())) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function decodeLgaName(lgaId) {
  const match = /^LGA_[A-Z]{2}_(.+)$/.exec(lgaId || '');
  if (!match) return null;
  return titleCase(match[1].replace(/_/g, ' '));
}

async function main() {
  const stateLgaSets = {};
  const townsByLgaSets = {};

  await new Promise((resolve, reject) => {
    fs.createReadStream(INPUT_FILE)
      .pipe(csv())
      .on('data', (row) => {
        const stateName = STATE_CODE_TO_NAME[row.state_id];
        const lgaName = decodeLgaName(row.lga_id);
        const townName = (row.town_name || '').trim();

        if (!stateName || !lgaName) return;

        if (!stateLgaSets[stateName]) stateLgaSets[stateName] = new Set();
        stateLgaSets[stateName].add(lgaName);

        if (townName) {
          if (!townsByLgaSets[lgaName]) townsByLgaSets[lgaName] = new Set();
          townsByLgaSets[lgaName].add(townName);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const output = {
    stateLgas: Object.fromEntries(
      Object.entries(stateLgaSets)
        .map(([state, lgas]) => [state, Array.from(lgas).sort((a, b) => a.localeCompare(b))])
        .sort(([a], [b]) => a.localeCompare(b))
    ),
    townsByLga: Object.fromEntries(
      Object.entries(townsByLgaSets)
        .map(([lga, towns]) => [lga, Array.from(towns).sort((a, b) => a.localeCompare(b))])
        .sort(([a], [b]) => a.localeCompare(b))
    ),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT_FILE}`);
  console.log(`  States: ${Object.keys(output.stateLgas).length}`);
  console.log(`  LGAs: ${Object.keys(output.townsByLga).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
