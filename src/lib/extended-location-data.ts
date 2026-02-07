
// Extended Location Data for Genealogy Form hierarchies

// ==========================================
// 1. Continent to Sub-Continent Mapping
// ==========================================
export const continentSubContinents: { [continent: string]: string[] } = {
    "Africa": [
        "West Africa", "East Africa", "North Africa", "Southern Africa", "Central Africa"
    ],
    "Asia": [
        "Eastern Asia", "Southern Asia", "South-Eastern Asia", "Western Asia", "Central Asia"
    ],
    "Europe": [
        "Western Europe", "Eastern Europe", "Northern Europe", "Southern Europe"
    ],
    "North America": [
        "Northern America", "Caribbean", "Central America"
    ],
    "South America": [
        "South America"
    ],
    "Oceania": [
        "Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"
    ],
    "Antarctica": [
        "Antarctica"
    ]
};

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
// 3. Senatorial Districts (Key States)
// ==========================================
export const senatorialDistricts: { [state: string]: string[] } = {
    "Abia": ["Abia North", "Abia Central", "Abia South"],
    "Anambra": ["Anambra North", "Anambra Central", "Anambra South"],
    "Ebonyi": ["Ebonyi North", "Ebonyi Central", "Ebonyi South"],
    "Enugu": ["Enugu East", "Enugu North", "Enugu West"],
    "Imo": ["Imo East (Owerri)", "Imo West (Orlu)", "Imo North (Okigwe)"],
    "Delta": ["Delta North", "Delta South", "Delta Central"],
    "Rivers": ["Rivers East", "Rivers South East", "Rivers West"]
};

// ==========================================
// 4. Federal Constituencies (Sample for Key States)
// data source: simplified mapping for UI
// ==========================================
export const federalConstituencies: { [state: string]: string[] } = {
    "Abia": [
        "Aba North/South", "Arochukwu/Ohafia", "Bende", "Isiala Ngwa North/South",
        "Isuikwuato/Umunneochi", "Obingwa/Osisioma/Ugwunagbo", "Ukwa East/West", "Umuahia North/South"
    ],
    "Anambra": [
        "Aguata", "Anambra East/West", "Anaocha/Njikoka/Dunukofia", "Awka North/South",
        "Idemili North/South", "Ihiala", "Nnewi North/South/Ekwusigo", "Ogbaru",
        "Onitsha North/South", "Orumba North/South", "Oyi/Ayamelum"
    ],
    "Ebonyi": [
        "Abakaliki/Izzi", "Afikpo North/South", "Ebonyi/Ohaukwu", "Ezza North/Ishielu",
        "Ezza South/Ikwo", "Ivo/Ohaozara/Onicha"
    ],
    "Enugu": [
        "Aninri/Awgu/Oji River", "Enugu East/Isi-Uzo", "Enugu North/South", "Ezeagu/Udi",
        "Igbo-Etiti/Uzo-Uwani", "Igbo-Eze North/Udenu", "Nkanu East/West", "Nsukka/Igbo-Eze South"
    ],
    "Imo": [
        "Aboh Mbaise/Ngor Okpala", "Ahiazu/Ezinihitte", "Ehime Mbano/Ihitte Uboma/Obowo",
        "Ideato North/South", "Ikeduru/Mbaitoli", "Isiala Mbano/Okigwe/Onuimo",
        "Isu/Njaba/Nkwerre/Nwangele", "Oguta/Ohaji/Egbema/Oru West", "Owerri Mun/North/West", "Orlu/Orsu/Oru East"
    ],
    "Delta": [
        "Aniocha/Oshimili", "Bomadi/Patani", "Burutu", "Ethiope", "Ika", "Isoko",
        "Ndokwa/Ukwuani", "Okpe/Sapele/Uvwie", "Ughelli/Udu", "Warri"
    ],
    "Rivers": [
        "Abua/Odual/Ahoada East", "Ahoada West/Ogba/Egbema/Ndoni", "Akuku-Toru/Asari-Toru",
        "Andoni/Opobo/Nkoro", "Degema/Bonny", "Eleme/Oyigbo/Tai", "Etche/Omuma",
        "Ikwerre/Emohua", "Khana/Gokana", "Obio/Akpor", "Okrika/Ogu/Bolo", "Port Harcourt I", "Port Harcourt II"
    ]
};

// ==========================================
// 5. State Constituencies (Sample Placeholders)
// ==========================================
// This list is vast (usually 20-30 per state). For now, use text input or filtered by LGA if needed.
// Leaving as empty map for future expansion.
export const stateConstituencies: { [lga: string]: string[] } = {};
