/**
 * Process dropdown data from CSV files and generate JSON files
 * for frontend consumption
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const docsPath = path.join(__dirname, '../docs/dropdown data');

// Helper function to read CSV and return an array of objects
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function buildDiasporaOriginData() {
  console.log('Building Diaspora Origin data...');
  
  const diasporaOriginPath = path.join(docsPath, 'Diaspora Origin');
  
  try {
    const continents = await readCsv(path.join(diasporaOriginPath, '01_continent_of_origin.csv'));
    const economicRegions = await readCsv(path.join(diasporaOriginPath, '02_economic_region.csv'));
    const culturalRegions = await readCsv(path.join(diasporaOriginPath, '03_cultural_region.csv'));
    const geopoliticalBlocs = await readCsv(path.join(diasporaOriginPath, '04_geopolitical_bloc.csv'));
    const nationalities = await readCsv(path.join(diasporaOriginPath, '05_nationality.csv'));
    const countryOfAncestralOrigin = await readCsv(path.join(diasporaOriginPath, '06_country_of_ancestral_origin.csv'));
    const adminLevel1 = await readCsv(path.join(diasporaOriginPath, '07_administration_level_1.csv'));
    const adminLevel2 = await readCsv(path.join(diasporaOriginPath, '08_administration_level_2.csv'));

    // Build hierarchical structure
    const data = {
      continents: continents.map(row => ({
        id: row.continent_id,
        name: row.continent_name
      })),
      economicRegions: economicRegions.map(row => ({
        id: row.economic_region_id,
        name: row.economic_region_name,
        continentId: row.continent_id
      })),
      culturalRegions: culturalRegions.map(row => ({
        id: row.cultural_region_id,
        name: row.cultural_region_name,
        continentId: row.continent_id
      })),
      geopoliticalBlocs: geopoliticalBlocs.map(row => ({
        id: row.geopolitical_bloc_id,
        name: row.geopolitical_bloc_name,
        continentId: row.continent_id
      })),
      nationalities: nationalities.map(row => ({
        id: row.nationality_id,
        name: row.nationality_name,
        countryId: row.country_id
      })),
      countryOfAncestralOrigin: countryOfAncestralOrigin.map(row => ({
        id: row.country_id,
        name: row.country_name,
        iso2: row.iso2_code,
        iso3: row.iso3_code,
        continentId: row.continent_id,
        subContinentId: row.sub_continent_id
      })),
      adminLevel1: adminLevel1.map(row => ({
        id: row.admin_level_1_id,
        name: row.admin_level_1_name,
        countryId: row.country_id,
        type: row.admin_level_1_type || ''
      })),
      adminLevel1ByCountry: (() => {
        const grouped = {};
        adminLevel1.forEach(row => {
          if (!grouped[row.country_id]) grouped[row.country_id] = [];
          grouped[row.country_id].push({
            id: row.admin_level_1_id,
            name: row.admin_level_1_name,
            type: row.admin_level_1_type || ''
          });
        });
        return grouped;
      })(),
      adminLevel2: adminLevel2.map(row => ({
        id: row.admin_level_2_id,
        name: row.admin_level_2_name,
        adminLevel1Id: row.admin_level_1_id,
        type: row.admin_level_2_type || ''
      })),
      adminLevel2ByLevel1: (() => {
        const grouped = {};
        adminLevel2.forEach(row => {
          if (!grouped[row.admin_level_1_id]) grouped[row.admin_level_1_id] = [];
          grouped[row.admin_level_1_id].push({
            id: row.admin_level_2_id,
            name: row.admin_level_2_name,
            type: row.admin_level_2_type || ''
          });
        });
        return grouped;
      })()
    };

    // Save to file
    const outputPath = path.join(__dirname, '../src/lib/diaspora-origin-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✓ Saved Diaspora Origin data to ${outputPath}`);
  } catch (error) {
    console.error('Error building Diaspora Origin data:', error);
  }
}

async function buildDiasporaCurrentLocationData() {
  console.log('Building Diaspora Current Location data...');
  
  const diasporaCurrentPath = path.join(docsPath, 'Diaspora Current Location Information');
  
  try {
    const continents = await readCsv(path.join(diasporaCurrentPath, 'Continent.csv'));
    const subContinents = await readCsv(path.join(diasporaCurrentPath, 'Sub-continent.csv'));
    const citizenshipStatus = await readCsv(path.join(diasporaCurrentPath, 'Citizenship Status.csv'));
    const countryOfResidence = await readCsv(path.join(diasporaCurrentPath, 'Country of Residence.csv'));
    const firstLevelAdmin = await readCsv(path.join(diasporaCurrentPath, 'First-Level Administrative Division.csv'));
    const cityTown = await readCsv(path.join(diasporaCurrentPath, 'City-Town.csv'));

    // Build hierarchical structure
    const data = {
      continents: continents.map(row => ({
        id: row.continent_id,
        name: row.continent_name
      })),
      subContinents: (() => {
        const grouped = {};
        subContinents.forEach(row => {
          if (!grouped[row.continent_id]) grouped[row.continent_id] = [];
          grouped[row.continent_id].push({
            id: row.sub_continent_id,
            name: row.sub_continent_name
          });
        });
        return grouped;
      })(),
      citizenshipStatuses: citizenshipStatus.map(row => ({
        id: row.citizenship_status_id,
        name: row.citizenship_status_name
      })),
      countries: (() => {
        const grouped = {};
        countryOfResidence.forEach(row => {
          if (!grouped[row.sub_continent_id]) grouped[row.sub_continent_id] = [];
          grouped[row.sub_continent_id].push({
            id: row.country_id,
            name: row.country_name,
            iso2: row.iso2_code,
            iso3: row.iso3_code
          });
        });
        return grouped;
      })(),
      firstLevel: (() => {
        const grouped = {};
        firstLevelAdmin.forEach(row => {
          if (!grouped[row.country_id]) grouped[row.country_id] = [];
          grouped[row.country_id].push({
            id: row.first_level_admin_division_id,
            name: row.first_level_admin_division_name,
            type: row.first_level_admin_division_type || ''
          });
        });
        return grouped;
      })(),
      cities: (() => {
        const grouped = {};
        cityTown.forEach(row => {
          const key = row.first_level_admin_division_id || `COUNTRY_${row.country_id}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({
            id: row.city_town_id,
            name: row.city_town_name
          });
        });
        return grouped;
      })()
    };

    // Save to file
    const outputPath = path.join(__dirname, '../public/data/diaspora-location-data.json');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✓ Saved Diaspora Current Location data to ${outputPath}`);
  } catch (error) {
    console.error('Error building Diaspora Current Location data:', error);
  }
}

async function buildNigerianOriginData() {
  console.log('Building Nigerian Origin data...');
  
  // Use the Nigerian data from ontology templates and regular dropdown data
  try {
    const nigerianStates = await readCsv(path.join(docsPath, 'states.csv'));
    const lgas = await readCsv(path.join(docsPath, 'lgas.csv'));
    const towns = await readCsv(path.join(docsPath, 'towns.csv'));
    const senatorialDistricts = await readCsv(path.join(docsPath, 'senatorial_districts.csv'));
    const federalConstituencies = await readCsv(path.join(docsPath, 'federal_constituencies.csv'));
    const stateConstituencies = await readCsv(path.join(docsPath, 'state_constituencies.csv'));
    const wards = await readCsv(path.join(docsPath, 'wards.csv'));
    const clans = await readCsv(path.join(docsPath, 'clans.csv'));
    const villages = await readCsv(path.join(docsPath, 'villages.csv'));
    const hamlets = await readCsv(path.join(docsPath, 'hamlets.csv'));
    const kindreds = await readCsv(path.join(docsPath, 'kindreds.csv'));

    const data = {
      states: nigerianStates.map(row => ({
        state_id: row.state_id,
        state: row.state,
        region: row.region
      })),
      lgas: lgas.map(row => ({
        lga_id: row.lga_id,
        lga: row.lga,
        state: row.state
      })),
      towns: towns.map(row => ({
        town_id: row.town_id,
        town: row.town,
        lga: row.lga,
        state: row.state
      })),
      senatorialDistricts: senatorialDistricts.map(row => ({
        senatorial_district_id: row.senatorial_district_id,
        senatorial_district: row.senatorial_district,
        state: row.state
      })),
      federalConstituencies: federalConstituencies.map(row => ({
        federal_constituency_id: row.federal_constituency_id,
        federal_constituency: row.federal_constituency,
        state: row.state,
        senatorial_district: row.senatorial_district
      })),
      stateConstituencies: stateConstituencies.map(row => ({
        state_constituency_id: row.state_constituency_id,
        state_constituency: row.state_constituency,
        state: row.state,
        federal_constituency: row.federal_constituency
      })),
      wards: wards.map(row => ({
        ward_id: row.ward_id,
        ward: row.ward,
        lga: row.lga,
        state: row.state
      })),
      clans: clans.map(row => ({
        clan_id: row.clan_id,
        clan: row.clan
      })),
      villages: villages.map(row => ({
        village_id: row.village_id,
        village: row.village
      })),
      hamlets: hamlets.map(row => ({
        hamlet_id: row.hamlet_id,
        hamlet: row.hamlet
      })),
      kindreds: kindreds.map(row => ({
        kindred_id: row.kindred_id,
        kindred: row.kindred
      }))
    };

    // Save to file
    const outputPath = path.join(__dirname, '../src/lib/nigerian-origin-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✓ Saved Nigerian Origin data to ${outputPath}`);
  } catch (error) {
    console.error('Error building Nigerian Origin data:', error);
  }
}

async function buildNigerianCurrentLocationData() {
  console.log('Building Nigerian Current Location data...');
  
  // This would use the same Nigerian data as origin
  try {
    const nigerianStates = await readCsv(path.join(docsPath, 'states.csv'));
    const lgas = await readCsv(path.join(docsPath, 'lgas.csv'));
    const towns = await readCsv(path.join(docsPath, 'towns.csv'));
    const senatorialDistricts = await readCsv(path.join(docsPath, 'senatorial_districts.csv'));
    const federalConstituencies = await readCsv(path.join(docsPath, 'federal_constituencies.csv'));
    const stateConstituencies = await readCsv(path.join(docsPath, 'state_constituencies.csv'));
    const wards = await readCsv(path.join(docsPath, 'wards.csv'));

    const data = {
      states: nigerianStates.map(row => ({
        state_id: row.state_id,
        state: row.state,
        region: row.region
      })),
      lgas: lgas.map(row => ({
        lga_id: row.lga_id,
        lga: row.lga,
        state: row.state
      })),
      towns: towns.map(row => ({
        town_id: row.town_id,
        town: row.town,
        lga: row.lga,
        state: row.state
      })),
      senatorialDistricts: senatorialDistricts.map(row => ({
        senatorial_district_id: row.senatorial_district_id,
        senatorial_district: row.senatorial_district,
        state: row.state
      })),
      federalConstituencies: federalConstituencies.map(row => ({
        federal_constituency_id: row.federal_constituency_id,
        federal_constituency: row.federal_constituency,
        state: row.state,
        senatorial_district: row.senatorial_district
      })),
      stateConstituencies: stateConstituencies.map(row => ({
        state_constituency_id: row.state_constituency_id,
        state_constituency: row.state_constituency,
        state: row.state,
        federal_constituency: row.federal_constituency
      })),
      wards: wards.map(row => ({
        ward_id: row.ward_id,
        ward: row.ward,
        lga: row.lga,
        state: row.state
      }))
    };

    // Save to file
    const outputPath = path.join(__dirname, '../src/lib/nigerian-current-location-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✓ Saved Nigerian Current Location data to ${outputPath}`);
  } catch (error) {
    console.error('Error building Nigerian Current Location data:', error);
  }
}

// Run all build tasks
async function main() {
  console.log('Starting dropdown data processing...\n');
  
  await buildDiasporaOriginData();
  await buildDiasporaCurrentLocationData();
  await buildNigerianOriginData();
  await buildNigerianCurrentLocationData();
  
  console.log('\n✓ All dropdown data processing complete!');
}

main().catch(console.error);
