# Email Notification System Setup Guide

This guide will help you set up the email notification system for your Ndigbo Viva blog using Mailchimp.

## Prerequisites

- Mailchimp account
- Domain email address (for sending emails)

## 1. Mailchimp Setup

### Step 1: Get Your API Key
1. Log in to your Mailchimp account
2. Go to Account → Extras → API Keys
3. Create a new API key
4. Copy the API key

### Step 2: Get Your Server Prefix
1. In your API key section, you'll see something like `us1`, `us2`, etc.
2. This is your server prefix

### Step 3: Get Your List ID
1. Go to Audience → All contacts
2. Click on Settings → Audience name and defaults
3. Copy the Audience ID (this is your List ID)

## 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_list_id_here
```

## 3. Domain Setup (Recommended)

For better email deliverability, set up a custom domain:

1. In Mailchimp, go to Account → Settings → Domains
2. Add your domain (e.g., `ndigboviva.com`)
3. Follow the DNS setup instructions
4. Update the email addresses in the code:
   - `welcome@ndigboviva.com` for welcome emails
   - `blog@ndigboviva.com` for blog notifications

## 4. Features Included

### ✅ Welcome Emails
- Automatically sent when users register
- Beautiful HTML template with branding
- Includes links to blog and YouTube channel

### ✅ Blog Post Notifications
- Admin interface at `/admin/email`
- Send notifications to all subscribers
- Includes post title, excerpt, and links
- Optional YouTube video integration

### ✅ Email Preferences
- Users can manage notification preferences in their profile
- Toggle different types of notifications
- Respects user preferences

### ✅ Subscriber Management
- View subscriber count in admin interface
- Integrates with existing Mailchimp list
- Automatic subscription through newsletter signup

## 5. Usage

### Sending Blog Post Notifications
1. Go to `/admin/email` (requires authentication)
2. Fill in the blog post details:
   - Title (required)
   - Excerpt (required)
   - URL slug (required)
   - YouTube video ID (optional)
   - Thumbnail URL (optional)
3. Click "Send Notification"
4. All subscribers will receive the email

### Managing User Preferences
- Users can access their profile to manage email preferences
- Options include:
  - Blog post notifications
  - Welcome emails
  - Weekly digest
  - Community updates

## 6. Email Templates

### Welcome Email Features:
- Ndigbo Viva branding
- Welcome message with user's name
- Links to blog and YouTube channel
- Community information
- Unsubscribe link

### Blog Post Email Features:
- Post title and excerpt
- Thumbnail image (if provided)
- Direct link to blog post
- YouTube video link (if provided)
- Social sharing encouragement
- Unsubscribe link

## 7. Troubleshooting

### Common Issues:

1. **"Mailchimp list ID not configured"**
   - Check your `MAILCHIMP_LIST_ID` environment variable
   - Ensure the list ID is correct

2. **"Failed to send email"**
   - Verify your API key is correct
   - Check your server prefix
   - Ensure your domain is verified in Mailchimp

3. **Emails not reaching inbox**
   - Check spam folder
   - Verify domain authentication
   - Consider warming up your domain

### Testing:
1. Create a test account to verify welcome emails
2. Use the admin interface to send test blog notifications
3. Check Mailchimp dashboard for campaign status

## 8. Advanced Configuration

### Custom Email Templates:
- Modify templates in `src/lib/email.ts`
- Update HTML and styling as needed
- Test changes with small batches first

### Segmentation:
- Use Mailchimp tags to segment subscribers
- Send targeted emails to specific groups
- Implement preference-based segmentation

### Analytics:
- Monitor email open rates in Mailchimp
- Track click-through rates
- Analyze subscriber engagement

## 9. Security Notes

- Keep your API keys secure
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor for unusual activity

## 10. Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Test with a small subscriber list first
4. Check Mailchimp documentation for API changes

---

**Next Steps:**
1. Set up your Mailchimp account and get the required credentials
2. Add the environment variables to your `.env.local` file
3. Test the welcome email by creating a new account
4. Use the admin interface to send your first blog post notification
