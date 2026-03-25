/**
 * POST /api/admin/seed-ontology
 * Seeds the Firestore "ontology" collection from static JSON (continents, countries, Nigerian states/LGAs/wards/towns, hierarchy villages/kindreds).
 * Call once after deployment or when refreshing registry data.
 */

import { NextResponse } from 'next/server';
import { buildOntologySeed } from '@/lib/ontology-seed';
import { upsertOntologyEntities } from '@/lib/ontology-registry';

export async function POST() {
  try {
    const entities = buildOntologySeed();
    const { success, errors } = await upsertOntologyEntities(entities);
    return NextResponse.json({
      success: true,
      message: `Seeded ${success} ontology entities`,
      count: success,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error('Seed ontology error:', e);
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Seed failed' },
      { status: 500 }
    );
  }
}
