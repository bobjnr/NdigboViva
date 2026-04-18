/**
 * Merge all dropdown data from processed JSON files
 * into the main dropdown-data.json and dedicated data files
 */

const fs = require('fs');
const path = require('path');

async function mergeAllDropdownData() {
  console.log('Merging dropdown data from all sources...\n');

  try {
    // Read all generated JSON files
    const libPath = path.join(__dirname, '../src/lib');
    const publicDataPath = path.join(__dirname, '../public/data');

    // Load the generated data files
    const nigerianOriginPath = path.join(libPath, 'nigerian-origin-data.json');
    const nigerianCurrentLocationPath = path.join(libPath, 'nigerian-current-location-data.json');
    const diasporaOriginPath = path.join(libPath, 'diaspora-origin-data.json');
    const diasporaCurrentLocationPath = path.join(libPath, 'diaspora-location-data.json');
    
    // Read all JSON files
    const nigerianOriginData = JSON.parse(fs.readFileSync(nigerianOriginPath, 'utf8'));
    const nigerianCurrentLocationData = JSON.parse(fs.readFileSync(nigerianCurrentLocationPath, 'utf8'));
    const diasporaOriginData = JSON.parse(fs.readFileSync(diasporaOriginPath, 'utf8'));
    const diasporaCurrentLocationData = JSON.parse(fs.readFileSync(diasporaCurrentLocationPath, 'utf8'));

    console.log('✓ Loaded all source data files');

    // Read existing dropdown-data.json
    const dropdownDataPath = path.join(libPath, 'dropdown-data.json');
    const existingDropdownData = JSON.parse(fs.readFileSync(dropdownDataPath, 'utf8'));

    console.log('✓ Loaded existing dropdown-data.json');

    // Build comprehensive hierarchical mappings 
    // for Nigerian origin/current location

    // Senatorial districts by state
    const senatorialDistrictsByState = {};
    nigerianOriginData.senatorialDistricts?.forEach(sd => {
      if (!senatorialDistrictsByState[sd.state]) {
        senatorialDistrictsByState[sd.state] = [];
      }
      senatorialDistrictsByState[sd.state].push(sd.senatorial_district);
    });

    // Federal constituencies by state and senatorial district
    const federalConstituenciesByStateAndSenatorialDistrict = {};
    nigerianOriginData.federalConstituencies?.forEach(fc => {
      if (!federalConstituenciesByStateAndSenatorialDistrict[fc.state]) {
        federalConstituenciesByStateAndSenatorialDistrict[fc.state] = {};
      }
      if (!federalConstituenciesByStateAndSenatorialDistrict[fc.state][fc.senatorial_district]) {
        federalConstituenciesByStateAndSenatorialDistrict[fc.state][fc.senatorial_district] = [];
      }
      federalConstituenciesByStateAndSenatorialDistrict[fc.state][fc.senatorial_district].push(fc.federal_constituency);
    });

    // Federal constituencies by state (flat)
    const federalConstituenciesByState = {};
    nigerianOriginData.federalConstituencies?.forEach(fc => {
      if (!federalConstituenciesByState[fc.state]) {
        federalConstituenciesByState[fc.state] = [];
      }
      if (!federalConstituenciesByState[fc.state].includes(fc.federal_constituency)) {
        federalConstituenciesByState[fc.state].push(fc.federal_constituency);
      }
    });

    // State constituencies by state and federal constituency
    const stateConstituenciesByStateAndFederalConstituency = {};
    nigerianOriginData.stateConstituencies?.forEach(sc => {
      if (!stateConstituenciesByStateAndFederalConstituency[sc.state]) {
        stateConstituenciesByStateAndFederalConstituency[sc.state] = {};
      }
      if (!stateConstituenciesByStateAndFederalConstituency[sc.state][sc.federal_constituency]) {
        stateConstituenciesByStateAndFederalConstituency[sc.state][sc.federal_constituency] = [];
      }
      stateConstituenciesByStateAndFederalConstituency[sc.state][sc.federal_constituency].push(sc.state_constituency);
    });

    // State constituencies by state (flat)
    const stateConstituenciesByState = {};
    nigerianOriginData.stateConstituencies?.forEach(sc => {
      if (!stateConstituenciesByState[sc.state]) {
        stateConstituenciesByState[sc.state] = [];
      }
      if (!stateConstituenciesByState[sc.state].includes(sc.state_constituency)) {
        stateConstituenciesByState[sc.state].push(sc.state_constituency);
      }
    });

    // Update existing dropdown data with new mappings
    existingDropdownData.senatorialDistricts = senatorialDistrictsByState;
    existingDropdownData.federalConstituencies = federalConstituenciesByState;
    existingDropdownData.federalConstituenciesByStateAndSenatorialDistrict = federalConstituenciesByStateAndSenatorialDistrict;
    existingDropdownData.stateConstituenciesByState = stateConstituenciesByState;
    existingDropdownData.stateConstituenciesByStateAndFederalConstituency = stateConstituenciesByStateAndFederalConstituency;

    // Add diaspora origin data
    existingDropdownData.diasporaOrigin = diasporaOriginData;

    // Add diaspora current location reference (store separately)
    // This is already in public/data/diaspora-location-data.json

    console.log('✓ Merged all hierarchical mappings');

    // Save updated dropdown-data.json
    fs.writeFileSync(
      dropdownDataPath,
      JSON.stringify(existingDropdownData, null, 2)
    );
    console.log(`✓ Updated ${dropdownDataPath}`);

    // Also save dedicated data files for easy access
    fs.writeFileSync(
      path.join(publicDataPath, 'nigerian-origin-data.json'),
      JSON.stringify(nigerianOriginData, null, 2)
    );
    console.log(`✓ Saved ${path.join(publicDataPath, 'nigerian-origin-data.json')}`);

    fs.writeFileSync(
      path.join(publicDataPath, 'nigerian-current-location-data.json'),
      JSON.stringify(nigerianCurrentLocationData, null, 2)
    );
    console.log(`✓ Saved ${path.join(publicDataPath, 'nigerian-current-location-data.json')}`);

    fs.writeFileSync(
      path.join(publicDataPath, 'diaspora-origin-data.json'),
      JSON.stringify(diasporaOriginData, null, 2)
    );
    console.log(`✓ Saved ${path.join(publicDataPath, 'diaspora-origin-data.json')}`);

    fs.writeFileSync(
      path.join(publicDataPath, 'diaspora-location-data.json'),
      JSON.stringify(diasporaCurrentLocationData, null, 2)
    );
    console.log(`✓ Saved ${path.join(publicDataPath, 'diaspora-location-data.json')}`);

    console.log('\n✓ All dropdown data successfully merged and committed!');
  } catch (error) {
    console.error('Error merging dropdown data:', error);
    process.exit(1);
  }
}

mergeAllDropdownData();
