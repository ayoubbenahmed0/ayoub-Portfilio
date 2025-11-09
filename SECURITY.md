# Security Documentation

## ⚠️ Important Security Notice

**This Admin Dashboard uses client-side authentication, which has inherent security limitations.**

### Client-Side Security Limitations

**All client-side JavaScript code (including passwords) is visible to users who inspect the code.** This includes:

- Source code in browser DevTools
- Bundled JavaScript files
- Environment variables (they are embedded in the build)
- Password constants and logic

**Important**: Even with environment variables, passwords are still visible in the production bundle. This is a limitation of all client-side applications.

### Current Security Measures

1. **Password Hashing**: Passwords are hashed before storage in localStorage
2. **Environment Variables**: Sensitive values stored in `.env.local` (still visible in bundle)
3. **Rate Limiting**: Account locks after 5 failed attempts for 15 minutes
4. **Session Tokens**: 24-hour session expiration
5. **Owner Unlock**: Recovery mechanism for locked accounts
6. **Input Validation**: All inputs validated client-side

### Setup Instructions

1. **Copy Environment Template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`**:
   - Set `VITE_DEFAULT_ADMIN_PASSWORD` to your secure admin password
   - Set `VITE_OWNER_UNLOCK_PASSWORD` to your owner unlock password
   - **Never commit `.env.local` to Git**

3. **Rebuild the Application**:
   ```bash
   npm run build
   ```

### Security Best Practices Applied

✅ **DO:**
- Change default passwords immediately
- Use strong, unique passwords (12+ characters, mixed case, numbers, symbols)
- Keep `.env.local` out of version control (in `.gitignore`)
- Build in production mode (minified/obfuscated code)
- Change owner unlock password regularly
- Log out after each session
- Use HTTPS in production

❌ **DON'T:**
- Share admin passwords
- Commit `.env.local` to Git
- Use weak passwords (like "admin123" or "password")
- Leave sessions active on shared computers
- Expose the owner unlock password
- Trust client-side security for critical data

### For Production/Enterprise Use

**For serious security, implement server-side authentication:**

1. **Backend API**: Move authentication to a secure backend
2. **JWT Tokens**: Use secure, signed tokens from server
3. **HTTPS Only**: Always use HTTPS in production
4. **Server-Side Validation**: Validate all admin actions on the server
5. **Database Security**: Store passwords using bcrypt/argon2
6. **Rate Limiting**: Server-side rate limiting
7. **IP Whitelisting**: Restrict admin access to specific IPs
8. **2FA/MFA**: Add two-factor authentication

### Current Implementation Details

**Password Storage:**
- Passwords are hashed using a simple hash function (client-side)
- Hashed values stored in `localStorage`
- **NOT encrypted** - hashing is for obfuscation only
- Anyone with access to localStorage can see hashes

**Authentication Flow:**
1. User enters password
2. Password is hashed
3. Hash compared to stored hash
4. On match: session token created (24-hour expiry)
5. Token stored in `localStorage`

**Security Weaknesses:**
- ✅ Passwords moved to environment variables (better than hardcoded)
- ⚠️ Still visible in bundled JavaScript
- ⚠️ No server-side validation
- ⚠️ localStorage can be manipulated by users
- ⚠️ Client-side hashing is not cryptographically secure
- ⚠️ No encryption of stored data

### Recommendations

**For Personal/Portfolio Use (Current Setup):**
- ✅ Acceptable for personal portfolios
- ✅ Provides basic protection against casual users
- ✅ Better than hardcoded passwords
- ⚠️ Not secure against determined attackers
- ⚠️ Change passwords from defaults immediately

**For Professional/Client Projects:**
- ❌ **NOT RECOMMENDED** - Use server-side authentication
- Implement backend API with proper security
- Use professional authentication services:
  - Firebase Authentication
  - AWS Cognito
  - Auth0
  - Supabase Auth
- Implement proper database security

### File Structure

```
.env.local          # Environment variables (NEVER commit - in .gitignore)
.env.example        # Template file (safe to commit)
SECURITY.md         # This file
.gitignore          # Includes .env.local
```

### Changing Passwords

1. **Admin Password**: Change via Settings in Admin Dashboard (recommended)
2. **Owner Password**: Update `VITE_OWNER_UNLOCK_PASSWORD` in `.env.local` and rebuild

### Code Obfuscation

The production build (`npm run build`) minifies and obfuscates code, making it harder (but not impossible) to find passwords. However:
- Determined attackers can still find them
- DevTools can show source maps
- Network inspection can reveal values

### Additional Security Tips

1. **Use Content Security Policy (CSP)** in production
2. **Disable DevTools** (can be bypassed, but adds a barrier)
3. **Implement IP-based restrictions** at server/hosting level
4. **Monitor login attempts** and alert on suspicious activity
5. **Regular password rotation** policy
6. **Use HTTPS** to prevent man-in-the-middle attacks

### Questions?

**Remember**: Client-side security is always limited. For true security:
- Authentication must be server-side
- Sensitive operations must be validated server-side
- Never trust client-side validation alone

For production deployments with real security needs:
- Firebase Authentication
- AWS Cognito  
- Auth0
- Custom backend with Node.js/Express + JWT + bcrypt
- Supabase Auth

---

**Last Updated**: This documentation reflects the current client-side authentication implementation. For serious security needs, migrate to server-side authentication.
