/**
 * GET /api/ontology/children?parentId=...&type=...
 * Returns public ontology entities whose parentId matches (or roots if parentId is empty and type given).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOntologyChildrenAdmin, getOntologyRootsAdmin } from '@/lib/ontology-admin';
import type { OntologyType } from '@/lib/ontology-types';

const VALID_TYPES: OntologyType[] = [
  'CONTINENT', 'SUB_CONTINENT', 'SUB_REGION', 'COUNTRY', 'NATIONAL_REGION',
  'STATE', 'SENATORIAL_ZONE', 'LGA', 'FEDERAL_CONSTITUENCY', 'STATE_CONSTITUENCY',
  'WARD', 'TOWN', 'CLAN', 'TOWN_LEVEL_1', 'TOWN_LEVEL_2', 'TOWN_LEVEL_3', 'TOWN_LEVEL_4',
  'VILLAGE', 'HAMLET', 'LINEAGE', 'KINDRED', 'EXTENDED_FAMILY', 'NUCLEAR_FAMILY',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') ?? undefined;
    const typeParam = searchParams.get('type');
    const type = typeParam && VALID_TYPES.includes(typeParam as OntologyType) ? (typeParam as OntologyType) : undefined;

    let entities;
    if ((!parentId || parentId === '') && type) {
      entities = await getOntologyRootsAdmin(type);
    } else {
      entities = await getOntologyChildrenAdmin(parentId || null, type);
    }

    return NextResponse.json({ success: true, data: entities });
  } catch (e) {
    console.error('Ontology children error:', e);
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Request failed' },
      { status: 500 }
    );
  }
}
