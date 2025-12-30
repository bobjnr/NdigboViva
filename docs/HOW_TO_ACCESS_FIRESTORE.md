# How to Access Firestore Database (For Team Members)

## 🔐 Access Methods

Once someone is added as an Owner (or Editor/Viewer), they can access the Firestore database in **two ways**:

1. **Firebase Console** (Web interface) - For viewing/managing data
2. **Through your application** - For end users

---

## 🌐 Method 1: Firebase Console (For Database Management)

### Step-by-Step Access Guide

#### Step 1: Accept the Invitation

1. The new Owner will receive an **email invitation** from Firebase
2. Email subject: "You've been invited to collaborate on [Project Name]"
3. Click **"Accept invitation"** in the email
4. They'll be redirected to Firebase Console
5. If they don't have a Google account, they'll need to create one

#### Step 2: Log into Firebase Console

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sign in with the **same Google account** that received the invitation
3. They'll see your project in their project list

#### Step 3: Access Firestore Database

1. Click on your **project name**
2. In the left sidebar, click **"Firestore Database"**
3. They'll see:
   - All collections (`persons`, `users`, `subscribers`)
   - All documents in each collection
   - Ability to view, edit, add, and delete data

---

## 📊 What They Can See and Do in Firebase Console

### As an Owner, they can:

#### View Data
- ✅ See all collections and documents
- ✅ View individual person records
- ✅ Search and filter data
- ✅ Export data

#### Modify Data
- ✅ Add new person records manually
- ✅ Edit existing records
- ✅ Delete records
- ✅ Modify collections structure

#### Manage Security
- ✅ View and edit Firestore security rules
- ✅ Modify authentication settings
- ✅ Change project settings

#### Manage Team
- ✅ Add/remove team members
- ✅ Change member roles
- ✅ Manage billing (if applicable)

---

## 🖥️ What the Firebase Console Looks Like

### Firestore Database View:

```
┌─────────────────────────────────────────┐
│  Firestore Database                     │
├─────────────────────────────────────────┤
│                                         │
│  Collections:                           │
│  ┌─────────────┐                        │
│  │ persons     │  (123 documents)      │
│  │ users       │  (45 documents)        │
│  │ subscribers │  (200 documents)       │
│  └─────────────┘                        │
│                                         │
│  [Click on "persons" to see all records]│
└─────────────────────────────────────────┘
```

### Viewing a Person Record:

When they click on `persons` collection, they'll see:
- List of all person records
- Each record shows: Person ID, Name, and other fields
- Click any record to see full details
- Can edit directly in the console

---

## 🔧 Method 2: Through Your Application

### For End Users (Not Firebase Console)

Users can also access data through your website:

1. **Search for persons**: `/genealogy/search`
2. **View person details**: `/genealogy/person/[personId]`
3. **View family trees**: `/genealogy/tree/[personId]`

This is controlled by:
- **Firestore Security Rules** (what data they can see)
- **Your application code** (how data is displayed)

---

## 📝 Step-by-Step: First Time Access

### For the New Owner:

1. **Check Email**
   - Look for invitation from Firebase
   - Subject: "You've been invited to collaborate..."

2. **Accept Invitation**
   - Click "Accept invitation" link
   - Sign in with Google account
   - If no Google account, create one first

3. **Access Firebase Console**
   - Go to https://console.firebase.google.com/
   - Sign in with same Google account
   - Your project will appear in the list

4. **Open Firestore**
   - Click on project name
   - Click "Firestore Database" in left sidebar
   - You're now viewing the database!

5. **Explore Collections**
   - Click on `persons` collection
   - See all person records
   - Click any record to view/edit

---

## 🎯 What They Can Do with Each Role

### **Owner** (Full Access)
- ✅ View all data
- ✅ Add/edit/delete records
- ✅ Modify security rules
- ✅ Add/remove team members
- ✅ Manage billing
- ✅ Delete project

### **Editor** (Data Management)
- ✅ View all data
- ✅ Add/edit/delete records
- ✅ Modify security rules
- ❌ Cannot manage team
- ❌ Cannot manage billing
- ❌ Cannot delete project

### **Viewer** (Read-Only)
- ✅ View all data
- ❌ Cannot make any changes
- ❌ Cannot modify rules
- ❌ Cannot manage team

---

## 🔍 Finding Specific Data

### Search in Firebase Console:

1. **By Collection**: Click collection name (e.g., `persons`)
2. **By Document ID**: Use search bar at top
3. **Filter**: Use query builder to filter by fields
4. **Export**: Click "Export" to download data

### Example: Finding a Specific Person

1. Go to Firestore Database
2. Click `persons` collection
3. Scroll or search for Person ID
4. Click on the document to view full details

---

## 📱 Mobile Access

Firebase Console is also accessible on mobile:
- Works in mobile browser
- Same features as desktop
- Can view and edit data on the go

---

## 🔐 Security Notes

### Important:
- **Console access** = Full database access (for that role)
- **App access** = Limited by security rules
- **Two different things**:
  - Console: Direct database management
  - App: User-facing interface with restrictions

### Best Practices:
- Only give Owner role to trusted people
- Use Editor for data entry assistants
- Use Viewer for people who just need to see data
- Regularly review who has access

---

## 🆘 Troubleshooting

### "I don't see the project"
- Check if invitation was accepted
- Make sure you're signed in with correct Google account
- Check spam folder for invitation email

### "I can't edit data"
- Check your role (Viewer can't edit)
- Ask project owner to upgrade your role

### "I can't see Firestore Database"
- Make sure Firestore is enabled in the project
- Check if you have the right permissions
- Contact project owner

---

## 📞 Quick Reference

**Console URL**: https://console.firebase.google.com/

**Steps to Access**:
1. Accept email invitation
2. Sign in to Firebase Console
3. Click project name
4. Click "Firestore Database"
5. Click collection (e.g., `persons`)
6. View/edit records

**What They'll See**:
- All collections
- All documents
- Full record details
- Ability to edit (depending on role)

---

**Last Updated**: 2024


