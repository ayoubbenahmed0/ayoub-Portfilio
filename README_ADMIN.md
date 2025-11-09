# Admin Dashboard Documentation

## Overview
This portfolio includes a secure Admin Dashboard that allows you to manage all portfolio content dynamically without touching the code.

## Accessing the Admin Dashboard

1. Navigate to `/admin` or `/admin/login` in your browser
2. Default password: See `.env.local` or use `ayoub100` (change immediately!)
3. **Important**: 
   - Create `.env.local` file (copy from `.env.example`)
   - Set your own passwords in `.env.local`
   - Rebuild the app: `npm run build`
   - Change password via Settings after login

## Features

### 1. Projects Management
- **Add Projects**: Click "Add New Project" to create a new project
  - Title (required)
  - Description (required)
  - Image URL (required, must be valid URL)
  - Technologies (add multiple, at least one required)
  - GitHub URL (optional)
  - Demo URL (optional)
  - Featured toggle

- **Edit Projects**: Click the edit icon on any project card
- **Delete Projects**: Click the delete icon (confirmation required)

### 2. Skills Management
- **Add Skills**: Click "Add New Skill"
  - Name (required)
  - Icon (emoji, required)
  - Category (required, dropdown selection)
  - Proficiency Level (0-100%, slider)

- **Edit Skills**: Click the edit icon on any skill card
- **Delete Skills**: Click the delete icon (confirmation required)

### 3. Social Links Management
- **Add Social Links**: Click "Add New Social Link"
  - Name (required)
  - URL (required, must be valid URL or mailto link)
  - Icon Type (GitHub, LinkedIn, Twitter, Email)

- **Edit Social Links**: Click the edit icon on any social link card
- **Delete Social Links**: Click the delete icon (confirmation required)

## Data Storage

All data is stored in browser `localStorage`:
- `portfolio_projects`: Projects data
- `portfolio_skills`: Skills data
- `portfolio_socials`: Social links data
- `portfolio_admin_token`: Authentication token
- `portfolio_admin_expiry`: Token expiry timestamp

## Security Notes

⚠️ **IMPORTANT**: This admin dashboard uses **client-side authentication**. All JavaScript code (including passwords) is visible in the browser. See `SECURITY.md` for detailed security information.

### Quick Security Setup

1. **Create `.env.local` file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update passwords in `.env.local`**:
   - `VITE_DEFAULT_ADMIN_PASSWORD`: Your admin password
   - `VITE_OWNER_UNLOCK_PASSWORD`: Your owner unlock password

3. **Rebuild the app**:
   ```bash
   npm run build
   ```

### Security Features

1. **Environment Variables**: Passwords in `.env.local` (better than hardcoded, but still visible in bundle)
2. **Password Hashing**: Passwords hashed before storage
3. **Token-Based Auth**: Uses 24-hour session tokens
4. **Rate Limiting**: Account locks after 5 failed attempts (15 minutes)
5. **Owner Unlock**: Recovery password for locked accounts

### Security Limitations

- ⚠️ All code is visible in browser DevTools
- ⚠️ Environment variables are embedded in the production bundle
- ⚠️ No server-side validation
- ⚠️ Suitable for personal portfolios only

**For production/enterprise use, implement server-side authentication.**

## Live Preview

Changes made in the admin dashboard instantly reflect in the main portfolio when you navigate to the home page. There's a "View Portfolio" button in the admin header for quick access.

## Changing Passwords

### Method 1: Via Admin Dashboard (Recommended)
1. Login to admin dashboard
2. Go to Settings tab
3. Use "Change Password" section
4. Enter old password and new password
5. Click "Change Password"

### Method 2: Via Environment Variables
1. Update `.env.local` file:
   ```env
   VITE_DEFAULT_ADMIN_PASSWORD=your_new_password
   VITE_OWNER_UNLOCK_PASSWORD=your_new_owner_password
   ```
2. Rebuild the app: `npm run build`

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── Login.jsx          # Login page
│   │   ├── AdminDashboard.jsx # Main dashboard
│   │   ├── ProjectForm.jsx    # Project CRUD form
│   │   ├── SkillForm.jsx      # Skill CRUD form
│   │   └── SocialForm.jsx     # Social link CRUD form
│   ├── Projects.jsx           # Updated to use context
│   ├── Skills.jsx             # Updated to use context
│   └── Contact.jsx            # Updated to use context
├── context/
│   ├── AuthContext.jsx        # Authentication context
│   └── PortfolioContext.jsx   # Portfolio data context
└── App.jsx                    # Main app with routing
```

## Future Enhancements

Consider adding:
- Password change functionality in the dashboard
- Data export/import (JSON)
- Image upload instead of URLs
- Advanced authentication (OAuth, JWT)
- Backend API integration
- Version history/undo functionality

