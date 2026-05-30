## 🔍 Chrome Extension Debugging Guide

If you're still seeing "Please login to GreatHire first" and "No profiles found", follow these steps:

---

## Step 1: Verify Extension is Installed

1. Open `chrome://extensions/`
2. Make sure "GreatHire Talent Sourcer" is visible and enabled
3. Note the extension ID (looks like: `jjdlmnpabcdefg...`)

---

## Step 2: Check Browser Logs on GreatHire Website

1. **Navigate to http://localhost:5173** (GreatHire website)
2. **Open DevTools**: Press `F12`
3. Go to **Console** tab
4. Look for messages starting with `[GreatHire Extension]`
5. You should see:
   - ✅ `[GreatHire Extension] Injected script loaded`
   - ✅ `[GreatHire Extension] Content script loaded on GreatHire website`
   - ✅ `[GreatHire Extension] Found token in storage: token` (or similar)

**If you DON'T see these messages:**
- The content script is not running
- The extension reload failed
- Try: Go to `chrome://extensions/` and click reload

---

## Step 3: Manually Find Your Token

1. Open **DevTools** on GreatHire website (F12)
2. Go to **Console** tab
3. Paste this code:
```javascript
const keys = ['token', 'authToken', 'auth_token', 'access_token', 'jwt'];
for (const key of keys) {
  const val = localStorage.getItem(key) || sessionStorage.getItem(key);
  if (val) console.log(`Found ${key}:`, val.substring(0, 20) + '...');
}
```
4. Press Enter
5. **If you see a token**, the GreatHire website is storing it
6. **If nothing appears**, the website's login might not be working

---

## Step 4: Check Background Service Worker Logs

1. Go to `chrome://extensions/`
2. Find "GreatHire Talent Sourcer"
3. Click "Service Worker" link (under "Inspect views")
4. This opens the service worker console
5. Look for messages like:
   - ✅ `Checking login status...`
   - ✅ `Using token from storage`
   - ❌ `No valid auth token found`

---

## Step 5: Manual Token Transfer (Workaround)

If the automatic token detection isn't working:

1. **Get token from website**:
   - Open DevTools on GreatHire (F12)
   - Console tab
   - Type: `localStorage.getItem('token')`
   - Copy the token value

2. **Manually set token in extension**:
   - Open DevTools extension background (from Step 4)
   - Paste:
   ```javascript
   chrome.storage.local.set({ 
     authToken: 'YOUR_TOKEN_HERE',
     loginTime: Date.now()
   }, () => console.log('Token set manually'));
   ```
   - Replace `YOUR_TOKEN_HERE` with actual token
   - Press Enter

3. **Refresh popup** - should show "✅ Connected"

---

## Step 6: Test Profile Extraction

1. Go to **LinkedIn search results** (linkedin.com/search/results/...)
2. Open extension popup
3. Click **"Extract Profiles from Current Page"**
4. Open **DevTools** on LinkedIn (F12)
5. Go to **Console** tab
6. Look for `[GreatHire Extension]` messages showing profile extraction

**Expected flow:**
- ✅ `Extracting profiles...`
- ✅ `Found potential profile elements: 10`
- ✅ `Extracted profile: John Doe`
- ✅ `Sending response with 10 profiles`

---

## Common Issues & Fixes

### Issue: "Please login to GreatHire first" persists
**Solution:**
1. Make sure you actually logged in to http://localhost:5173
2. Reload the extension: `chrome://extensions/` → reload button
3. Refresh GreatHire website
4. Check console for `[GreatHire Extension]` logs
5. Manually check localStorage (see Step 3)

---

### Issue: "No profiles found"
**Solution:**
1. Make sure you're on LinkedIn **search results page** (not home)
2. Refresh the page
3. Open DevTools and check console for extraction logs
4. Try manually extracting via console:
```javascript
const profiles = extractProfiles();
console.log('Profiles found:', profiles.length);
```

---

### Issue: Content script not running on LinkedIn
**Solution:**
1. Check manifest permissions - should include `https://www.linkedin.com/*`
2. The extension needs to be reloaded
3. Try opening a new LinkedIn tab after reloading

---

## Step 7: Check Extension Permissions

1. Go to `chrome://extensions/`
2. Find "GreatHire Talent Sourcer"
3. Click "Details"
4. Scroll to "Permissions"
5. Should see:
   - ✅ Read and change your data on linkedin.com
   - ✅ Read and change your data on localhost:5173
   - ✅ Read and change browser settings

---

## Step 8: Clear Extension Data & Reinstall

If nothing works:

1. Go to `chrome://extensions/`
2. Find "GreatHire Talent Sourcer"
3. Click "Remove"
4. Close browser completely
5. Reopen Chrome
6. Go to `chrome://extensions/` → "Load unpacked"
7. Navigate to the chrome-extension folder
8. Select it and load

---

## Still Not Working?

Share these logs:
1. Console output from GreatHire website (F12 → Console)
2. Background service worker logs
3. Did you see "Content script loaded on GreatHire website"?
4. What's the exact error message in the popup?

