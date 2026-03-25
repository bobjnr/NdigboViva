/**
 * Firebase Admin SDK - for server-side API routes only.
 * Bypasses Firestore security rules (use only in trusted server context).
 */

import { getApps, initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// In production, use the same DB as the client. If submissions are in the default DB, set FIREBASE_FIRESTORE_DATABASE_ID=(default)
const DATABASE_ID = process.env.FIREBASE_FIRESTORE_DATABASE_ID || 'igbo-genealogy-db';

function getAdminApp() {
  const apps = getApps();
  if (apps.length > 0) return apps[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('Firebase project ID is required. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID or FIREBASE_PROJECT_ID.');
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      } as ServiceAccount),
    });
  }

  throw new Error(
    'Firebase Admin credentials are required for admin API routes. ' +
      'In .env.local set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY from your Firebase service account key. ' +
      'See: https://firebase.google.com/docs/admin/setup#initialize-sdk'
  );
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp(), DATABASE_ID);
}
