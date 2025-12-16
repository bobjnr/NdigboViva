# Google OAuth Verification - Scope Justification & Video Guide

## Scope Justification Text

Copy and paste this into the "Justify the use of the scopes" section:

---

### Justification for YouTube Data API v3 Read-Only Access

**Scope Requested:** `https://www.googleapis.com/auth/youtube.readonly`

**Purpose:**
Our application, Ndigbo Viva, is a genealogy and cultural preservation platform that provides exclusive content to subscribers of our YouTube channel. We use the YouTube Data API v3 read-only scope to verify that users are subscribed to our channel before granting them access to protected genealogy resources.

**How We Use This Data:**
1. **Subscription Verification**: When a user signs in with Google, we check their YouTube subscription status using the `subscriptions.list` endpoint with the `mine=true` parameter to verify they are subscribed to our specific channel (Ndigbo Viva).

2. **Access Control**: Only verified subscribers can access our genealogy project forms and exclusive content. This creates a fair access model that rewards our YouTube community members.

3. **Data Minimization**: We only check subscription status for our specific channel ID. We do NOT:
   - Store any YouTube subscription data
   - Access any other YouTube data beyond subscription status
   - Share subscription information with third parties
   - Use subscription data for any purpose other than access verification

**Why This Scope is Necessary:**
- The `youtube.readonly` scope is the minimum required scope to check a user's subscription status
- We cannot verify YouTube subscriptions without this permission
- This is essential for our business model of providing subscriber-exclusive content

**User Experience:**
- Users are clearly informed during the OAuth consent screen that we need YouTube subscription access
- Users can revoke access at any time through their Google Account settings
- The subscription check happens only when users attempt to access protected content

**Privacy & Security:**
- We do not store YouTube subscription data
- We only use the access token server-side to verify subscription status
- All API calls are made server-side, never exposing tokens to the client
- Subscription status is checked in real-time and not cached

---

## Video Demonstration Script

### Video Requirements Checklist:
- [ ] Show the OAuth consent screen
- [ ] Demonstrate the sign-in flow
- [ ] Show subscription verification working
- [ ] Display all OAuth clients (Web client, if applicable)
- [ ] Show the protected content access
- [ ] Keep video under 5 minutes (recommended)

### Video Script Outline:

#### **Introduction (0:00 - 0:30)**
"Hello, this is a demonstration of how Ndigbo Viva uses YouTube Data API v3 read-only access to verify user subscriptions and provide exclusive access to our genealogy project."

#### **Part 1: OAuth Client Setup (0:30 - 1:00)**
1. Open Google Cloud Console
2. Navigate to: **APIs & Services → Credentials**
3. Show your OAuth 2.0 Client IDs:
   - **Web Client** (for the web application)
   - Point out the Client ID and note it's configured for your domain
4. Navigate to: **APIs & Services → OAuth consent screen**
5. Show the app name, support email, and authorized domains

#### **Part 2: User Sign-In Flow (1:00 - 2:00)**
1. Open your application in a browser (show the URL)
2. Navigate to a page that requires subscription verification
3. Click "Sign in with Google"
4. **IMPORTANT**: Show the OAuth consent screen that appears
   - Point out the requested permissions:
     - "See your email address"
     - "See your profile information"  
     - **"View your YouTube subscriptions"** ← Highlight this one
5. Click "Allow" or "Continue"
6. Show successful sign-in

#### **Part 3: Subscription Verification (2:00 - 3:30)**
1. After sign-in, show the subscription verification process
2. Open browser DevTools (F12) → Network tab
3. Show the API call to `/api/youtube/verify-subscription`
4. Explain: "The app checks if the user is subscribed to our YouTube channel using the YouTube Data API v3 subscriptions endpoint"
5. Show two scenarios:
   - **Scenario A**: User IS subscribed
     - Show the verification success message
     - Show access granted to protected content
   - **Scenario B**: User is NOT subscribed
     - Show the "Subscribe to Channel" prompt
     - Show the subscribe button redirecting to YouTube
     - After subscribing, show the verification working

#### **Part 4: Data Usage Demonstration (3:30 - 4:30)**
1. Show the server-side code (optional, but helpful):
   - Open your code editor
   - Show `src/lib/youtube-auth.ts` or `src/app/api/youtube/verify-subscription/route.ts`
   - Point out that we only use the `subscriptions.list` endpoint
   - Show that we only check for our specific channel ID
2. Show that no subscription data is stored:
   - Open your database/Firestore (if visible)
   - Show that user records don't contain YouTube subscription data
3. Explain: "We only use the subscription status in real-time for access control. No data is stored or shared."

#### **Part 5: User Control & Privacy (4:30 - 5:00)**
1. Show how users can revoke access:
   - Go to: https://myaccount.google.com/permissions
   - Show the app listed
   - Show the "Remove access" option
2. Conclude: "Users have full control over their data and can revoke access at any time."

#### **Closing (5:00 - 5:15)**
"Thank you for reviewing our application. The YouTube read-only scope is essential for our subscription-based access model, and we use it responsibly with minimal data access and strong privacy protections."

---

## What OAuth Clients to Show

### Finding Your OAuth Clients:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services → Credentials**
3. Look for **OAuth 2.0 Client IDs**

### What to Include in Video:
- **Web Client**: This is your main OAuth client for the web application
  - Show the Client ID
  - Show the Authorized JavaScript origins (your domain)
  - Show the Authorized redirect URIs (your callback URLs)

### If You Have Multiple Clients:
- Show ALL OAuth clients that are assigned to this project
- For each client, briefly show:
  - Client type (Web, iOS, Android, etc.)
  - Client ID
  - Where it's used in your app

---

## Video Tips

### Best Practices:
1. **Clear Audio**: Use a good microphone or record in a quiet space
2. **Screen Recording**: Use tools like:
   - OBS Studio (free)
   - Loom (free, easy)
   - QuickTime (Mac)
   - Windows Game Bar (Windows)
3. **Resolution**: Record at least 1080p
4. **Pacing**: Speak clearly and pause between sections
5. **Highlighting**: Use cursor highlighting or zoom in on important parts
6. **Testing**: Record a practice run first

### What NOT to Include:
- ❌ Don't show sensitive credentials (Client Secrets)
- ❌ Don't show actual access tokens
- ❌ Don't include personal information of test users
- ❌ Don't make the video too long (keep it under 5-7 minutes)

### Video Upload:
- Upload to YouTube (unlisted is fine)
- Make sure the video is accessible
- Copy the YouTube URL
- Paste it in the verification form

---

## Additional Notes

### If Google Asks for More Information:
- Be prepared to provide:
  - Privacy Policy URL (required for production)
  - Terms of Service URL (may be required)
  - App screenshots
  - More detailed explanation of data usage

### Privacy Policy Requirements:
Make sure your privacy policy mentions:
- That you use Google OAuth for authentication
- That you check YouTube subscription status
- That you don't store YouTube subscription data
- How users can revoke access

---

## Quick Checklist Before Submitting:

- [ ] Scope justification written and pasted
- [ ] Video recorded showing all required elements
- [ ] All OAuth clients shown in video
- [ ] OAuth consent screen clearly visible
- [ ] Subscription verification demonstrated
- [ ] Video uploaded to YouTube (unlisted is fine)
- [ ] Video URL ready to paste
- [ ] Privacy Policy URL ready (if required)
- [ ] Terms of Service URL ready (if required)

Good luck with your verification! 🚀

