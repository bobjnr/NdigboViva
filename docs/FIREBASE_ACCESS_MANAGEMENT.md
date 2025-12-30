# Firebase Project Access Management Guide

## 🔐 Who Controls the Firestore Database?

The **Firebase project owner** (the person who created the Firebase project) has full control over:
- Firestore database
- Authentication
- Storage
- All Firebase services
- Billing (if applicable)

---

## 👥 Who Has Access?

### Current Access Levels

1. **Project Owner** (You)
   - Full control over everything
   - Can add/remove team members
   - Can change billing settings
   - Can delete the project

2. **Team Members** (if any)
   - Access levels depend on roles you assign
   - Can be given specific permissions

3. **No Public Access**
   - The database is private by default
   - Only people you explicitly grant access to can access it

---

## ➕ How to Give Someone Else Access

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** (⚙️) next to "Project Overview"
4. Select **Users and permissions**

### Step 2: Add Team Member

1. Click **Add member** button
2. Enter their email address
3. Select a **role** (see roles below)
4. Click **Add**

### Step 3: They Receive Invitation

- They'll get an email invitation
- They need to accept it
- Once accepted, they have access based on their role

---

## 🎭 Available Roles & Permissions

### **Owner**
- ✅ Full control (same as you)
- ✅ Can manage billing
- ✅ Can delete project
- ✅ Can add/remove members
- ⚠️ **Use carefully** - gives complete control

### **Editor**
- ✅ Can modify Firestore data
- ✅ Can modify security rules
- ✅ Can manage Firebase services
- ❌ Cannot manage billing
- ❌ Cannot delete project
- ❌ Cannot manage team members

### **Viewer**
- ✅ Can view Firestore data
- ✅ Can view security rules
- ✅ Can view all Firebase services
- ❌ Cannot make any changes
- ✅ **Best for read-only access**

### **Firebase Admin**
- ✅ Can manage Firebase services
- ✅ Can modify Firestore data
- ✅ Can modify security rules
- ❌ Cannot manage billing
- ❌ Cannot manage team members

---

## 🔄 How to Transfer Ownership

### Option 1: Add as Owner (Recommended)

1. Add the person as a team member
2. Assign them the **Owner** role
3. They now have full control
4. You can keep your access or remove yourself

### Option 2: Transfer Project to Different Google Account

1. Go to Firebase Console → Project Settings
2. Scroll to **Your project** section
3. Click **Transfer project**
4. Enter the new owner's email
5. Confirm the transfer

**⚠️ Warning:** This transfers the entire project, including billing. Make sure you trust the recipient.

---

## 📋 Recommended Access Strategy

### For Your Genealogy Project

**Scenario 1: You Want Help Managing Data**
- Add team members as **Editor** or **Firebase Admin**
- They can update records, verify data, manage relationships
- You keep control over billing and project deletion

**Scenario 2: You Want Someone to View Data Only**
- Add them as **Viewer**
- They can see all records but can't modify anything
- Good for researchers, family historians

**Scenario 3: You Want to Share Full Control**
- Add them as **Owner**
- They have complete control
- Use if you're collaborating closely or transferring ownership

---

## 🔒 Security Best Practices

### 1. **Principle of Least Privilege**
- Only give the minimum access needed
- Start with **Viewer**, upgrade if needed

### 2. **Regular Access Reviews**
- Periodically review who has access
- Remove access for people who no longer need it

### 3. **Use Specific Roles**
- Don't make everyone an Owner
- Use Editor/Viewer for most team members

### 4. **Monitor Activity**
- Check Firebase Console → Usage and billing
- Review who's making changes

---

## 🛡️ Firestore Security Rules vs. Firebase Access

### Two Layers of Security:

1. **Firebase Project Access** (What we're discussing)
   - Controls who can access Firebase Console
   - Controls who can modify security rules
   - Controls who can see/manage the database structure

2. **Firestore Security Rules** (Already set up)
   - Controls who can read/write data via your app
   - Controls what data users can see in the application
   - Works at the data level

**Example:**
- **Firebase Editor** can modify security rules in Console
- **Firestore Security Rules** control what app users can do

---

## 📝 Step-by-Step: Adding a Team Member

### Example: Adding a Data Entry Assistant

1. **Go to Firebase Console**
   - https://console.firebase.google.com/
   - Select your project

2. **Navigate to Users and Permissions**
   - Click gear icon (⚙️) → **Users and permissions**

3. **Add Member**
   - Click **Add member**
   - Enter email: `assistant@example.com`
   - Select role: **Editor** (can modify data)
   - Click **Add**

4. **They Receive Email**
   - They get invitation email
   - They click "Accept invitation"
   - They can now access Firebase Console

5. **What They Can Do**
   - View Firestore data
   - Modify records
   - Update security rules
   - Cannot delete project or manage billing

---

## 🔍 How to Check Current Access

1. Go to Firebase Console
2. Click gear icon (⚙️) → **Users and permissions**
3. You'll see list of all team members and their roles

---

## ⚠️ Important Notes

### Billing Responsibility
- **Owner** is responsible for billing
- If you add someone as Owner, they can see billing info
- Free tier (Spark plan) has no billing

### Project Deletion
- Only **Owner** can delete project
- Deletion is permanent and cannot be undone
- Be careful who you make Owner

### Data Ownership
- Data belongs to the Firebase project
- Whoever controls the project controls the data
- Consider data ownership agreements for sensitive genealogy data

---

## 🎯 Common Scenarios

### Scenario 1: "I want my assistant to help enter data"
**Solution:** Add them as **Editor**
- They can add/edit records
- They can't delete project or change billing

### Scenario 2: "I want a family member to view our family tree"
**Solution:** Add them as **Viewer**
- They can see all data
- They can't make changes
- Or just give them access via your app (no Firebase access needed)

### Scenario 3: "I want to transfer the project to someone else"
**Solution:** Add them as **Owner**, then remove yourself
- They get full control
- You can remove your access if desired

### Scenario 4: "I want multiple people to manage the database"
**Solution:** Add them as **Editor** or **Firebase Admin**
- Multiple people can work simultaneously
- All changes are logged

---

## 📞 Need Help?

If you need help with:
- Adding team members
- Understanding roles
- Transferring ownership
- Security concerns

Check Firebase documentation: https://firebase.google.com/docs/projects/iam/overview

---

**Last Updated**: 2024

