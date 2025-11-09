# Install EmailJS Package

## Quick Fix

You need to install the `@emailjs/browser` package. The package is already in your `package.json`, but it needs to be installed.

## Installation Methods

### Method 1: VS Code Terminal (Recommended)
1. Open VS Code
2. Open the integrated terminal (Ctrl + ` or Terminal → New Terminal)
3. Run:
   ```bash
   npm install
   ```

### Method 2: Command Prompt (CMD)
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```bash
   cd "C:\Users\ayoub'PC\Documents\v5"
   ```
4. Run:
   ```bash
   npm install
   ```

### Method 3: PowerShell (If path issues persist)
Try using forward slashes:
```powershell
cd "C:/Users/ayoub'PC/Documents/v5"
npm install
```

### Method 4: File Explorer
1. Open File Explorer
2. Navigate to: `C:\Users\ayoub'PC\Documents\v5`
3. Right-click in the folder
4. Select "Open in Terminal" or "Open PowerShell window here"
5. Run: `npm install`

## Verify Installation

After running `npm install`, check that the package exists:
- Look for `node_modules/@emailjs/browser` folder
- Or run: `npm list @emailjs/browser`

## Restart Dev Server

After installation:
1. Stop your dev server (Ctrl + C)
2. Restart it: `npm run dev`
3. The error should be gone!

## Alternative: Skip EmailJS for Now

If you can't install right now, the form will show an error message when someone tries to submit, but the site won't crash.

