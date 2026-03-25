# Production (Vercel) – Why Approve Works on Localhost But Not in Prod

## Why it works locally but not on production

- **Localhost** reads env from `.env.local`. Your Firebase Admin vars are there, so the approve API finds submissions in Firestore.
- **Production (Vercel)** does **not** use `.env.local`. It only uses environment variables you set in the **Vercel dashboard**. If those aren’t set, the approve API uses wrong/missing config and can’t find submissions (you get “Submission not found” / 404).

So you need the **same** server-side Firebase vars in Vercel that you have in `.env.local`.

---

## Fix: Set these in Vercel

1. Open [Vercel Dashboard](https://vercel.com) → your **ndigbo-viva** project.
2. Go to **Settings** → **Environment Variables**.
3. For **Production** (and optionally Preview), add:

| Name | Value | Notes |
|------|--------|--------|
| `FIREBASE_PROJECT_ID` | `great-igbo-ancestry-project` | Must match your Firebase project. |
| `FIREBASE_FIRESTORE_DATABASE_ID` | `igbo-genealogy-db` | Must match the DB used by the client (see `src/lib/firebase.ts`). |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@great-igbo-ancestry-project.iam.gserviceaccount.com` | From your Firebase service account JSON. |
| `FIREBASE_PRIVATE_KEY` | Your full private key | Copy from service account JSON; include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. Use one line with `\n` for newlines, or paste multiline (Vercel supports it). |

4. **Redeploy**  
   **Deployments** → **⋯** on latest deployment → **Redeploy**. Env changes only apply after a new deployment.

5. Try **Approve** again on **https://www.ndigboviva.com**. It should work.

---

## Copying values from `.env.local`

You can copy the same values from your local file (except never commit `.env.local` or share it):

- `FIREBASE_PROJECT_ID` → same as in `.env.local`
- `FIREBASE_FIRESTORE_DATABASE_ID` → same as in `.env.local`
- `FIREBASE_CLIENT_EMAIL` → same as in `.env.local`
- `FIREBASE_PRIVATE_KEY` → same as in `.env.local` (full key; Vercel accepts multiline or `\n`)

---

## Quick check after redeploy

In Vercel **Logs** (or **Runtime Logs**), when you click Approve you should see something like:

```text
[approve] Looking up submission { submissionId: 'SUB...', projectId: 'great-igbo-ancestry-project', databaseId: 'igbo-genealogy-db' }
```

If you still get “Submission not found”, look for:

```text
[approve] Submission not found { submissionId: '...', projectId: '...', databaseId: '...' }
```

Compare `projectId` and `databaseId` with the values above; they must match.
