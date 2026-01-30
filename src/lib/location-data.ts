import genealogyHierarchy from './genealogy-hierarchy.json';
import townsByLga from './towns-by-lga.json';
import worldLocations from './world-locations.json';

// Nigerian States and their LGAs data structure
export interface LocationData {
  state: string;
  lgas: string[];
}

export interface TownData {
  lga: string;
  towns: string[];
}

export interface VillageData {
  town: string;
  villages: string[];
}

// Deep hierarchy interfaces
export interface HierarchyKindred {
  [kindred: string]: string[]; // Array of Umunna
}

export interface HierarchyVillage {
  kindreds: HierarchyKindred;
}

export interface HierarchyClan {
  villages: { [village: string]: HierarchyVillage };
}

export interface HierarchyObi {
  clans: { [clan: string]: HierarchyClan };
}

export interface HierarchyQuarter {
  obis: { [obi: string]: HierarchyObi };
}

export interface HierarchyTown {
  quarters: { [quarter: string]: HierarchyQuarter };
}

export interface GenealogyHierarchy {
  [town: string]: HierarchyTown;
}

export const townHierarchy: GenealogyHierarchy = genealogyHierarchy as unknown as GenealogyHierarchy;

// Nigerian States with their LGAs (focusing on Igbo states)
export const nigerianStates: LocationData[] = [
  {
    state: "Abia",
    lgas: [
      "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North",
      "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo",
      "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"
    ]
  },
  {
    state: "Anambra",
    lgas: [
      "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South",
      "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka",
      "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North",
      "Orumba South", "Oyi"
    ]
  },
  {
    state: "Ebonyi",
    lgas: [
      "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South",
      "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
    ]
  },
  {
    state: "Enugu",
    lgas: [
      "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti",
      "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka",
      "Oji River", "Udi", "Uzo Uwani"
    ]
  },
  {
    state: "Imo",
    lgas: [
      "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South",
      "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba",
      "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Onuimo", "Orlu",
      "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"
    ]
  },
  {
    state: "Delta",
    lgas: [
      "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West",
      "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West",
      "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North",
      "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"
    ]
  },
  {
    state: "Rivers",
    lgas: [
      "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru",
      "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor",
      "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"
    ]
  }
];

// Complete towns data extracted from the genealogy database
export const townsData: { [lga: string]: string[] } = townsByLga as { [lga: string]: string[] };

// Sample villages data (this would be much more comprehensive in a real implementation)
export const villagesData: { [town: string]: string[] } = {};

// Countries and Continents data from world-locations.json
export const continents = Object.keys(worldLocations.continentCountries);

// Flatten all countries from all continents
export const countries = Object.values(worldLocations.continentCountries).flat();

// Mapping of continents to their countries
export const continentCountries: { [continent: string]: string[] } = worldLocations.continentCountries;

// Mapping of countries to their states
export const countryStates: { [country: string]: LocationData[] } = {
  ...worldLocations.countryStates,
  "Nigeria": nigerianStates,
};

export interface GenealogyFormData {
  currentCountry: string;
  currentState: string;
  currentLGA: string;
  currentTown: string;
  currentVillage: string;
  originState: string;
  originLGA: string;
  originTown: string;
  originVillage: string;
  kindred: string;
  familyName: string;
  personalName: string;
  email: string;
  phone: string;
  additionalInfo: string;
}
