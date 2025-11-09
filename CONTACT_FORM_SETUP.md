# Contact Form Setup Guide

## Overview
The contact form is now integrated with EmailJS to send emails directly from the website. This guide will help you set it up.

## Features

✅ **Editable Contact Information**
- All contact details (Email, Phone, Location, Response Time) are editable from Admin Dashboard
- Navigate to Admin Dashboard → Contact Info tab
- Click the edit icon on any contact card to modify it

✅ **Working Contact Form**
- Integrated with EmailJS for sending emails
- Success/Error feedback messages
- Form validation

## EmailJS Setup Instructions

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy your Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. **Copy your Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General** in EmailJS dashboard
2. **Copy your Public Key**

### Step 5: Configure in Admin Dashboard
1. Login to Admin Dashboard (`/admin`)
2. Go to **Contact Info** tab
3. Scroll down to **Email Service Configuration** section
4. Enter:
   - **Service ID**: Your EmailJS Service ID
   - **Template ID**: Your EmailJS Template ID  
   - **Public Key**: Your EmailJS Public Key
5. The values are automatically saved to localStorage

### Alternative: Environment Variables (Recommended for Production)

Add to your `.env.local` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Then rebuild:
```bash
npm run build
```

## Testing the Form

1. Navigate to the Contact section on your portfolio
2. Fill out the form with test data
3. Click "Send Message"
4. You should receive an email at your configured email address
5. Check for success/error messages

## Troubleshooting

**Form shows "Email service not configured"**
- Make sure you've entered all three EmailJS credentials in Admin Dashboard
- Check that values are saved (they persist in localStorage)
- Try refreshing the page

**Email not sending**
- Verify all EmailJS credentials are correct
- Check EmailJS dashboard for error logs
- Make sure your email service is connected in EmailJS
- Check browser console for errors

**Success message but no email received**
- Check spam folder
- Verify email service connection in EmailJS dashboard
- Check EmailJS usage limits (free tier: 100 emails/month)

## Security Notes

⚠️ **Public Key Exposure**: The EmailJS Public Key is exposed in the client-side code. This is normal and safe for EmailJS - the public key has limited permissions.

✅ **Form Validation**: The form includes client-side validation (required fields, email format)

✅ **Rate Limiting**: EmailJS includes built-in rate limiting to prevent abuse

## Updating Contact Information

1. Go to Admin Dashboard → **Contact Info** tab
2. Click the edit icon (✏️) on any contact card
3. Update:
   - **Title**: e.g., "Email", "Phone"
   - **Value**: The actual contact value
   - **Description**: Helpful description text
4. Click the save icon (💾)
5. Changes appear immediately on the contact page

## Support

For EmailJS issues:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)

For portfolio issues:
- Check browser console for errors
- Verify all dependencies are installed: `npm install`

