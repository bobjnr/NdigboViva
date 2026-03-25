// Extended Location Data for Genealogy Form hierarchies (from dropdown data CSVs)
import dropdownData from './dropdown-data.json';

const data = dropdownData as {
  continentSubContinents: { [continent: string]: string[] };
  culturalRegionsByContinent: { [continent: string]: string[] };
  geopoliticalBlocs: string[];
  senatorialDistricts: { [state: string]: string[] };
  federalConstituencies: { [state: string]: string[] };
  federalConstituenciesByStateAndSenatorialDistrict: { [state: string]: { [senatorialDistrict: string]: string[] } };
  stateConstituenciesByState: { [state: string]: string[] };
  stateConstituenciesByStateAndFederalConstituency: { [state: string]: { [federalConstituency: string]: string[] } };
};

// ==========================================
// 1. Continent to Sub-Continent Mapping (economic regions)
// ==========================================
export const continentSubContinents: { [continent: string]: string[] } = data.continentSubContinents;

// Cultural regions by continent
export const culturalRegionsByContinent: { [continent: string]: string[] } = data.culturalRegionsByContinent ?? {};

// Global geopolitical blocs list
export const geopoliticalBlocs: string[] = data.geopoliticalBlocs ?? [];

// ==========================================
// 2. Nigerian Geo-Political Zones (Regions)
// ==========================================
export const nigerianGeoZones: { [zone: string]: string[] } = {
    "North Central": ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
    "North East": ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
    "North West": ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
    "South East": ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    "South South": ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
    "South West": ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"]
};

// Helper to get region by state
export const getRegionByState = (state: string): string => {
    for (const [zone, states] of Object.entries(nigerianGeoZones)) {
        if (states.includes(state)) return zone;
    }
    return "";
};

// ==========================================
// 3. Senatorial Districts (from dropdown data CSVs)
// ==========================================
export const senatorialDistricts: { [state: string]: string[] } = data.senatorialDistricts;

// ==========================================
// 4. Federal & State Constituencies (from dropdown data CSVs)
// ==========================================
export const federalConstituencies: { [state: string]: string[] } = data.federalConstituencies;
export const federalConstituenciesByStateAndSenatorialDistrict: { [state: string]: { [senatorialDistrict: string]: string[] } } =
  data.federalConstituenciesByStateAndSenatorialDistrict ?? {};
export const stateConstituenciesByState: { [state: string]: string[] } = data.stateConstituenciesByState;
export const stateConstituenciesByStateAndFederalConstituency: { [state: string]: { [federalConstituency: string]: string[] } } =
  data.stateConstituenciesByStateAndFederalConstituency ?? {};

// Legacy: by LGA (empty for now)
export const stateConstituencies: { [lga: string]: string[] } = {};
