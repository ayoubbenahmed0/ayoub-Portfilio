# EmailJS Credentials - Quick Reference

## Your EmailJS Configuration

✅ **Service ID**: `service_48ams9f`  
✅ **Template ID**: `template_pgyr115`  
✅ **Public Key**: `4dZJCDcp6anscSSmL`

## Quick Setup

### For Local Development

1. Create `.env.local` file in the root directory
2. Add these lines:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_48ams9f
   VITE_EMAILJS_TEMPLATE_ID=template_pgyr115
   VITE_EMAILJS_PUBLIC_KEY=4dZJCDcp6anscSSmL
   ```
3. Run `npm run build` and `npm run dev`

### For Netlify

1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Add these three variables with the values above
3. Redeploy your site

### Via Admin Dashboard

1. Deploy your site first
2. Go to `/admin` → Contact Info tab
3. Scroll to Email Service Configuration
4. Enter the credentials and save

## Testing

After setup, test the contact form:
1. Go to the Contact section on your site
2. Fill out and submit the form
3. Check your email inbox

## Troubleshooting

- **"Email service not configured"**: Make sure environment variables are set in Netlify and you've redeployed
- **No emails received**: Check spam folder, verify EmailJS dashboard, check usage limits (100/month free tier)
- **Errors in console**: Verify all three credentials are correct

## See Also

- `NETLIFY_EMAILJS_SETUP.md` - Detailed setup guide
- `CONTACT_FORM_SETUP.md` - EmailJS setup instructions
- `NETLIFY_DEPLOYMENT.md` - Netlify deployment guide
