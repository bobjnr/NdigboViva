# Mailchimp Setup Guide for Email Notifications

## 🚨 IMPORTANT: Required Mailchimp Configuration

For the email system to work, you need to set up several things in Mailchimp:

### 1. **Create an Audience (List)**
1. Go to Mailchimp → Audience → All contacts
2. Click "Create Audience" if you don't have one
3. Fill in your audience details
4. **Copy the Audience ID** (this is your `MAILCHIMP_LIST_ID`)

### 2. **Get Your API Credentials**
1. Go to Account → Extras → API Keys
2. Click "Create A Key"
3. **Copy the API Key** (this is your `MAILCHIMP_API_KEY`)
4. **Note the Server Prefix** (e.g., `us1`, `us2`) - this is your `MAILCHIMP_SERVER_PREFIX`

### 3. **Set Up Domain Authentication (CRITICAL)**
This is likely why emails aren't sending:

1. Go to Account → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `ndigboviva.com`)
4. Follow the DNS setup instructions
5. **This is required for emails to be delivered**

### 4. **Create Merge Fields**
1. Go to Audience → Settings → Audience fields and merge tags
2. Click "Add A Field"
3. Create these fields:
   - `FNAME` (First Name) - Text field
   - `LNAME` (Last Name) - Text field
   - `WELCOME_SENT` (Welcome Sent) - Date field (optional)

### 5. **Set Up Automated Welcome Email (RECOMMENDED)**

#### Option A: Use Mailchimp's Built-in Welcome Email
1. Go to Audience → Settings → Welcome email
2. Enable "Send a welcome email"
3. Customize the template with your branding
4. This will automatically send when someone subscribes

#### Option B: Create a Custom Automation
1. Go to Automate → Email
2. Click "Create" → "Welcome new subscribers"
3. Set up the automation:
   - Trigger: "Someone subscribes to your list"
   - Delay: "Immediately"
   - Audience: Your main list
4. Design your welcome email template
5. **Activate the automation**

### 6. **Environment Variables Setup**

Add these to your `.env.local` file:

```bash
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_audience_id_here
```

### 7. **Test the Setup**

#### Test 1: Check API Connection
```bash
# In your terminal, test the API
curl -X GET "https://us1.api.mailchimp.com/3.0/lists" \
  --user "anystring:YOUR_API_KEY"
```

#### Test 2: Test Welcome Email
1. Create a test account on your website
2. Check if the user appears in your Mailchimp audience
3. Check if they receive the welcome email

#### Test 3: Test Blog Post Notifications
1. Go to `/admin/email`
2. Send a test blog post notification
3. Check if subscribers receive the email

### 8. **Common Issues & Solutions**

#### Issue: "Mailchimp list ID not configured"
**Solution**: Check your `MAILCHIMP_LIST_ID` environment variable

#### Issue: "Failed to send email"
**Solutions**:
- Verify your API key is correct
- Check your server prefix (us1, us2, etc.)
- Ensure your domain is authenticated
- Check if your audience has subscribers

#### Issue: "Emails not reaching inbox"
**Solutions**:
- Check spam folder
- Verify domain authentication is complete
- Ensure your domain has proper DNS records
- Consider warming up your domain with small batches

#### Issue: "User already exists" error
**Solution**: This is normal - the system will tag existing users

### 9. **Alternative: Use Transactional Email Service**

If Mailchimp campaigns aren't working for individual emails, consider using:

#### Option A: Mailchimp Transactional (Mandrill)
1. Enable Mandrill in your Mailchimp account
2. Use Mandrill for individual emails
3. Keep Mailchimp for bulk campaigns

#### Option B: Use Resend or SendGrid
1. Sign up for Resend (resend.com) or SendGrid
2. Update the email service in the code
3. Use for individual welcome emails

### 10. **Recommended Setup for Your Use Case**

For the best results, I recommend:

1. **Use Mailchimp's built-in welcome email** (easiest)
2. **Set up domain authentication** (required)
3. **Use the admin interface for blog post notifications** (bulk emails)
4. **Keep the current code for user management** (adding users to list)

### 11. **Quick Fix for Current Issue**

To get emails working immediately:

1. **Set up domain authentication in Mailchimp**
2. **Enable welcome emails in Mailchimp settings**
3. **Test with a small audience first**
4. **Check your domain's DNS records**

### 12. **Testing Checklist**

- [ ] Domain authenticated in Mailchimp
- [ ] API credentials correct
- [ ] Audience created and has subscribers
- [ ] Welcome email enabled in Mailchimp
- [ ] Environment variables set correctly
- [ ] Test account creation works
- [ ] Test blog post notification works

---

**Next Steps:**
1. Complete domain authentication in Mailchimp
2. Enable welcome emails in Mailchimp settings
3. Test the system with a small audience
4. Monitor email delivery rates
