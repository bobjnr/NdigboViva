# Resend Email Setup Guide

## 🚀 **Why Resend is Perfect for You**

- **FREE**: 3,000 emails/month (more than enough for most blogs)
- **Professional**: Emails come from your domain
- **Easy Setup**: No complex domain authentication required initially
- **Better Deliverability**: Higher inbox rates than free alternatives
- **Simple API**: Easy to integrate

## 📋 **Step-by-Step Setup**

### **Step 1: Create Resend Account**

1. Go to [resend.com](https://resend.com)
2. Click **"Get Started"**
3. Sign up with your email
4. Verify your email address

### **Step 2: Get Your API Key**

1. Log into your Resend dashboard
2. Go to **API Keys** section
3. Click **"Create API Key"**
4. Give it a name (e.g., "Ndigbo Viva Blog")
5. **Copy the API key** (starts with `re_`)

### **Step 3: Add Environment Variable**

Add this to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
```

### **Step 4: Install Resend Package**

Run this command in your project:

```bash
npm install resend
```

### **Step 5: Test Your Setup**

1. **Test API Connection**: Visit `/api/test-email` (POST request)
2. **Test User Registration**: Create a test account
3. **Check Email Delivery**: Look for the welcome email

## 🎯 **What You Get**

### **Welcome Emails**
- ✅ Professional HTML templates
- ✅ Your branding and colors
- ✅ Links to blog and YouTube
- ✅ Personalized with user's name

### **Blog Post Notifications**
- ✅ Rich HTML templates
- ✅ Post thumbnails and excerpts
- ✅ Direct links to blog posts
- ✅ YouTube video integration

### **Email Features**
- ✅ Professional sender address
- ✅ High deliverability rates
- ✅ Mobile-responsive templates
- ✅ Unsubscribe links

## 🔧 **Advanced Setup (Optional)**

### **Custom Domain (Recommended for Production)**

For even better deliverability:

1. **Add Your Domain in Resend**
   - Go to Resend dashboard → Domains
   - Add your domain (e.g., `ndigboviva.com`)
   - Follow DNS setup instructions

2. **Update Email Addresses**
   - Change from `onboarding@resend.dev` to `hello@ndigboviva.com`
   - Update in `src/lib/email-free.ts`

### **Subscriber Management**

You'll need to implement subscriber management:

1. **Database Storage**: Store subscriber emails in your database
2. **Newsletter Signup**: Update the newsletter component
3. **Admin Interface**: Manage subscribers

## 📊 **Pricing Comparison**

| Service | Free Tier | Paid Plans | Domain Auth |
|---------|-----------|------------|-------------|
| **Resend** | 3,000 emails/month | $20/month for 50k | Free |
| **Mailchimp** | 500 contacts | $10/month | $10/month required |
| **SendGrid** | 100 emails/day | $15/month | Free |

**Resend is the clear winner!** 🏆

## 🧪 **Testing Your Setup**

### **Test 1: API Connection**
```bash
# Test your API key
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@resend.dev","to":["test@example.com"],"subject":"Test","html":"<p>Test email</p>"}'
```

### **Test 2: Website Integration**
1. Visit your website
2. Create a test account
3. Check if welcome email is sent
4. Check spam folder if needed

### **Test 3: Blog Notifications**
1. Go to `/admin/email`
2. Send a test blog post notification
3. Check email delivery

## 🚨 **Common Issues & Solutions**

### **Issue: "Invalid API key"**
**Solution**: Check your API key in `.env.local`

### **Issue: "Emails not sending"**
**Solutions**:
- Verify your API key is correct
- Check your Resend dashboard for errors
- Ensure you're not exceeding the free tier

### **Issue: "Emails going to spam"**
**Solutions**:
- Set up custom domain in Resend
- Use professional email addresses
- Avoid spam trigger words

## 🎉 **Benefits of This Setup**

1. **No Monthly Costs**: Free for 3,000 emails/month
2. **Professional Emails**: From your domain, not third-party
3. **Easy Management**: Simple dashboard
4. **Better Deliverability**: Higher inbox rates
5. **Scalable**: Easy to upgrade when needed

## 📈 **Next Steps**

1. **Set up Resend account** (5 minutes)
2. **Add API key to environment** (2 minutes)
3. **Test the system** (5 minutes)
4. **Start sending emails!** 🚀

---

**Total Setup Time**: ~15 minutes
**Monthly Cost**: $0 (free tier)
**Professional Results**: ✅

Ready to get started? Let me know if you need help with any step!
