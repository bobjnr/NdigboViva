/**
 * Firebase Bulk Import — Reads ontology CSV and writes to Firestore.
 *
 * Usage:
 *   node scripts/firebase_bulk_import.js <path-to-csv>
 *   node scripts/firebase_bulk_import.js data/ontology-templates/Nigeria_LGAs_Template.csv
 *
 * Optional:
 *   DRY_RUN=1 node scripts/firebase_bulk_import.js <path-to-csv>
 *
 * Env (from .env.local or shell):
 *   FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY (service account private key; \\n for newlines)
 *   Or: GOOGLE_APPLICATION_CREDENTIALS path to service-account JSON
 *
 * CSV columns: id, parentId, type, name, displayName, code, verified, createdAt
 * First column (id) is used as Firestore document ID.
 */

const fs = require('fs');
const path = require('path');

// Load .env.local if present (Next.js project)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/\\n/g, '\n');
      process.env[key] = val;
    }
  });
}

const admin = require('firebase-admin');

const COLLECTION = 'ontology';
const BATCH_SIZE = 500;

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] !== undefined ? values[i] : '';
    });
    return obj;
  });
  return { headers, rows };
}

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node scripts/firebase_bulk_import.js <path-to-csv>');
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), csvPath);
  if (!fs.existsSync(resolved)) {
    console.error('File not found:', resolved);
    process.exit(1);
  }

  const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
  if (dryRun) console.log('DRY RUN — no writes to Firestore');

  const content = fs.readFileSync(resolved, 'utf-8');
  const { headers, rows } = parseCsv(content);
  if (rows.length === 0) {
    console.log('No data rows in CSV.');
    process.exit(0);
  }

  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.error('Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      process.exit(1);
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ projectId });
    } else {
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      if (!clientEmail || !privateKey) {
        console.error('Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS');
        process.exit(1);
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  }

  const db = admin.firestore();
  const col = db.collection(COLLECTION);
  const now = admin.firestore.Timestamp.now();

  let written = 0;
  const batches = [];
  let batch = db.batch();

  for (const row of rows) {
    const id = (row.id || '').trim();
    if (!id) {
      console.warn('Skipping row with empty id:', row);
      continue;
    }

    const parentId = (row.parentId || '').trim() || undefined;
    const type = (row.type || '').trim();
    const name = (row.name || '').trim() || id;
    const displayName = (row.displayName || '').trim() || undefined;
    const code = (row.code || '').trim() || undefined;
    const verified = (row.verified || '').trim();
    const isPublic = verified !== '0' && verified.toLowerCase() !== 'false';

    const doc = {
      id,
      parentId: parentId || null,
      type,
      name,
      isPublic: !!isPublic,
      displayName: displayName || undefined,
      code: code || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const ref = col.doc(id);
    batch.set(ref, doc);
    written++;

    if (written % BATCH_SIZE === 0) {
      batches.push(batch);
      batch = db.batch();
    }
  }

  if (written % BATCH_SIZE !== 0) batches.push(batch);

  if (dryRun) {
    console.log('Would write', written, 'documents to', COLLECTION);
    process.exit(0);
  }

  (async () => {
    for (const b of batches) {
      await b.commit();
    }
    console.log('Imported', written, 'documents to', COLLECTION);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
