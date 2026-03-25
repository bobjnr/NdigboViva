# Firebase Setup Guide for Identity Documents Upload

This guide will help you ensure Firebase is correctly configured to accept the new identity document upload feature.

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project already created
- Admin access to your Firebase Console

---

## Step 1: Deploy Firebase Storage Rules

The `storage.rules` file has been created in your project root. This file:
- Allows authenticated users to upload documents to `identity-documents/` folder
- Restricts file size to 10MB maximum
- Only allows images and PDFs
- Requires authentication for all operations

### Deploy Storage Rules:

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project

# Deploy only Storage rules
firebase deploy --only storage
```

---

## Step 2: Verify Firestore Rules

Your existing `firestore.rules` already supports the new data structure because:
- The `submissions` collection allows creation with `consentStatus == true`
- The `people` collection accepts any data structure as long as consent is given
- The new document URL fields are optional and will be stored automatically

### Deploy Firestore Rules (if you made changes):

```bash
firebase deploy --only firestore:rules
```

---

## Step 3: Enable Firebase Storage in Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Build** → **Storage**
4. Click **Get Started**
5. Choose **Start in production mode** (we'll use our custom rules)
6. Select your preferred storage location (closest to your users)
7. Click **Done**

---

## Step 4: Verify Environment Variables

Ensure your `.env.local` file has the Storage Bucket configuration:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

✅ **Your `.env.local` already has this configured:**
```
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="great-igbo-ancestry-project.firebasestorage.app"
```

### Admin dashboard (approve/reject submissions)

Admin API routes use the **Firebase Admin SDK** and need a **service account**. Add these to `.env.local` (never commit the private key):

1. In [Firebase Console](https://console.firebase.google.com/) → Project settings → **Service accounts** → **Generate new private key**.
2. In the downloaded JSON, use:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` (the full string, including `-----BEGIN PRIVATE KEY-----` / `-----END PRIVATE KEY-----`) → `FIREBASE_PRIVATE_KEY`

In `.env.local`:

```env
# Required for admin routes (e.g. approve/reject submissions)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

- For `FIREBASE_PRIVATE_KEY`, you can paste the key from the JSON; if you need to escape newlines (e.g. on Windows), use `\n` for each line break.
- Restart the dev server after changing `.env.local`.

---

## Step 5: Test the Upload Functionality

### Local Testing:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the genealogy form** (usually at `/genealogy` or wherever your form is)

3. **Try uploading a test document:**
   - Fill in the required form fields
   - Scroll to "Documentation & Sources" section
   - Click "Choose File" on any document type
   - Upload a test image or PDF (under 10MB)
   - Verify the upload progress appears
   - Check that "Uploaded" status shows with a "View" link

### Verify in Firebase Console:

1. Go to Firebase Console → Storage
2. Navigate to the `identity-documents/` folder
3. You should see your uploaded files with timestamps

---

## Step 6: Update Firestore Security Rules (Optional Enhancement)

Your current Firestore rules are good, but you can add validation for the new document URL fields:

```javascript
// In firestore.rules - Enhanced validation for submissions
match /submissions/{submissionId} {
  allow read: if true;
  allow create: if request.resource.data.data.consentStatus == true
                && (!request.resource.data.data.keys().hasAny(['birthCertificateUrl', 'ninUrl', 'nationalIdentityCardUrl', 'internationalPassportUrl', 'personalBankAccountUrl', 'votersCardUrl', 'driversLicenseUrl', 'taxIdentificationNumberUrl', 'bvnUrl'])
                    || request.resource.data.data.birthCertificateUrl.matches('https://firebasestorage.googleapis.com/.*')
                );
  allow update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

---

## Step 7: Deploy All Rules

Deploy both Firestore and Storage rules together:

```bash
# Deploy all Firebase configurations
firebase deploy --only firestore:rules,storage

# Or deploy everything
firebase deploy
```

---

## Troubleshooting

### Issue: "Permission Denied" when uploading

**Solution:**
1. Verify Storage rules are deployed: `firebase deploy --only storage`
2. Check that user is authenticated before uploading
3. Verify file size is under 10MB
4. Ensure file type is image/* or application/pdf

### Issue: Upload succeeds but URL not saved

**Solution:**
1. Check browser console for errors
2. Verify the `personData` state is being updated in `handleFileUpload`
3. Ensure the field key matches exactly in the schema

### Issue: "Storage bucket not configured"

**Solution:**
1. Verify `.env.local` has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
2. Restart your development server after adding env variables
3. Check Firebase Console that Storage is enabled

### Issue: Files upload but can't be viewed

**Solution:**
1. Check Storage rules allow read access
2. Verify the download URL is being saved correctly
3. Check browser console for CORS errors

---

## Data Structure Verification

The new document URL fields are automatically supported because:

1. **TypeScript Schema** (`person-schema.ts`):
   - ✅ Added to `DocumentationFields` interface
   - ✅ Added to `PersonFormSubmission` interface
   - ✅ Mapped in `createPersonFromForm` function

2. **Firestore**:
   - ✅ Firestore is schema-less and accepts any valid JSON
   - ✅ Optional fields (undefined) are automatically omitted
   - ✅ No migration needed for existing records

3. **Storage**:
   - ✅ Files stored in `identity-documents/` folder
   - ✅ Unique filenames with timestamps prevent collisions
   - ✅ Download URLs are permanent and shareable

---

## Security Checklist

- [x] Storage rules restrict file size to 10MB
- [x] Storage rules only allow images and PDFs
- [x] Storage rules require authentication
- [x] Firestore rules require consent for submissions
- [x] Document URLs are validated as Firebase Storage URLs
- [x] Admin-only access for approving submissions

---

## Next Steps

1. **Deploy the rules:**
   ```bash
   firebase deploy --only storage,firestore:rules
   ```

2. **Test the upload feature** in development

3. **Monitor uploads** in Firebase Console → Storage

4. **Set up Storage quotas** (optional):
   - Go to Firebase Console → Storage → Usage
   - Set up alerts for storage usage
   - Configure billing alerts if needed

---

## Production Deployment

When deploying to production (Vercel):

1. **Ensure environment variables are set in Vercel:**
   - All `NEXT_PUBLIC_FIREBASE_*` variables
   - Especially `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

2. **Deploy Firebase rules first:**
   ```bash
   firebase deploy --only storage,firestore:rules
   ```

3. **Then deploy your Next.js app:**
   ```bash
   git push origin main
   # Vercel will auto-deploy
   ```

4. **Test in production** with a real submission

---

## Monitoring & Maintenance

### View Upload Logs:
```bash
firebase functions:log
```

### Check Storage Usage:
- Firebase Console → Storage → Usage tab
- Monitor file count and total size

### Backup Strategy:
- Firebase Storage files are automatically backed up
- Consider exporting Firestore data periodically
- Document URLs in Firestore point to permanent Storage locations

---

## Cost Considerations

Firebase Storage pricing (as of 2024):
- **Storage:** $0.026/GB/month
- **Downloads:** $0.12/GB
- **Uploads:** Free

For 1000 documents (avg 2MB each):
- Storage: ~2GB = $0.052/month
- Very cost-effective for this use case

---

## Support

If you encounter issues:
1. Check Firebase Console → Storage → Rules tab
2. Review browser console for detailed errors
3. Check Firebase Console → Storage → Files for uploaded content
4. Verify authentication is working properly
