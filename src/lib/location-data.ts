import genealogyHierarchy from './genealogy-hierarchy.json';
import townsByLga from './towns-by-lga.json';
import worldLocations from './world-locations.json';
import dropdownData from './dropdown-data.json';
import csvDropdownData from './csv-dropdown-data.json';
import nigerianLocationFallback from './nigerian-location-fallback.json';

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

type NigerianFallbackData = {
  stateLgas: { [state: string]: string[] };
  townsByLga: { [lga: string]: string[] };
};

const fallbackData = nigerianLocationFallback as NigerianFallbackData;

function mergeUniqueStrings(...lists: Array<string[] | undefined>): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const list of lists) {
    for (const item of list ?? []) {
      const normalized = item.trim().toLowerCase();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      merged.push(item);
    }
  }

  return merged.sort((a, b) => a.localeCompare(b));
}

function mergeStateLocations(
  baseStates: LocationData[],
  fallbackStates: { [state: string]: string[] }
): LocationData[] {
  const byState = new Map<string, string[]>();

  for (const state of baseStates) {
    byState.set(state.state, mergeUniqueStrings(state.lgas));
  }

  for (const [stateName, fallbackLgas] of Object.entries(fallbackStates)) {
    const existing = byState.get(stateName) ?? [];
    byState.set(
      stateName,
      existing.length > 0 ? mergeUniqueStrings(existing, fallbackLgas) : mergeUniqueStrings(fallbackLgas)
    );
  }

  return Array.from(byState.entries())
    .map(([state, lgas]) => ({ state, lgas }))
    .sort((a, b) => a.state.localeCompare(b.state));
}

export const townHierarchy: GenealogyHierarchy = genealogyHierarchy as unknown as GenealogyHierarchy;

// Nigerian States with their LGAs.
// Use the curated dropdown data first, then backfill missing or incomplete states from
// the nationwide current-location CSV-derived fallback dataset.
export const nigerianStates: LocationData[] = mergeStateLocations(
  (dropdownData as { nigerianStates: LocationData[] }).nigerianStates,
  fallbackData.stateLgas
);

// Towns by LGA.
// Order of precedence:
// 1. Fallback nationwide current-location data
// 2. Legacy towns-by-lga map
// 3. Curated towns.csv-derived map
export const townsData: { [lga: string]: string[] } = {
  ...(fallbackData.townsByLga ?? {}),
  ...(townsByLga as { [lga: string]: string[] }),
  ...((csvDropdownData as { townsByLgaName: { [lga: string]: string[] } }).townsByLgaName ?? {}),
};

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
