# Firestore Security Rules Setup Guide

## 🔥 Quick Fix for Permission Denied Error

The error `PERMISSION_DENIED: Missing or insufficient permissions` means your Firestore security rules are blocking writes. Here's how to fix it:

---

## ✅ Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab

### Step 2: Copy and Paste These Rules

Replace your existing rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Subscribers collection - authenticated users can read, only server can write
    match /subscribers/{email} {
      allow read: if request.auth != null;
      allow write: if false; // Only server-side writes allowed
    }
    
    // Persons collection - genealogy records
    match /persons/{personId} {
      // Allow read: All records are readable (visibility controlled at app level)
      // This allows users to view their own records after creation
      allow read: if true;
      
      // Allow create if:
      // - Consent status is true (required for all records)
      // - This allows anonymous users to create records with consent
      allow create: if request.resource.data.verification.consentStatus == true;
      
      // Allow update if:
      // - User is the creator, OR
      // - User is admin, OR
      // - Record is not locked
      allow update: if (request.auth != null && request.auth.uid == resource.data.verification.createdBy)
                    || (request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
                    || (!resource.data.verification.recordLockDate.exists());
      
      // Allow delete only for admins
      allow delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 3: Publish the Rules

1. Click **Publish** button
2. Wait for confirmation (usually takes a few seconds)

---

## 🧪 Test the Rules

After publishing, try submitting the form again. The error should be resolved.

---

## 🔒 What These Rules Do

### For `persons` Collection:

1. **Read Access:**
   - ✅ **All records are readable** - This allows users to view their records immediately after creation
   - ✅ Visibility filtering (PUBLIC/PARTIAL/PRIVATE) is handled at the application level
   - ✅ This ensures users can always see their own records

2. **Create Access:**
   - ✅ Anyone can create a record IF `consentStatus == true`
   - ✅ This allows anonymous form submissions

3. **Update Access:**
   - ✅ Creator can update their own records
   - ✅ Admins can update any record
   - ✅ Records that aren't locked can be updated

4. **Delete Access:**
   - ✅ Only admins can delete records

---

## 🚨 Temporary Testing Rules (Development Only)

If you need to test quickly and don't want to deal with rules yet, you can use this **TEMPORARY** rule (⚠️ **NOT FOR PRODUCTION**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Allows everything - FOR TESTING ONLY
    }
  }
}
```

**⚠️ WARNING:** This allows anyone to read/write everything. Only use for development/testing. Replace with proper rules before going to production.

---

## 📝 Alternative: Use Firebase Admin SDK (Recommended for Production)

For production, it's better to use Firebase Admin SDK on the server side, which bypasses security rules. This requires:

1. Installing `firebase-admin` package
2. Setting up service account credentials
3. Using Admin SDK in API routes

This is more secure but requires additional setup. The security rules approach above works fine for now.

---

## ✅ Verification

After setting up the rules:

1. ✅ Try submitting the form
2. ✅ Check Firebase Console → Firestore → Data
3. ✅ You should see a new document in the `persons` collection
4. ✅ The document should have your Person ID
5. ✅ Click "View My Record" - it should work now!

---

## 🆘 Still Having Issues?

If you still get permission errors:

1. **Check the rules syntax** - Make sure there are no typos
2. **Verify consentStatus** - Make sure the form is sending `consentStatus: true`
3. **Check Firebase Console** - Look for any error messages in the Rules tab
4. **Clear browser cache** - Sometimes old rules are cached
5. **Wait a few seconds** - Rules can take 10-30 seconds to propagate

---

**Last Updated**: 2024
