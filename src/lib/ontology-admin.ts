import { Timestamp } from 'firebase-admin/firestore';
import { getAdminFirestore } from './firebase-admin';
import type { OntologyDocument, OntologyEntity, OntologyType } from './ontology-types';

const ONTOLOGY_COLLECTION = 'ontology';
const IMPORT_BATCH_COLLECTION = 'ontology_import_batches';
const BATCH_SIZE = 500;

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  ) as T;
}

function mapOntologyDoc(id: string, data: OntologyDocument): OntologyEntity {
  const createdAt = data.createdAt;
  const updatedAt = data.updatedAt;

  return {
    id,
    name: data.name,
    type: data.type,
    parentId: data.parentId ?? undefined,
    isPublic: data.isPublic === true,
    sortOrder: data.sortOrder,
    displayName: data.displayName,
    code: data.code,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : undefined,
    updatedAt: updatedAt instanceof Timestamp ? updatedAt.toDate().toISOString() : undefined,
  };
}

export async function getOntologyDocumentsByIdsAdmin(ids: string[]): Promise<Map<string, OntologyEntity>> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) return new Map();

  const db = getAdminFirestore();
  const refs = uniqueIds.map((id) => db.collection(ONTOLOGY_COLLECTION).doc(id));
  const snapshots = await db.getAll(...refs);

  const entities = new Map<string, OntologyEntity>();
  for (const snapshot of snapshots) {
    if (!snapshot.exists) continue;
    entities.set(snapshot.id, mapOntologyDoc(snapshot.id, snapshot.data() as OntologyDocument));
  }

  return entities;
}

export async function getOntologyChildrenAdmin(
  parentId: string | null,
  type?: OntologyType,
  publicOnly = true
): Promise<OntologyEntity[]> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(ONTOLOGY_COLLECTION)
    .where('parentId', '==', parentId === null || parentId === '' ? null : parentId)
    .limit(1000)
    .get();

  return snapshot.docs
    .map((doc) => mapOntologyDoc(doc.id, doc.data() as OntologyDocument))
    .filter((entity) => (type ? entity.type === type : true))
    .filter((entity) => (publicOnly ? entity.isPublic === true : true))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export async function getOntologyRootsAdmin(
  type: OntologyType,
  publicOnly = true
): Promise<OntologyEntity[]> {
  return getOntologyChildrenAdmin(null, type, publicOnly);
}

export async function upsertOntologyEntitiesAdmin(
  entities: OntologyEntity[]
): Promise<{ success: number; errors: string[] }> {
  const db = getAdminFirestore();
  const errors: string[] = [];
  let success = 0;
  const now = Timestamp.now();

  for (let i = 0; i < entities.length; i += BATCH_SIZE) {
    const chunk = entities.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    let chunkSuccess = 0;

    for (const entity of chunk) {
      try {
        const ref = db.collection(ONTOLOGY_COLLECTION).doc(entity.id);
        batch.set(
          ref,
          omitUndefined({
            ...entity,
            parentId: entity.parentId ?? null,
            updatedAt: now,
            createdAt: entity.createdAt ? Timestamp.fromDate(new Date(entity.createdAt)) : now,
          }),
          { merge: true }
        );
        chunkSuccess += 1;
      } catch (error) {
        errors.push(`${entity.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    await batch.commit();
    success += chunkSuccess;
  }

  return { success, errors };
}

export type OntologyImportBatchLog = {
  batchId: string;
  fileName?: string;
  uploadedBy: string;
  committedCount: number;
  selectedRowNumbers: number[];
  summary: Record<string, number>;
  committedIds: string[];
};

export async function logOntologyImportBatch(entry: OntologyImportBatchLog): Promise<void> {
  const db = getAdminFirestore();
  await db.collection(IMPORT_BATCH_COLLECTION).doc(entry.batchId).set({
    ...entry,
    committedAt: Timestamp.now(),
  });
}
