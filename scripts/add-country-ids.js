/**
 * Add country IDs to diaspora-location-data.json
 * Uses synchronous file reading
 */

const fs = require('fs');
const path = require('path');

// Read the Country of Residence CSV
const csvPath = path.join(__dirname, '../docs/dropdown data/Diaspora Current Location Information/Country of Residence.csv');
const jsonPath = path.join(__dirname, '../public/data/diaspora-location-data.json');

// Parse CSV manually
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim());

// Create a map of country name to ID
const countryIdMap = {};
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
  const row = {};
  headers.forEach((h, idx) => {
    row[h] = values[idx];
  });
  
  if (row.country_id && row.country_name) {
    countryIdMap[row.country_name] = row.country_id;
  }
}

console.log(`✓ Loaded ${Object.keys(countryIdMap).length} countries from CSV`);

// Read and update JSON
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;
for (const subcontinentKey in data.countries) {
  data.countries[subcontinentKey].forEach(country => {
    if (!country.id && country.name) {
      const id = countryIdMap[country.name];
      if (id) {
        country.id = id;
        updated++;
      }
    }
  });
}

// Update citizenship statuses - ensure they have IDs
if (Array.isArray(data.citizenshipStatuses)) {
  if (data.citizenshipStatuses.length > 0 && typeof data.citizenshipStatuses[0] === 'string') {
    // Convert from string array to object array
    const statuses = data.citizenshipStatuses;
    data.citizenship = statuses; // Keep string array for compatibility
    data.citizenshipStatuses = statuses.map(status => ({
      id: `CSTAT_${status.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
      name: status
    }));
    console.log(`✓ Converted ${statuses.length} citizenship statuses to object format`);
  } else if (data.citizenshipStatuses.length > 0 && !data.citizenshipStatuses[0].id) {
    // Add IDs to existing citizenship status objects
    data.citizenshipStatuses.forEach((status, idx) => {
      if (!status.id) {
        status.id = `CSTAT_${status.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      }
    });
    console.log(`✓ Added IDs to ${data.citizenshipStatuses.length} citizenship statuses`);
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log(`✓ Updated ${updated} countries with IDs`);
console.log('✓ Successfully updated diaspora-location-data.json');
