import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import {
  getCommitEntitiesFromPreview,
  previewOntologyCsvUpload,
} from '@/lib/ontology-uploader';
import {
  logOntologyImportBatch,
  upsertOntologyEntitiesAdmin,
} from '@/lib/ontology-admin';

export async function POST(request: NextRequest) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json({ success: false, error: access.message }, { status: access.status });
  }

  try {
    const body = await request.json();
    const action = body?.action;
    const csvText = typeof body?.csvText === 'string' ? body.csvText : '';
    const fileName = typeof body?.fileName === 'string' ? body.fileName : undefined;

    if (!csvText.trim()) {
      return NextResponse.json(
        { success: false, error: 'CSV content is required.' },
        { status: 400 }
      );
    }

    const preview = await previewOntologyCsvUpload(csvText, fileName);

    if (action === 'preview') {
      return NextResponse.json({ success: true, ...preview });
    }

    if (action !== 'commit') {
      return NextResponse.json(
        { success: false, error: 'Action must be either "preview" or "commit".' },
        { status: 400 }
      );
    }

    const selectedRowNumbers = Array.isArray(body?.selectedRowNumbers)
      ? body.selectedRowNumbers.filter((value: unknown): value is number => Number.isInteger(value))
      : [];

    if (selectedRowNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Select at least one preview row to commit.' },
        { status: 400 }
      );
    }

    const { entities, invalidSelections } = getCommitEntitiesFromPreview(preview, selectedRowNumbers);
    if (invalidSelections.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Rows ${invalidSelections.join(', ')} cannot be committed because they are invalid or conflicting.`,
        },
        { status: 400 }
      );
    }

    const result = await upsertOntologyEntitiesAdmin(entities);
    const batchId = typeof body?.batchId === 'string' && body.batchId.trim()
      ? body.batchId.trim()
      : preview.batchId;

    await logOntologyImportBatch({
      batchId,
      fileName,
      uploadedBy: access.email,
      committedCount: result.success,
      selectedRowNumbers,
      summary: preview.counts,
      committedIds: entities.map((entity) => entity.id),
    });

    return NextResponse.json({
      success: true,
      batchId,
      committedCount: result.success,
      errors: result.errors,
      counts: preview.counts,
    });
  } catch (error) {
    console.error('Ontology upload error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 500 }
    );
  }
}
