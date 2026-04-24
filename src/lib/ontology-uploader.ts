import {
  clanId,
  countryId,
  extendedFamilyId,
  getOntologyIdPrefix,
  hamletId,
  kindredId,
  lgaId,
  stateId,
  toIdSegment,
  townId,
  villageId,
} from './ontology-ids';
import { getOntologyDocumentsByIdsAdmin } from './ontology-admin';
import { buildOntologySeed } from './ontology-seed';
import type { OntologyEntity } from './ontology-types';

const SUPPORTED_UPLOAD_TYPES = ['CLAN', 'VILLAGE', 'HAMLET', 'KINDRED', 'EXTENDED_FAMILY'] as const;
type SupportedUploadType = (typeof SUPPORTED_UPLOAD_TYPES)[number];
type PreviewStatus = 'create' | 'update' | 'conflict' | 'invalid';

type ParsedCsvRow = {
  type: string;
  name: string;
  displayName?: string;
  parentId?: string;
  country?: string;
  state?: string;
  lga?: string;
  town?: string;
  clan?: string;
  village?: string;
  hamlet?: string;
  kindred?: string;
  isPublic?: string;
  sortOrder?: string;
  code?: string;
};

const HEADER_ALIASES: Record<string, keyof ParsedCsvRow> = {
  type: 'type',
  name: 'name',
  displayname: 'displayName',
  parentid: 'parentId',
  country: 'country',
  state: 'state',
  lga: 'lga',
  town: 'town',
  clan: 'clan',
  village: 'village',
  hamlet: 'hamlet',
  kindred: 'kindred',
  ispublic: 'isPublic',
  sortorder: 'sortOrder',
  code: 'code',
};

type DraftRow = {
  rowNumber: number;
  raw: ParsedCsvRow;
  uploadType?: SupportedUploadType;
  entity?: OntologyEntity;
  error?: string;
};

export type OntologyUploadPreviewRow = {
  rowNumber: number;
  status: PreviewStatus;
  message: string;
  raw: ParsedCsvRow;
  entity?: OntologyEntity;
  existing?: OntologyEntity;
  selectable: boolean;
};

export type OntologyUploadPreview = {
  batchId: string;
  fileName?: string;
  rows: OntologyUploadPreviewRow[];
  counts: Record<PreviewStatus | 'ready', number>;
};

const EXPECTED_PARENT_PREFIX: Record<SupportedUploadType, string[]> = {
  CLAN: ['TW'],
  VILLAGE: ['CL'],
  HAMLET: ['VL'],
  KINDRED: ['HM', 'VL', 'LN'],
  EXTENDED_FAMILY: ['KD'],
};

const REQUIRED_PARENT_TYPE: Record<SupportedUploadType, string> = {
  CLAN: 'TOWN',
  VILLAGE: 'CLAN',
  HAMLET: 'VILLAGE',
  KINDRED: 'HAMLET, VILLAGE, or LINEAGE',
  EXTENDED_FAMILY: 'KINDRED',
};

const SAME_CSV_PARENT_ALLOWED: Record<SupportedUploadType, boolean> = {
  CLAN: false,
  VILLAGE: true,
  HAMLET: true,
  KINDRED: true,
  EXTENDED_FAMILY: true,
};

const SEEDED_ONTOLOGY_IDS = new Set(buildOntologySeed().map((entity) => entity.id));

function generateBatchId(): string {
  return `ontology-import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsv(csvText: string): ParsedCsvRow[] {
  const normalizedText = csvText.replace(/^\uFEFF/, '');
  const lines = normalizedText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Partial<Record<keyof ParsedCsvRow, string>> = {};

    headers.forEach((header, index) => {
      const normalizedHeader = HEADER_ALIASES[header];
      if (!normalizedHeader) return;
      row[normalizedHeader] = (values[index] ?? '').trim();
    });

    return row as ParsedCsvRow;
  });
}

function parseBoolean(value?: string): boolean {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return !['false', '0', 'no'].includes(normalized);
}

function parseSortOrder(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function normalizeLabel(value?: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeNameForCompare(value?: string): string {
  return toIdSegment(value ?? '');
}

function validateExplicitParent(type: SupportedUploadType, parentId?: string): string | undefined {
  if (!parentId) return undefined;
  const prefix = getOntologyIdPrefix(parentId);
  if (EXPECTED_PARENT_PREFIX[type].includes(prefix)) return undefined;
  return `${type} rows require parent prefixes ${EXPECTED_PARENT_PREFIX[type].join(', ')}.`;
}

function buildAncestorIds(row: ParsedCsvRow) {
  const countryName = normalizeLabel(row.country) || 'Nigeria';
  const stateName = normalizeLabel(row.state);
  const lgaName = normalizeLabel(row.lga);
  const townName = normalizeLabel(row.town);
  const clanName = normalizeLabel(row.clan);
  const villageName = normalizeLabel(row.village);
  const hamletName = normalizeLabel(row.hamlet);
  const kindredName = normalizeLabel(row.kindred);

  const countryIdValue = countryId(countryName);
  const stateIdValue = stateName ? stateId(countryIdValue, stateName) : undefined;
  const lgaIdValue = stateIdValue && lgaName ? lgaId(stateIdValue, lgaName) : undefined;
  const townIdValue = lgaIdValue && townName ? townId(lgaIdValue, townName) : undefined;
  const clanIdValue = townIdValue && clanName ? clanId(townIdValue, clanName) : undefined;
  const villageIdValue = clanIdValue && villageName ? villageId(clanIdValue, villageName) : undefined;
  const hamletIdValue = villageIdValue && hamletName ? hamletId(villageIdValue, hamletName) : undefined;
  const kindredIdValue = hamletIdValue && kindredName ? kindredId(hamletIdValue, kindredName) : undefined;

  return {
    countryIdValue,
    stateIdValue,
    lgaIdValue,
    townIdValue,
    clanIdValue,
    villageIdValue,
    hamletIdValue,
    kindredIdValue,
  };
}

function buildEntityFromRow(rowNumber: number, row: ParsedCsvRow): DraftRow {
  const type = normalizeLabel(row.type).toUpperCase() as SupportedUploadType;
  const name = normalizeLabel(row.name);

  if (!SUPPORTED_UPLOAD_TYPES.includes(type)) {
    return {
      rowNumber,
      raw: row,
      error: `Unsupported type "${row.type}". Supported types are ${SUPPORTED_UPLOAD_TYPES.join(', ')}.`,
    };
  }

  if (!name) {
    return { rowNumber, raw: row, uploadType: type, error: 'Name is required.' };
  }

  const sortOrder = parseSortOrder(row.sortOrder);
  if (Number.isNaN(sortOrder)) {
    return { rowNumber, raw: row, uploadType: type, error: 'Sort order must be a whole number.' };
  }

  const explicitParentError = validateExplicitParent(type, normalizeLabel(row.parentId));
  if (explicitParentError) {
    return { rowNumber, raw: row, uploadType: type, error: explicitParentError };
  }

  const ancestors = buildAncestorIds(row);
  const parentId = normalizeLabel(row.parentId) || (() => {
    switch (type) {
      case 'CLAN':
        return ancestors.townIdValue;
      case 'VILLAGE':
        return ancestors.clanIdValue;
      case 'HAMLET':
        return ancestors.villageIdValue;
      case 'KINDRED':
        return ancestors.hamletIdValue;
      case 'EXTENDED_FAMILY':
        return ancestors.kindredIdValue;
      default:
        return undefined;
    }
  })();

  if (!parentId) {
    return {
      rowNumber,
      raw: row,
      uploadType: type,
      error: `Could not resolve parent for ${type}. Provide parentId or the required ancestor columns.`,
    };
  }

  let id: string;
  switch (type) {
    case 'CLAN':
      id = clanId(parentId, name);
      break;
    case 'VILLAGE':
      id = villageId(parentId, name);
      break;
    case 'HAMLET':
      id = hamletId(parentId, name);
      break;
    case 'KINDRED':
      id = kindredId(parentId, name);
      break;
    case 'EXTENDED_FAMILY':
      id = extendedFamilyId(parentId, name);
      break;
  }

  return {
    rowNumber,
    raw: row,
    uploadType: type,
    entity: {
      id,
      name: toIdSegment(name),
      type,
      parentId,
      isPublic: parseBoolean(row.isPublic),
      sortOrder,
      displayName: normalizeLabel(row.displayName) || name,
      code: normalizeLabel(row.code) || undefined,
    },
  };
}

function summarizeRows(rows: OntologyUploadPreviewRow[]): Record<PreviewStatus | 'ready', number> {
  return rows.reduce<Record<PreviewStatus | 'ready', number>>(
    (summary, row) => {
      summary[row.status] += 1;
      if (row.status === 'create' || row.status === 'update') summary.ready += 1;
      return summary;
    },
    { create: 0, update: 0, conflict: 0, invalid: 0, ready: 0 }
  );
}

function entityMatchesProtectedFields(existing: OntologyEntity, incoming: OntologyEntity): boolean {
  return (
    existing.type === incoming.type &&
    (existing.parentId ?? '') === (incoming.parentId ?? '') &&
    normalizeNameForCompare(existing.name) === normalizeNameForCompare(incoming.name)
  );
}

function providerCanSatisfyParent(
  parentId: string,
  existingIds: Set<string>,
  draftsById: Map<string, DraftRow[]>,
  visiting = new Set<string>()
): boolean {
  if (existingIds.has(parentId)) return true;
  if (visiting.has(parentId)) return false;

  const providers = draftsById.get(parentId);
  if (!providers || providers.length !== 1) return false;

  const [provider] = providers;
  if (!provider.entity) return false;

  visiting.add(parentId);
  const result = providerCanSatisfyParent(provider.entity.parentId ?? '', existingIds, draftsById, visiting);
  visiting.delete(parentId);

  return result;
}

function buildMissingParentMessage(
  draft: DraftRow,
  parentId: string,
  existingIds: Set<string>,
  draftsById: Map<string, DraftRow[]>
): string {
  const uploadType = draft.uploadType;
  if (!parentId) {
    return uploadType
      ? `${uploadType} requires a resolvable parent (${REQUIRED_PARENT_TYPE[uploadType]}). Provide parentId or the required ancestor columns.`
      : 'Parent could not be resolved from Firestore or the same CSV.';
  }

  const providers = draftsById.get(parentId);
  if (providers && providers.length > 1) {
    return `Parent ${parentId} is duplicated in this CSV, so the preview cannot resolve a single parent row.`;
  }

  if (providers?.[0] && !providers[0].entity) {
    return `Parent ${parentId} is present in this CSV at row ${providers[0].rowNumber}, but that parent row is invalid. Fix the parent row first, then preview again.`;
  }

  if (uploadType === 'CLAN') {
    if (SEEDED_ONTOLOGY_IDS.has(parentId) && !existingIds.has(parentId)) {
      return `Missing parent ${parentId} for CLAN. This is a base TOWN node from the ontology seed blueprint, so it must exist in Firestore first. Run the ontology seed or import that town before previewing this CSV again.`;
    }

    return `Missing parent ${parentId} for CLAN. CLAN rows must attach to an existing TOWN in Firestore; they cannot create the town from the same CSV. Seed or import the town first, then retry.`;
  }

  if (SEEDED_ONTOLOGY_IDS.has(parentId) && !existingIds.has(parentId)) {
    return `Parent ${parentId} matches the local ontology seed blueprint but is not in Firestore yet. Run the ontology seed first, then preview this CSV again.`;
  }

  if (uploadType && SAME_CSV_PARENT_ALLOWED[uploadType]) {
    return `Missing parent ${parentId} for ${uploadType}. Add the parent ${REQUIRED_PARENT_TYPE[uploadType]} row to the same CSV above this row, or commit that parent to Firestore first.`;
  }

  return `Parent ${parentId} could not be resolved from Firestore or the same CSV.`;
}

export async function previewOntologyCsvUpload(csvText: string, fileName?: string): Promise<OntologyUploadPreview> {
  const parsedRows = parseCsv(csvText);
  const drafts = parsedRows.map((row, index) => buildEntityFromRow(index + 2, row));

  const draftsById = new Map<string, DraftRow[]>();
  for (const draft of drafts) {
    if (!draft.entity) continue;
    const current = draftsById.get(draft.entity.id) ?? [];
    current.push(draft);
    draftsById.set(draft.entity.id, current);
  }

  const idsToFetch = new Set<string>();
  for (const draft of drafts) {
    if (!draft.entity) continue;
    idsToFetch.add(draft.entity.id);
    idsToFetch.add(draft.entity.parentId ?? '');
  }

  const existingDocs = await getOntologyDocumentsByIdsAdmin(Array.from(idsToFetch));
  const existingIds = new Set(existingDocs.keys());

  const rows: OntologyUploadPreviewRow[] = drafts.map((draft) => {
    if (draft.error || !draft.entity || !draft.uploadType) {
      return {
        rowNumber: draft.rowNumber,
        status: 'invalid',
        message: draft.error ?? 'Row could not be parsed.',
        raw: draft.raw,
        selectable: false,
      };
    }

    const duplicates = draftsById.get(draft.entity.id) ?? [];
    if (duplicates.length > 1) {
      return {
        rowNumber: draft.rowNumber,
        status: 'invalid',
        message: `Duplicate ontology ID ${draft.entity.id} appears more than once in this CSV.`,
        raw: draft.raw,
        entity: draft.entity,
        selectable: false,
      };
    }

    const parentId = draft.entity.parentId ?? '';
    if (!providerCanSatisfyParent(parentId, existingIds, draftsById)) {
      return {
        rowNumber: draft.rowNumber,
        status: 'invalid',
        message: buildMissingParentMessage(draft, parentId, existingIds, draftsById),
        raw: draft.raw,
        entity: draft.entity,
        selectable: false,
      };
    }

    const existing = existingDocs.get(draft.entity.id);
    if (!existing) {
      return {
        rowNumber: draft.rowNumber,
        status: 'create',
        message: 'New ontology entity will be created.',
        raw: draft.raw,
        entity: draft.entity,
        selectable: true,
      };
    }

    if (!entityMatchesProtectedFields(existing, draft.entity)) {
      return {
        rowNumber: draft.rowNumber,
        status: 'conflict',
        message: 'Existing entity has a different protected type, parent, or canonical name.',
        raw: draft.raw,
        entity: draft.entity,
        existing,
        selectable: false,
      };
    }

    return {
      rowNumber: draft.rowNumber,
      status: 'update',
      message: 'Existing ontology entity will be updated.',
      raw: draft.raw,
      entity: draft.entity,
      existing,
      selectable: true,
    };
  });

  return {
    batchId: generateBatchId(),
    fileName,
    rows,
    counts: summarizeRows(rows),
  };
}

export function getCommitEntitiesFromPreview(
  preview: OntologyUploadPreview,
  selectedRowNumbers: number[]
): { entities: OntologyEntity[]; invalidSelections: number[] } {
  const selectedSet = new Set(selectedRowNumbers);
  const invalidSelections: number[] = [];
  const entities: OntologyEntity[] = [];

  for (const row of preview.rows) {
    if (!selectedSet.has(row.rowNumber)) continue;
    if (!row.selectable || !row.entity) {
      invalidSelections.push(row.rowNumber);
      continue;
    }
    entities.push({
      ...row.entity,
      createdAt: row.existing?.createdAt ?? new Date().toISOString(),
    });
  }

  return { entities, invalidSelections };
}
