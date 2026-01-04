# 🔥 Firebase Account Migration Guide

This guide will help you set up your application to use a new Firebase account.

## ✅ What You've Already Done

- ✅ Created a new Firebase project
- ✅ Created the Firestore database

## 📋 Next Steps

### Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **new Firebase project**
3. Click the **gear icon** (⚙️) next to "Project Overview"
4. Select **Project settings**
5. Scroll down to **Your apps** section
6. If you don't have a web app yet:
   - Click **Add app** → Select **Web** (</> icon)
   - Register your app (you can name it anything, e.g., "Ndigbo Viva Blog")
   - Click **Register app**
7. Copy the **Firebase configuration object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 2: Update Your Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add or update these Firebase configuration variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Important:** Replace the values with the ones from your new Firebase project!

### Step 3: Enable Required Firebase Services

In your Firebase Console, make sure these services are enabled:

#### 3.1 Enable Firestore Database
1. Go to **Firestore Database** in the left sidebar
2. If you see "Create database", click it
3. Choose your preferred location (e.g., `us-central1`)
4. Select **Start in production mode** (we'll add security rules next)
5. Click **Enable**

#### 3.2 Enable Authentication
1. Go to **Authentication** in the left sidebar
2. Click **Get started**
3. Enable the sign-in methods you need:
   - **Email/Password** (recommended)
   - **Google** (if you use Google OAuth)
   - Any other providers you need

### Step 4: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Copy and paste the following security rules:

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

3. Click **Publish**

### Step 5: About Collections - You DON'T Need to Create Them!

**Good news:** Firestore collections are created automatically when you first write data to them! You don't need to manually create collections.

Your application will automatically create these collections when needed:
- **`persons`** - Created when someone submits a genealogy record
- **`users`** - Created when a user signs up
- **`subscribers`** - Created when someone subscribes to your newsletter

### Step 6: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test the connection:
   - Try signing up a new user
   - Try submitting a form that writes to Firestore
   - Check Firebase Console → Firestore Database → Data tab
   - You should see your collections appear automatically!

### Step 7: (Optional) Migrate Existing Data

#### Option A: Migrate from Spreadsheet/Excel

If you have data in a spreadsheet (Excel or CSV), see the detailed guide:
- **📊 [Spreadsheet Import Guide](./SPREADSHEET_IMPORT_GUIDE.md)** - Complete instructions for importing Excel/CSV data

Quick steps:
1. Convert Excel to CSV (if needed): `python scripts/combine_sheets.py`
2. Run import script: `npx tsx scripts/import-spreadsheet-to-firebase.ts your-file.csv`

#### Option B: Migrate from Old Firebase Account

If you have data in your old Firebase account:

1. Export data from old Firebase:
   - Go to old Firebase project → Firestore Database
   - Use the Firebase Console to manually copy data, OR
   - Use Firebase CLI: `firebase firestore:export gs://your-bucket/backup`

2. Import to new Firebase:
   - Use Firebase CLI: `firebase firestore:import gs://your-bucket/backup`
   - Or manually recreate the data through your application

## 🔍 Verification Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Authentication enabled with required providers
- [ ] Environment variables updated in `.env.local`
- [ ] Security rules published
- [ ] Development server restarted
- [ ] Tested creating a user/subscriber/person record
- [ ] Verified data appears in Firebase Console

## 🆘 Troubleshooting

### "Firebase configuration is incomplete" error
- Make sure all environment variables in `.env.local` are set
- Restart your development server after updating `.env.local`

### "Permission denied" errors
- Check that security rules are published
- Verify the rules syntax is correct
- Wait a few seconds for rules to propagate

### Collections not appearing
- Collections only appear after the first write operation
- Check Firebase Console → Firestore Database → Data tab
- Make sure your app is writing data successfully

## 📚 Additional Resources

- **📊 [Spreadsheet Import Guide](./SPREADSHEET_IMPORT_GUIDE.md)** - How to import Excel/CSV data
- **📋 [Spreadsheet Template](./SPREADSHEET_TEMPLATE.md)** - Column structure reference
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Setup](https://firebase.google.com/docs/auth)

---

**Last Updated:** 2024

