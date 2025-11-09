# Shared Storage Setup - Make Admin Changes Visible to All Users

## Problem Solved

Previously, changes made in the Admin Dashboard were only saved to `localStorage`, which is local to each user's browser. Now, changes are saved to a shared storage (JSONBin.io) so **all users see the same data**.

## How It Works

1. **Admin makes changes** → Data is saved to JSONBin.io (shared storage)
2. **All users load data** → Data is loaded from JSONBin.io on page load
3. **Real-time updates** → All users see the same portfolio data

## Setup Instructions

### Option 1: Using JSONBin.io (Recommended)

JSONBin.io is a free service that allows you to store JSON data in the cloud.

#### Step 1: Create JSONBin.io Account

1. Go to [jsonbin.io](https://jsonbin.io/)
2. Sign up for a free account
3. You get **10,000 requests/month free**

#### Step 2: Get Your API Key

1. After signing up, go to your dashboard
2. Click on "API Keys" in the sidebar
3. Copy your **Master Key** (or create a new one)

#### Step 3: Create a Bin (First Time)

1. In JSONBin.io dashboard, click "Create Bin"
2. Name it "Portfolio Data"
3. Make it **Public** (so all users can read it)
4. Copy the **Bin ID** from the URL (e.g., `https://jsonbin.io/your-bin-id`)

#### Step 4: Configure in Your Project

**Option A: Environment Variables (Recommended for Production)**

Add to Netlify Environment Variables:
- `VITE_JSONBIN_API_KEY` = $2a$10$h0TqXfKJUFANLz/8duPtGuynSMlrYSuaBO9AVfcT3dkiRge1HGTPy
- `VITE_JSONBIN_BIN_ID` = 69106b3bd0ea881f40dd4ef0

**Option B: Hardcode in Code (For Testing)**

Edit `src/utils/storage.js`:
```javascript
const JSONBIN_MASTER_KEY = '$2a$10$h0TqXfKJUFANLz/8duPtGuynSMlrYSuaBO9AVfcT3dkiRge1HGTPy'
const JSONBIN_BIN_ID = '69106b3bd0ea881f40dd4ef0'
```

#### Step 5: Deploy

After adding the environment variables:
1. Commit and push your changes
2. Netlify will automatically rebuild
3. Test by making a change in Admin Dashboard
4. Open the site in a different browser/incognito mode
5. Verify that the change is visible to all users

### Option 2: Using GitHub Gist (Alternative)

If you prefer GitHub Gist, you can modify the storage utility to use Gist API instead.

## How to Use

### For Admins

1. **Login to Admin Dashboard** (`/admin`)
2. **Make changes** (add/edit projects, skills, socials, contact info)
3. **Changes are automatically saved** to shared storage
4. **All users will see the changes** immediately

### For Regular Users

1. **Visit the portfolio website**
2. **Data is automatically loaded** from shared storage
3. **See the latest updates** from admin

## Troubleshooting

### Changes not visible to other users?

1. **Check API Key**: Verify `VITE_JSONBIN_API_KEY` is set in Netlify
2. **Check Bin ID**: Verify `VITE_JSONBIN_BIN_ID` is set correctly
3. **Check Browser Console**: Look for errors when loading/saving
4. **Check JSONBin.io Dashboard**: Verify the bin exists and is public

### Getting 401 Unauthorized error?

- Verify your API key is correct
- Check that the API key has write permissions
- Make sure you're using the Master Key, not a read-only key

### Getting 404 Not Found error?

- The bin doesn't exist yet
- Create the bin manually in JSONBin.io dashboard
- Or let the code create it automatically (requires API key)

### Data not saving?

- Check if you're logged in as admin
- Only admin users can save to shared storage
- Regular users can only read from shared storage
- Check browser console for errors

### Fallback to localStorage?

If JSONBin.io is not configured:
- The system will automatically fallback to localStorage
- Changes will only be visible to the current user
- This is the default behavior if no API key is set

## Security Notes

- **API Key**: Keep your JSONBin.io API key secret
- **Bin ID**: The Bin ID can be public (it's just an identifier)
- **Public Bins**: Make sure your bin is set to "Public" so all users can read it
- **Admin Only Write**: Only authenticated admin users can write to shared storage

## Free Tier Limits

JSONBin.io Free Tier:
- **10,000 requests/month** (should be plenty for a portfolio)
- **Public bins** are free
- **No credit card required**

## Alternative Solutions

If you need more requests or features:

1. **Upgrade JSONBin.io** ($5/month for 100,000 requests)
2. **Use Firebase Firestore** (free tier available)
3. **Use Supabase** (free tier available)
4. **Use GitHub Gist API** (unlimited, but rate limited)

## Testing

1. **Make a change in Admin Dashboard** (add a project)
2. **Open the site in incognito mode** (or different browser)
3. **Verify the change is visible** to all users
4. **Check JSONBin.io dashboard** to see the updated data

## Support

- JSONBin.io Documentation: https://jsonbin.io/api-reference
- JSONBin.io Dashboard: https://jsonbin.io/app
- Check browser console for error messages
- Verify environment variables in Netlify dashboard
