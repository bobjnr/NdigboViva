import genealogyHierarchy from './genealogy-hierarchy.json';
import townsByLga from './towns-by-lga.json';
import worldLocations from './world-locations.json';
import dropdownData from './dropdown-data.json';

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

// Nigerian States with their LGAs (from dropdown data CSVs)
export const nigerianStates: LocationData[] = (dropdownData as { nigerianStates: LocationData[] }).nigerianStates;

// Towns by LGA only. Do not use wards as towns — Town dropdown must show towns, not political wards.
// LGAs not in this list will get an empty Town dropdown (form falls back to free-text input).
export const townsData: { [lga: string]: string[] } = { ...(townsByLga as { [lga: string]: string[] }) };

// Political wards by LGA (from dropdown data CSVs)
export const wardsData: { [lga: string]: string[] } = { ...(dropdownData as { wardsData: { [lga: string]: string[] } }).wardsData };

// Sample villages data (this would be much more comprehensive in a real implementation)
export const villagesData: { [town: string]: string[] } = {};

// Continents and countries from dropdown data CSVs
export const continents: string[] = (dropdownData as { continents: string[] }).continents;
export const continentCountries: { [continent: string]: string[] } = (dropdownData as { continentCountries: { [continent: string]: string[] } }).continentCountries;
export const countries: string[] = Object.values(continentCountries).flat();

// Mapping of countries to their states (Nigeria from dropdown; others from world-locations)
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
  originNationalityCustom?: string;
  dualCitizenshipCountry?: string;
}
