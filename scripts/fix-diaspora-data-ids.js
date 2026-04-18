/**
 * Fix missing ID properties in diaspora-location-data.json
 * Adds country IDs from the Country of Residence CSV
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvPath = path.join(__dirname, '../docs/dropdown data/Diaspora Current Location Information/Country of Residence.csv');
const jsonPath = path.join(__dirname, '../public/data/diaspora-location-data.json');

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = {};
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Create a map of country_name -> country_id
        const name = data.country_name?.trim();
        const id = data.country_id?.trim();
        if (name && id) {
          results[name] = id;
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function fixDiasporaData() {
  try {
    console.log('Reading Country of Residence CSV...');
    const countryIdMap = await readCsv(csvPath);
    console.log(`✓ Loaded ${Object.keys(countryIdMap).length} countries from CSV`);

    console.log('Reading diaspora-location-data.json...');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Add country IDs
    let countriesUpdated = 0;
    for (const subcontinentKey in data.countries) {
      data.countries[subcontinentKey].forEach(country => {
        if (!country.id && country.name) {
          const countryId = countryIdMap[country.name];
          if (countryId) {
            country.id = countryId;
            countriesUpdated++;
          } else {
            console.warn(`⚠ Could not find ID for country: ${country.name}`);
          }
        }
      });
    }

    console.log(`✓ Updated ${countriesUpdated} countries with IDs`);

    // Also update citizenship statuses format if needed
    if (Array.isArray(data.citizenshipStatuses) && data.citizenshipStatuses.length > 0) {
      // Check if already in correct format
      if (typeof data.citizenshipStatuses[0] === 'string') {
        console.log('Converting citizenship statuses to object format...');
        const statuses = data.citizenshipStatuses;
        data.citizenship = statuses; // Keep the string array for backwards compatibility
        // Convert to object array with ids
        data.citizenshipStatuses = statuses.map(status => ({
          id: `CSTAT_${status.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
          name: status
        }));
        console.log('✓ Citizenship statuses converted to object format');
      }
    }

    console.log('Writing updated diaspora-location-data.json...');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('✓ Successfully updated diaspora-location-data.json');

  } catch (error) {
    console.error('Error fixing diaspora data:', error);
  }
}

fixDiasporaData();
