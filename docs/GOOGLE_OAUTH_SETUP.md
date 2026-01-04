# Google OAuth Setup Guide

## Understanding Google Cloud Console Settings

### 1. Authorized JavaScript Origins

**What it is:**
- These are the domains/URLs where your JavaScript code can make OAuth requests FROM
- Think of it as "where is your website hosted?"
- This is where users START the sign-in process

**What to add:**
- Your website's base URL (where your Next.js app is hosted)
- **Development:** `http://localhost:3000`
- **Production:** `https://www.ndigboviva.com.ng` (or your actual domain)

**Important:**
- Must include the protocol (`http://` or `https://`)
- Must NOT include trailing slashes
- Must NOT include paths (just the domain and port if needed)

### 2. Authorized Redirect URIs

**What it is:**
- These are the URLs where Google will SEND users BACK TO after they authenticate
- This is where NextAuth receives the OAuth callback
- This is the callback endpoint

**What to add:**
- Your NextAuth callback URL
- **Development:** `http://localhost:3000/api/auth/callback/google`
- **Production:** `https://www.ndigboviva.com.ng/api/auth/callback/google`

**Important:**
- Must match EXACTLY (including http/https, www, domain, path)
- This is where Google redirects users after they approve the sign-in

## Step-by-Step Setup

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**

### Step 2: Configure OAuth 2.0 Client

1. Find your OAuth 2.0 Client ID (or create one)
2. Click **Edit** (pencil icon)

### Step 3: Add Authorized JavaScript Origins

In the **Authorized JavaScript origins** section, click **+ ADD URI** and add:

**For Development:**
```
http://localhost:3000
```

**For Production:**
```
https://www.ndigboviva.com.ng
```

**Note:** If you have multiple environments, add both:
- `http://localhost:3000` (for local development)
- `https://www.ndigboviva.com.ng` (for production)

### Step 4: Add Authorized Redirect URIs

In the **Authorized redirect URIs** section, click **+ ADD URI** and add:

**For Development:**
```
http://localhost:3000/api/auth/callback/google
```

**For Production:**
```
https://www.ndigboviva.com.ng/api/auth/callback/google
```

**Note:** Add both if you're testing in multiple environments.

### Step 5: Save Changes

1. Click **SAVE** at the bottom
2. Wait a few seconds for changes to propagate (can take up to 5 minutes)

## Complete Example Configuration

### Authorized JavaScript origins:
```
http://localhost:3000
https://www.ndigboviva.com.ng
```

### Authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://www.ndigboviva.com.ng/api/auth/callback/google
```

## Common Mistakes to Avoid

1. ❌ **Trailing slashes:** `https://www.ndigboviva.com.ng/` (WRONG)
   ✅ **Correct:** `https://www.ndigboviva.com.ng`

2. ❌ **Wrong protocol:** Using `http://` in production (WRONG)
   ✅ **Correct:** Use `https://` in production

3. ❌ **Missing paths in redirect URI:** `https://www.ndigboviva.com.ng` (WRONG for redirect)
   ✅ **Correct:** `https://www.ndigboviva.com.ng/api/auth/callback/google`

4. ❌ **Mismatched domains:** Using `ndigboviva.com.ng` in one place and `www.ndigboviva.com.ng` in another
   ✅ **Correct:** Use the SAME domain everywhere (preferably with `www`)

## Verify Your Configuration

After saving, test the sign-in flow:

1. Go to your website
2. Click "Sign in with Google"
3. Select your Google account
4. You should be redirected back to your website (not the sign-in page)

## Troubleshooting

### "redirect_uri_mismatch" Error

This means your redirect URI doesn't match what's in Google Cloud Console.

**Fix:**
1. Check your `NEXTAUTH_URL` environment variable
2. Make sure it matches what you put in "Authorized JavaScript origins"
3. Make sure the redirect URI in Google Console is: `{NEXTAUTH_URL}/api/auth/callback/google`

### Still Redirecting to Sign-In Page

1. Clear browser cookies/cache
2. Wait 5 minutes after changing Google Console settings
3. Check browser console for errors
4. Verify `NEXTAUTH_URL` matches your actual domain

## Environment Variables Checklist

Make sure these are set in your `.env.local` (development) and Vercel (production):

```env
NEXTAUTH_URL=http://localhost:3000  # or https://www.ndigboviva.com.ng
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Check server logs for NextAuth errors
3. Verify all URLs match exactly (no typos, correct protocol, etc.)



