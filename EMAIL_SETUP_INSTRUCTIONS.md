# Email Setup Instructions for Ndigbo Viva Blog

## Overview
Your website now has integrated email functionality using **Resend** (FREE - 3,000 emails/month) and user data storage using **Firebase Firestore**.

## What's Been Implemented

### 1. User Registration & Data Storage
- ✅ Users can sign up with email and password
- ✅ User data is automatically saved to Firebase Firestore in the `users` collection
- ✅ User information includes: email, display name, preferences, and timestamps
- ✅ Users can log in using their registered credentials

### 2. Email Functionality
- ✅ Welcome emails are automatically sent when users sign up
- ✅ Uses Resend API (FREE tier: 3,000 emails/month)
- ✅ Custom welcome email template with your branding
- ✅ Email preferences stored in Firestore

### 3. Data Storage
- ✅ User data stored in Firestore `users` collection
- ✅ Subscriber data stored in Firestore `subscribers` collection
- ✅ All data persists across server restarts

## Setup Steps

### Step 1: Get Your Resend API Key (FREE)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (no credit card required)
3. Navigate to **API Keys** in your dashboard
4. Create a new API key
5. Copy the API key

### Step 2: Configure Environment Variables

Add the following to your `.env.local` file (or your deployment environment variables):

```env
# Resend Email Configuration (FREE - 3,000 emails/month)
RESEND_API_KEY=your_resend_api_key_here

# Firebase Configuration (you should already have these)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Set Up Firebase Firestore Security Rules

In your Firebase Console, go to Firestore Database → Rules and add:

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
  }
}
```

### Step 4: Verify Domain (Optional but Recommended)

For production, you should verify your domain in Resend:
1. Go to Resend Dashboard → Domains
2. Add your domain
3. Add the DNS records provided
4. Wait for verification

**Note:** Until you verify a domain, emails will be sent from `onboarding@resend.dev`. This works fine for testing and the free tier.

## How It Works

### User Registration Flow

1. User fills out registration form at `/auth/register`
2. Account is created in Firebase Authentication
3. User data is saved to Firestore `users` collection
4. User is added to `subscribers` collection
5. Welcome email is automatically sent via Resend
6. User is redirected to home page

### User Login Flow

1. User enters email and password at `/auth/login`
2. Firebase Authentication verifies credentials
3. User data is retrieved from Firestore
4. User is logged in and redirected to profile page

### Email Sending

- Welcome emails are sent automatically on signup
- Uses Resend's REST API (no additional dependencies)
- Email template includes your branding and links
- Emails are sent asynchronously (won't block registration)

## Testing

### Test User Registration
1. Go to `/auth/register`
2. Fill out the form
3. Check your email for the welcome message
4. Check Firebase Console → Firestore to see the user data

### Test Email Sending
You can test the email functionality by:
1. Visiting `/api/test-email` (if available)
2. Or manually calling `/api/email/welcome` with POST request

## Data Storage Locations

### Firestore Collections

**`users` Collection:**
- Document ID: User's UID
- Fields: `uid`, `email`, `displayName`, `createdAt`, `updatedAt`, `blogNotifications`, `welcomeEmails`

**`subscribers` Collection:**
- Document ID: User's email
- Fields: `email`, `name`, `blogNotifications`, `welcomeEmails`, `subscribedAt`, `updatedAt`

## Free Tier Limits

- **Resend**: 3,000 emails/month (FREE)
- **Firebase**: Generous free tier for Firestore (50,000 reads/day, 20,000 writes/day)

## Troubleshooting

### Emails Not Sending
1. Check that `RESEND_API_KEY` is set correctly
2. Check Resend dashboard for any errors
3. Check server logs for error messages
4. Verify email address is valid

### User Data Not Saving
1. Check Firebase configuration in environment variables
2. Verify Firestore security rules allow writes
3. Check browser console for errors
4. Verify Firebase project is active

### Login Issues
1. Verify user exists in Firebase Authentication
2. Check that email/password are correct
3. Check Firebase Auth configuration

## Next Steps

1. Set up your Resend API key
2. Test user registration
3. Verify emails are being sent
4. Check Firestore to see stored user data
5. (Optional) Verify your domain in Resend for production

## Support

If you encounter any issues:
1. Check the browser console for client-side errors
2. Check server logs for API errors
3. Verify all environment variables are set correctly
4. Ensure Firebase and Resend accounts are active

---

**Note:** The email system uses Resend's free tier which is perfect for getting started. As your user base grows, you can upgrade to a paid plan or switch to another email service if needed.

