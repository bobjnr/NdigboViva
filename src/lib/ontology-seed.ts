/**
 * Build ontology seed entities from existing JSON and static data.
 * Used by POST /api/admin/seed-ontology to populate Firestore.
 */

import type { OntologyEntity } from './ontology-types';
import {
  continentId,
  subContinentId,
  countryId,
  nationalRegionId,
  stateId,
  senatorialZoneId,
  lgaId,
  federalConstituencyId,
  stateConstituencyId,
  wardId,
  townId,
  villageId,
  kindredId,
  toIdSegment,
} from './ontology-ids';

import {
  continentSubContinents,
  nigerianGeoZones,
  senatorialDistricts,
  federalConstituencies,
  stateConstituenciesByState,
} from './extended-location-data';

// Static JSON (Next.js can import JSON)
import worldLocations from './world-locations.json';
import townsByLga from './towns-by-lga.json';
import nigeriaWards from './nigeria-wards.json';
import genealogyHierarchy from './genealogy-hierarchy.json';

const continentCountries = worldLocations.continentCountries as Record<string, string[]>;
const townsData = townsByLga as Record<string, string[]>;
const wardsData = nigeriaWards as { state: string; lgas: { lga: string; wards: string[] }[] }[];
const hierarchy = genealogyHierarchy as Record<
  string,
  {
    quarters: Record<
      string,
      {
        obis: Record<
          string,
          {
            clans: Record<
              string,
              {
                villages: Record<string, { kindreds: Record<string, string[]> }>;
              }
            >;
          }
        >;
      }
    >;
  }
>;

function titleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function formatStateName(slug: string): string {
  if (slug.toLowerCase() === 'fct' || slug.toLowerCase() === 'abuja') return 'FCT';
  return titleCase(slug);
}

function entity(
  id: string,
  name: string,
  type: OntologyEntity['type'],
  parentId?: string,
  displayName?: string,
  code?: string
): OntologyEntity {
  return {
    id,
    name: toIdSegment(name) || id,
    type,
    parentId,
    isPublic: true,
    displayName: displayName ?? titleCase(name),
    code,
  };
}

export function buildOntologySeed(): OntologyEntity[] {
  const list: OntologyEntity[] = [];
  const stateIdsByStateName: Record<string, string> = {};
  const lgaIdsByLgaKey: Record<string, string> = {};
  const townIdsList: string[] = [];

  const ngaId = countryId('Nigeria');

  // 1. Continents
  const continents = Object.keys(continentCountries);
  continents.forEach((c) => {
    list.push(entity(continentId(c), c, 'CONTINENT', undefined, c));
  });

  // 2. Sub-continents (parent = continent)
  Object.entries(continentSubContinents).forEach(([cont, subList]) => {
    const contId = continentId(cont);
    subList.forEach((sub) => {
      list.push(entity(subContinentId(contId, sub), sub, 'SUB_CONTINENT', contId, sub));
    });
  });

  // 3. Countries (parent = continent)
  Object.entries(continentCountries).forEach(([cont, countries]) => {
    const contId = continentId(cont);
    (countries as string[]).forEach((country) => {
      const id = countryId(country);
      if (!list.some((e) => e.id === id)) {
        list.push(entity(id, country, 'COUNTRY', contId, country));
      }
    });
  });

  // 4. National regions (Nigeria)
  Object.keys(nigerianGeoZones).forEach((region) => {
    list.push(entity(nationalRegionId(ngaId, region), region, 'NATIONAL_REGION', ngaId, region));
  });

  // 5. States (Nigeria) from nigeria-wards
  wardsData.forEach((stateObj) => {
    const stateName = formatStateName(stateObj.state);
    const stId = stateId(ngaId, stateName);
    stateIdsByStateName[stateName] = stId;
    list.push(entity(stId, stateName, 'STATE', ngaId, stateName));
  });

  // 6. Senatorial zones
  Object.entries(senatorialDistricts).forEach(([stateName, zones]) => {
    const stId = stateIdsByStateName[stateName];
    if (!stId) return;
    zones.forEach((zone) => {
      list.push(entity(senatorialZoneId(stId, zone), zone, 'SENATORIAL_ZONE', stId, zone));
    });
  });

  // 7. Federal constituencies
  Object.entries(federalConstituencies).forEach(([stateName, fcs]) => {
    const stId = stateIdsByStateName[stateName];
    if (!stId) return;
    fcs.forEach((fc) => {
      list.push(entity(federalConstituencyId(stId, fc), fc, 'FEDERAL_CONSTITUENCY', stId, fc));
    });
  });

  // 7b. State constituencies (by state)
  Object.entries(stateConstituenciesByState).forEach(([stateName, scs]) => {
    const stId = stateIdsByStateName[stateName];
    if (!stId) return;
    scs.forEach((sc) => {
      list.push(entity(stateConstituencyId(stId, sc), sc, 'STATE_CONSTITUENCY', stId, sc));
    });
  });

  // 8. LGAs and Wards
  wardsData.forEach((stateObj) => {
    const stateName = formatStateName(stateObj.state);
    const stId = stateIdsByStateName[stateName];
    if (!stId) return;
    stateObj.lgas.forEach((lgaObj) => {
      const lgaName = titleCase(lgaObj.lga);
      const lgaIdVal = lgaId(stId, lgaName);
      lgaIdsByLgaKey[lgaName] = lgaIdVal;
      list.push(entity(lgaIdVal, lgaName, 'LGA', stId, lgaName));
      lgaObj.wards.forEach((wardName, wi) => {
        const wNum = String(wi + 1).padStart(2, '0');
        list.push(
          entity(wardId(lgaIdVal, wNum), wardName, 'WARD', lgaIdVal, titleCase(wardName), wNum)
        );
      });
    });
  });

  // 9. Towns (from towns-by-lga; key = LGA display name)
  Object.entries(townsData).forEach(([lgaName, towns]) => {
    const lgaIdVal = lgaIdsByLgaKey[lgaName];
    if (!lgaIdVal) return;
    towns.forEach((town) => {
      const id = townId(lgaIdVal, town);
      townIdsList.push(id);
      list.push(entity(id, town, 'TOWN', lgaIdVal, town));
    });
  });

  // 10. Villages and Kindreds from genealogy-hierarchy (town keys are often UPPERCASE)
  Object.entries(hierarchy).forEach(([townName, townData]) => {
    const twId = list.find(
      (e) => e.type === 'TOWN' && (e.name === toIdSegment(townName) || e.id.endsWith(toIdSegment(townName)))
    )?.id;
    if (!twId) return;
    const quarters = townData.quarters || {};
    Object.values(quarters).forEach((quarter) => {
      Object.values(quarter.obis || {}).forEach((obi) => {
        Object.values(obi.clans || {}).forEach((clan) => {
          Object.entries(clan.villages || {}).forEach(([villageName, villageData]) => {
            const vlId = villageId(twId, villageName);
            if (!list.some((e) => e.id === vlId)) {
              list.push(entity(vlId, villageName, 'VILLAGE', twId, titleCase(villageName)));
            }
            Object.keys(villageData.kindreds || {}).forEach((kindredName) => {
              const kdId = kindredId(vlId, kindredName);
              if (!list.some((e) => e.id === kdId)) {
                list.push(entity(kdId, kindredName, 'KINDRED', vlId, titleCase(kindredName)));
              }
            });
          });
        });
      });
    });
  });

  return list;
}
