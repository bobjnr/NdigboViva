const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'dropdown data', 'Diaspora Origin');
const outputFilePath = path.join(process.cwd(), 'src', 'lib', 'diaspora-origin-data.json');

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

const continents = parseCSV(path.join(baseDir, '01_continent_of_origin.csv'));
const nationalities = parseCSV(path.join(baseDir, '05_nationality.csv'));
const countries = parseCSV(path.join(baseDir, '06_country_of_ancestral_origin.csv'));
const admin1 = parseCSV(path.join(baseDir, '07_administration_level_1.csv'));
const admin2 = parseCSV(path.join(baseDir, '08_administration_level_2.csv'));
const admin3 = parseCSV(path.join(baseDir, '09_administration_level_3.csv'));

const data = {
  continents: continents.map(c => ({ id: c.continent_id, name: c.continent_name })),
  nationalities: nationalities.map(n => ({ id: n.nationality_id, name: n.nationality_name, countryId: n.country_id })),
  countries: countries.map(c => ({ 
    id: c.country_id, 
    name: c.country_name, 
    continentId: c.continent_id,
    economicRegionId: c.economic_region_id,
    culturalRegionId: c.cultural_region_id,
    geopoliticalBlocId: c.geopolitical_bloc_id
  })),
  admin1: admin1.map(a => ({ id: a.admin_level_1_id, name: a.admin_level_1_name, countryId: a.country_id, type: a.admin_level_1_type })),
  admin2: admin2.map(a => ({ id: a.admin_level_2_id, name: a.admin_level_2_name, admin1Id: a.admin_level_1_id, type: a.admin_level_2_type })),
  admin3: admin3.map(a => ({ id: a.admin_level_3_id, name: a.admin_level_3_name, admin2Id: a.admin_level_2_id, type: a.admin_level_3_type }))
};

fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Diaspora origin data processed successfully.');
