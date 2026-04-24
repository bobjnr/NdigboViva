import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from './auth-config';

export type AdminSessionResult =
  | { ok: true; session: Session; email: string }
  | { ok: false; status: 401 | 403; message: string };

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getAdminEmails();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export async function requireAdminSession(): Promise<AdminSessionResult> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();

  if (!session || !email) {
    return { ok: false, status: 401, message: 'Authentication required.' };
  }

  if (!isAdminEmail(email)) {
    return { ok: false, status: 403, message: 'Admin access is required.' };
  }

  return { ok: true, session, email };
}
