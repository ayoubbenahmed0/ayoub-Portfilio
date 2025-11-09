# Netlify Deployment Guide

## Problem: 404 Error on Admin Dashboard

When deploying to Netlify, accessing `/admin` or `/admin/login` returns a 404 error because Netlify tries to find a physical file at those paths instead of serving your React app.

## Solution

Two files have been created to fix this issue:

1. **`public/_redirects`** - Netlify redirects file (automatically copied to `dist` during build)
2. **`netlify.toml`** - Netlify configuration file

These files ensure all routes are redirected to `index.html` so your React app can handle client-side routing.

## Deployment Steps

### Method 1: Deploy via Netlify Dashboard

1. **Build your project locally** (optional, to test):
   ```bash
   npm run build
   ```

2. **Go to Netlify Dashboard**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"

3. **Connect your Git repository**:
   - Connect to GitHub/GitLab/Bitbucket
   - Select your portfolio repository

4. **Configure build settings** (should auto-detect):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Netlify will automatically use `netlify.toml` if present

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and deploy**:
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Method 3: Deploy via Git (Recommended)

1. **Push your code to Git**:
   ```bash
   git add .
   git commit -m "Add Netlify configuration for SPA routing"
   git push
   ```

2. **Connect repository in Netlify**:
   - Netlify will auto-detect build settings from `netlify.toml`
   - Each push will trigger a new deployment

## Verify the Fix

After deployment:

1. **Test the main page**: `https://your-site.netlify.app/`
2. **Test admin login**: `https://your-site.netlify.app/admin`
3. **Test admin login page**: `https://your-site.netlify.app/admin/login`

All routes should now work correctly! ✅

## Environment Variables on Netlify

### EmailJS Configuration (Required for Contact Form)

Your EmailJS credentials:
- **Service ID**: `service_48ams9f`
- **Template ID**: `template_pgyr115`
- **Public Key**: `4dZJCDcp6anscSSmL`

#### Steps to Configure:

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable** and add each variable:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_EMAILJS_SERVICE_ID` | `service_48ams9f` |
   | `VITE_EMAILJS_TEMPLATE_ID` | `template_pgyr115` |
   | `VITE_EMAILJS_PUBLIC_KEY` | `4dZJCDcp6anscSSmL` |

3. **Optional - Admin Passwords** (change these!):
   - `VITE_DEFAULT_ADMIN_PASSWORD` - Your admin password
   - `VITE_OWNER_UNLOCK_PASSWORD` - Your recovery password

4. **Optional - Contact Email**:
   - `VITE_CONTACT_EMAIL` - Your email for receiving contact form submissions

5. **Rebuild** your site after adding variables:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**

### Alternative: Configure via Admin Dashboard

You can also configure EmailJS via the Admin Dashboard after deployment:
1. Login to `/admin`
2. Go to **Contact Info** tab
3. Scroll to **Email Service Configuration**
4. Enter your credentials and save

**Note**: Environment variables take precedence over Admin Dashboard settings.

## Troubleshooting

### Still getting 404 errors?

1. **Check that `_redirects` file is in `dist` folder**:
   ```bash
   npm run build
   ls dist/_redirects  # Should show the file
   ```

2. **Verify `netlify.toml` is in the root directory**

3. **Check Netlify build logs**:
   - Go to Netlify Dashboard → Deploys → Click on the deploy
   - Check for any errors in the build logs

4. **Clear Netlify cache**:
   - Go to Deploys → Trigger deploy → Clear cache and deploy site

### Admin dashboard not loading?

1. **Check browser console** for JavaScript errors
2. **Verify environment variables** are set in Netlify
3. **Check that build completed successfully**

### Routes work in development but not in production?

- This is normal - the fix applies to production builds
- Make sure you've committed `public/_redirects` and `netlify.toml`
- Redeploy after adding these files

## Files Created

- ✅ `public/_redirects` - Redirects all routes to index.html
- ✅ `netlify.toml` - Netlify configuration with build settings and headers

## Additional Configuration

The `netlify.toml` file also includes:
- Security headers (X-Frame-Options, XSS Protection, etc.)
- Cache control for static assets
- Cache control for HTML files

These improve security and performance of your deployed site.

## Support

For more information:
- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [Netlify Headers Documentation](https://docs.netlify.com/routing/headers/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
