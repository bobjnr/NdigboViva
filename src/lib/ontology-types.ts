/**
 * Institutional Ontology — Registry entity types for Firestore and app.
 */

export const ONTOLOGY_TYPES = [
  'CONTINENT',
  'SUB_CONTINENT',
  'SUB_REGION',
  'COUNTRY',
  'NATIONAL_REGION',
  'STATE',
  'SENATORIAL_ZONE',
  'LGA',
  'FEDERAL_CONSTITUENCY',
  'STATE_CONSTITUENCY',
  'WARD',
  'TOWN',
  'TOWN_LEVEL_1',
  'TOWN_LEVEL_2',
  'TOWN_LEVEL_3',
  'TOWN_LEVEL_4',
  'VILLAGE',
  'HAMLET',
  'LINEAGE',
  'KINDRED',
  'EXTENDED_FAMILY',
  'NUCLEAR_FAMILY',
] as const;

export type OntologyType = (typeof ONTOLOGY_TYPES)[number];

export interface OntologyEntity {
  id: string;
  name: string;
  type: OntologyType;
  parentId?: string;
  isPublic: boolean;
  sortOrder?: number;
  /** Optional: display name if different from name (e.g. "South East" vs "SOUTHEAST") */
  displayName?: string;
  /** Optional: ISO3 for countries; ward number for wards */
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OntologyEntityCreate {
  id: string;
  name: string;
  type: OntologyType;
  parentId?: string;
  isPublic: boolean;
  sortOrder?: number;
  displayName?: string;
  code?: string;
}

/** Firestore document shape (timestamps as Firestore Timestamp or ISO string) */
export interface OntologyDocument extends Omit<OntologyEntity, 'createdAt' | 'updatedAt'> {
  createdAt?: unknown;
  updatedAt?: unknown;
}
