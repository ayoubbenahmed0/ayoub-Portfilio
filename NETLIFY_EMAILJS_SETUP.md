# EmailJS Setup for Netlify

## Your EmailJS Credentials

I've saved your EmailJS credentials. Here's how to configure them:

### Local Development (.env file)

1. **Create `.env.local` file** in the root directory
2. **Copy the contents** from `.env.example`
3. Your EmailJS credentials are already filled in:
   ```
   VITE_EMAILJS_SERVICE_ID=service_48ams9f
   VITE_EMAILJS_TEMPLATE_ID=template_pgyr115
   VITE_EMAILJS_PUBLIC_KEY=4dZJCDcp6anscSSmL
   ```

4. **Rebuild and restart**:
   ```bash
   npm run build
   npm run dev
   ```

### Netlify Deployment (Environment Variables)

To use EmailJS on your Netlify site, add these environment variables:

#### Step 1: Go to Netlify Dashboard
1. Visit [app.netlify.com](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**

#### Step 2: Add Environment Variables
Click **Add a variable** and add each of these:

| Variable Name | Value |
|--------------|-------|
| `VITE_EMAILJS_SERVICE_ID` | `service_48ams9f` |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_pgyr115` |
| `VITE_EMAILJS_PUBLIC_KEY` | `4dZJCDcp6anscSSmL` |

#### Step 3: Optional - Add Admin Passwords
Also add these (change the values!):
- `VITE_DEFAULT_ADMIN_PASSWORD` - Your admin password
- `VITE_OWNER_UNLOCK_PASSWORD` - Your recovery password

#### Step 4: Optional - Add Contact Email
- `VITE_CONTACT_EMAIL` - Your email address for receiving contact form submissions

#### Step 5: Redeploy
After adding environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete

## Testing the Contact Form

After deployment:

1. **Visit your site**: `https://your-site.netlify.app`
2. **Go to Contact section**
3. **Fill out the form** with test data
4. **Submit the form**
5. **Check your email** - you should receive the message

## Alternative: Configure via Admin Dashboard

You can also configure EmailJS credentials via the Admin Dashboard:

1. **Login to Admin Dashboard**: `https://your-site.netlify.app/admin`
2. **Go to Contact Info tab**
3. **Scroll to Email Service Configuration**
4. **Enter your credentials**:
   - Service ID: `service_48ams9f`
   - Template ID: `template_pgyr115`
   - Public Key: `4dZJCDcp6anscSSmL`
5. **Save** - values are stored in localStorage

**Note**: Environment variables take precedence over Admin Dashboard settings.

## Troubleshooting

### Contact form shows "Email service not configured"
- Verify environment variables are set in Netlify
- Check that you've redeployed after adding variables
- Try configuring via Admin Dashboard as a fallback

### Emails not sending
- Verify all three EmailJS credentials are correct
- Check EmailJS dashboard for error logs
- Verify your email service is connected in EmailJS
- Check browser console for errors

### Success message but no email received
- Check spam folder
- Verify email service connection in EmailJS dashboard
- Check EmailJS usage limits (free tier: 100 emails/month)

## Security Note

⚠️ **Important**: The EmailJS Public Key is exposed in client-side code. This is normal and safe for EmailJS - the public key has limited permissions and is designed to be public.

## Next Steps

1. ✅ EmailJS credentials are configured
2. ⬜ Add environment variables to Netlify
3. ⬜ Redeploy your site
4. ⬜ Test the contact form
5. ⬜ Change default admin passwords

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- Contact Form Setup: See `CONTACT_FORM_SETUP.md`
- Netlify Deployment: See `NETLIFY_DEPLOYMENT.md`
