/**
 * POST /api/admin/seed-ontology
 * Seeds the Firestore "ontology" collection from static JSON (continents, countries, Nigerian states/LGAs/wards/towns, hierarchy villages/kindreds).
 * Call once after deployment or when refreshing registry data.
 */

import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { buildOntologySeed } from '@/lib/ontology-seed';
import { upsertOntologyEntitiesAdmin } from '@/lib/ontology-admin';

export async function POST() {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json({ success: false, error: access.message }, { status: access.status });
  }

  try {
    const entities = buildOntologySeed();
    const { success, errors } = await upsertOntologyEntitiesAdmin(entities);
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
