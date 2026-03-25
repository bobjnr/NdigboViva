# Firebase Setup Summary - Identity Documents Upload

## ✅ What Has Been Done

### 1. Files Created
- ✅ `storage.rules` - Firebase Storage security rules
- ✅ `firebase.json` - Firebase configuration file
- ✅ `FIREBASE_SETUP_GUIDE.md` - Comprehensive setup guide
- ✅ `deploy-firebase.ps1` - Automated deployment script

### 2. Code Changes
- ✅ Updated `person-schema.ts` with 9 new document URL fields
- ✅ Updated `GenealogyForm.tsx` with file upload UI
- ✅ Updated `firebase.ts` to export Storage service
- ✅ Added upload handler with progress tracking

### 3. Environment Verification
- ✅ `.env.local` already has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` configured
- ✅ Firebase project: `great-igbo-ancestry-project`

---

## 🚀 Quick Start - Deploy Now

### Option 1: Using the PowerShell Script (Recommended)
```powershell
.\deploy-firebase.ps1
```

### Option 2: Manual Deployment
```bash
# Login to Firebase
firebase login

# Deploy Storage and Firestore rules
firebase deploy --only storage,firestore:rules
```

---

## 📋 What You Need to Do

### Step 1: Enable Firebase Storage (One-time setup)
1. Go to [Firebase Console](https://console.firebase.google.com/project/great-igbo-ancestry-project)
2. Click **Build** → **Storage**
3. Click **Get Started**
4. Choose **Start in production mode**
5. Select your storage location (e.g., `us-central1`)
6. Click **Done**

### Step 2: Deploy Firebase Rules
Run the deployment script:
```powershell
.\deploy-firebase.ps1
```

Or manually:
```bash
firebase deploy --only storage,firestore:rules
```

### Step 3: Test the Feature
1. Your dev server is already running (`npm run dev`)
2. Navigate to the genealogy form
3. Scroll to "Documentation & Sources" section
4. Try uploading a test document
5. Verify the upload works and shows "Uploaded" status

---

## 🔒 Security Features

### Storage Rules
- ✅ Only authenticated users can upload
- ✅ Maximum file size: 10MB
- ✅ Only images and PDFs allowed
- ✅ Files stored in `identity-documents/` folder

### Firestore Rules
- ✅ Submissions require consent
- ✅ Only admins can approve/reject
- ✅ Document URLs are optional fields

---

## 📁 Data Structure

### New Optional Fields Added:
1. `birthCertificateUrl` - Birth Certificate
2. `ninUrl` - National Identification Number
3. `nationalIdentityCardUrl` - National Identity Card
4. `internationalPassportUrl` - International Passport
5. `personalBankAccountUrl` - Bank Account Statement
6. `votersCardUrl` - Voter's Card
7. `driversLicenseUrl` - Driver's License
8. `taxIdentificationNumberUrl` - Tax ID Number
9. `bvnUrl` - Bank Verification Number

### How It Works:
1. User uploads file → Stored in Firebase Storage
2. Download URL generated → Saved in form state
3. Form submitted → URL saved in Firestore `submissions` collection
4. Admin approves → Data copied to `people` collection
5. Document URLs remain accessible via permanent links

---

## 🧪 Testing Checklist

- [ ] Firebase Storage enabled in console
- [ ] Storage rules deployed
- [ ] Firestore rules deployed
- [ ] Upload a test image (< 10MB)
- [ ] Upload a test PDF (< 10MB)
- [ ] Verify "Uploaded" status appears
- [ ] Click "View" link to verify file is accessible
- [ ] Submit form and check Firestore for URLs
- [ ] Admin approval preserves document URLs

---

## 🔍 Verification Commands

### Check if Firebase is initialized:
```bash
firebase projects:list
```

### View current Storage rules:
```bash
firebase deploy --only storage --dry-run
```

### View current Firestore rules:
```bash
firebase deploy --only firestore:rules --dry-run
```

---

## 📊 Monitoring

### Firebase Console Links:
- **Storage**: https://console.firebase.google.com/project/great-igbo-ancestry-project/storage
- **Firestore**: https://console.firebase.google.com/project/great-igbo-ancestry-project/firestore
- **Rules**: https://console.firebase.google.com/project/great-igbo-ancestry-project/storage/rules

### Check Uploads:
1. Go to Storage in Firebase Console
2. Navigate to `identity-documents/` folder
3. View uploaded files with timestamps

---

## ⚠️ Important Notes

1. **No Database Migration Needed**: Firestore is schema-less, new fields are automatically supported
2. **Existing Records Unaffected**: Old submissions without documents continue to work
3. **Optional Fields**: All document uploads are optional, users can skip them
4. **Authentication Required**: Users must be logged in to upload (currently not enforced in form, but enforced by Storage rules)

---

## 🐛 Troubleshooting

### "Permission Denied" Error
- **Cause**: Storage rules not deployed or user not authenticated
- **Fix**: Run `firebase deploy --only storage`

### Upload Succeeds but URL Not Saved
- **Cause**: State update issue in form
- **Fix**: Check browser console for errors

### "Storage Bucket Not Configured"
- **Cause**: Missing environment variable
- **Fix**: Verify `.env.local` has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Note**: Restart dev server after adding env variables

---

## 📞 Support

If you encounter issues:
1. Check `FIREBASE_SETUP_GUIDE.md` for detailed troubleshooting
2. Review browser console for error messages
3. Check Firebase Console → Storage → Rules tab
4. Verify authentication is working

---

## ✨ Next Steps After Deployment

1. **Test in Development**: Upload test documents
2. **Monitor Storage Usage**: Check Firebase Console
3. **Test Full Flow**: Submit form → Admin approve → Verify URLs persist
4. **Production Deploy**: Push to Vercel after testing
5. **Set Up Alerts**: Configure storage quota alerts in Firebase

---

## 🎯 Success Criteria

You'll know everything is working when:
- ✅ You can upload a document in the form
- ✅ Upload progress shows (0% → 100%)
- ✅ "Uploaded" status appears with "View" link
- ✅ Clicking "View" opens the document in new tab
- ✅ Form submission includes document URLs
- ✅ Files appear in Firebase Console → Storage
- ✅ Admin approval preserves document URLs in person record
