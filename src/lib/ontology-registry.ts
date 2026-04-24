/**
 * Ontology Registry — Firestore-backed hierarchy.
 * Query: WHERE parentId == selected AND isPublic == true ORDER BY name.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { OntologyEntity, OntologyType } from './ontology-types';

const COLLECTION = 'ontology';

function fromDoc(data: Record<string, unknown>): OntologyEntity {
  const createdAt = data.createdAt;
  const updatedAt = data.updatedAt;
  return {
    id: data.id as string,
    name: data.name as string,
    type: data.type as OntologyType,
    parentId: data.parentId as string | undefined,
    isPublic: data.isPublic === true,
    sortOrder: data.sortOrder as number | undefined,
    displayName: data.displayName as string | undefined,
    code: data.code as string | undefined,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : (createdAt as string | undefined),
    updatedAt: updatedAt instanceof Timestamp ? updatedAt.toDate().toISOString() : (updatedAt as string | undefined),
  };
}

/**
 * Get a single entity by ID.
 */
export async function getOntologyById(id: string): Promise<OntologyEntity | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return fromDoc(snap.data() as Record<string, unknown>);
}

/**
 * Get children of a parent. Public-only by default.
 * Uses composite query: type (optional), parentId, isPublic, orderBy name.
 */
export async function getOntologyChildren(
  parentId: string | null,
  type?: OntologyType,
  publicOnly = true
): Promise<OntologyEntity[]> {
  const col = collection(db, COLLECTION);
  const constraints = [];
  if (parentId === null || parentId === '') {
    constraints.push(where('parentId', '==', null));
  } else {
    constraints.push(where('parentId', '==', parentId));
  }
  if (type) constraints.push(where('type', '==', type));
  if (publicOnly) constraints.push(where('isPublic', '==', true));
  const q = query(col, ...constraints, orderBy('name'), limit(500));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.data() as Record<string, unknown>));
}

/**
 * Get root entities (no parent). For continents, pass type 'CONTINENT'.
 */
export async function getOntologyRoots(type: OntologyType, publicOnly = true): Promise<OntologyEntity[]> {
  return getOntologyChildren(null, type, publicOnly);
}

/** Get continents (root geographic) */
export async function getContinents(): Promise<OntologyEntity[]> {
  return getOntologyRoots('CONTINENT');
}

/** Get sub-continents under a continent */
export async function getSubContinents(continentId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(continentId, 'SUB_CONTINENT');
}

/** Get sub-regions under a sub-continent */
export async function getSubRegions(subContinentId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(subContinentId, 'SUB_REGION');
}

/** Get countries under a continent (or under sub-region if we add that later) */
export async function getCountries(parentId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(parentId, 'COUNTRY');
}

/** Get national regions under a country */
export async function getNationalRegions(countryId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(countryId, 'NATIONAL_REGION');
}

/** Get states under a country */
export async function getStates(countryId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(countryId, 'STATE');
}

/** Get senatorial zones under a state */
export async function getSenatorialZones(stateId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(stateId, 'SENATORIAL_ZONE');
}

/** Get LGAs under a state */
export async function getLgas(stateId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(stateId, 'LGA');
}

/** Get federal constituencies under a state */
export async function getFederalConstituencies(stateId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(stateId, 'FEDERAL_CONSTITUENCY');
}

/** Get state constituencies under a state */
export async function getStateConstituencies(stateId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(stateId, 'STATE_CONSTITUENCY');
}

/** Get wards under an LGA (optionally filter by state constituency ID if we store it on ward) */
export async function getWards(lgaId: string, stateConstituencyId?: string): Promise<OntologyEntity[]> {
  const list = await getOntologyChildren(lgaId, 'WARD');
  if (!stateConstituencyId) return list;
  return list.filter((e) => (e as { stateConstituencyId?: string }).stateConstituencyId === stateConstituencyId);
}

/** Get towns under an LGA */
export async function getTowns(lgaId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(lgaId, 'TOWN');
}

/** Get clans under a town */
export async function getClans(townId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(townId, 'CLAN');
}

/** Get town admin level 1 under a town */
export async function getTownLevel1(townId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(townId, 'TOWN_LEVEL_1');
}

export async function getTownLevel2(tl1Id: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(tl1Id, 'TOWN_LEVEL_2');
}

export async function getTownLevel3(tl2Id: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(tl2Id, 'TOWN_LEVEL_3');
}

export async function getTownLevel4(tl3Id: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(tl3Id, 'TOWN_LEVEL_4');
}

/** Get villages under a clan */
export async function getVillages(clanId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(clanId, 'VILLAGE');
}

/** Get hamlets under a village */
export async function getHamlets(villageId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(villageId, 'HAMLET');
}

/** Get lineages under a town (cultural overlay) */
export async function getLineages(townId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(townId, 'LINEAGE');
}

/** Get kindreds under hamlet OR under lineage (cultural overlay). Caller passes the chosen parentId. */
export async function getKindreds(parentId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(parentId, 'KINDRED');
}

/** Get extended families under a kindred */
export async function getExtendedFamilies(kindredId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(kindredId, 'EXTENDED_FAMILY');
}

/** Get nuclear families under an extended family */
export async function getNuclearFamilies(extendedFamilyId: string): Promise<OntologyEntity[]> {
  return getOntologyChildren(extendedFamilyId, 'NUCLEAR_FAMILY');
}

// ─── Write (for seeding and admin "Request addition") ───────────────────────

export async function upsertOntologyEntity(entity: OntologyEntity): Promise<void> {
  const ref = doc(db, COLLECTION, entity.id);
  const data = {
    ...entity,
    updatedAt: Timestamp.now(),
  };
  await setDoc(ref, data, { merge: true });
}

const BATCH_SIZE = 500;

export async function upsertOntologyEntities(entities: OntologyEntity[]): Promise<{ success: number; errors: string[] }> {
  const errors: string[] = [];
  let success = 0;
  const now = Timestamp.now();
  for (let i = 0; i < entities.length; i += BATCH_SIZE) {
    const chunk = entities.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const entity of chunk) {
      try {
        const ref = doc(db, COLLECTION, entity.id);
        batch.set(ref, { ...entity, updatedAt: now }, { merge: true });
        success++;
      } catch (e) {
        errors.push(`${entity.id}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    await batch.commit();
  }
  return { success, errors };
}
