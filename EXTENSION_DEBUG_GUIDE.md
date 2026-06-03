# GreatHire Extension - Debug & Test Guide

## Quick Start Testing

### 1. **Reload Extension**
```
chrome://extensions/
→ Find "GreatHire Candidate Extractor"
→ Click reload button
```

### 2. **Test Authentication**
- Navigate to: `http://localhost:5173/recruiter/dashboard/home`
- Open Extension popup
- **Expected**: Shows "✅ Connected to GreatHire"
- **If Error**: See [Authentication Issues](#authentication-issues)

### 3. **Test Extraction on LinkedIn**

#### Verify Floating Button Appears
1. Go to LinkedIn Search: https://www.linkedin.com/search/results/people/?keywords=software%20engineer
2. Open DevTools: **F12**
3. Look for floating button with "🎯 Extract" in bottom-right
4. **If Missing**: Check console for errors

#### Extract Profiles
1. Click the 🎯 Extract button
2. Wait for button to change:
   - ⏳ "Saving..." → uploading
   - ✅ "Saved" → success
   - ❌ "Failed" → error
3. **Check Console** for detailed logs

### 4. **Read Console Logs (IMPORTANT FOR DEBUGGING)**

Open DevTools on LinkedIn (F12) and look for logs starting with `[GreatHire]`:

**Successful Extraction Should Show:**
```
[GreatHire] ========== EXTRACTION STARTED ==========
[GreatHire] Platform: linkedin
[GreatHire] Current URL: https://www.linkedin.com/search/results/people/...
[GreatHire] 📌 Page type: LinkedIn People Search - extraction should work
[GreatHire] Starting LinkedIn extraction...
[GreatHire] Found search containers: 10
[GreatHire] ✅ Extracted: John Doe | Software Engineer | San Francisco
[GreatHire] Total profiles extracted: 10
[GreatHire] ========== EXTRACTION COMPLETED ==========
```

**No Profiles Found Should Show:**
```
[GreatHire] Found search containers: 0
[GreatHire] No search results found, trying single profile extraction...
[GreatHire] ❌ Could not find profile name element on this page
[GreatHire] Total profiles extracted: 0
```

---

## Common Issues & Solutions

### Authentication Issues

**Problem**: Shows "⚠️ Please login to GreatHire first"

**Solution**:
1. Make sure you're logged into GreatHire: `http://localhost:5173/recruiter/dashboard/home`
2. Check if cookies are set:
   - Open DevTools (F12)
   - Go to Application → Cookies → localhost:5173
   - Should see a `token` cookie
3. Reload extension: `chrome://extensions/` → reload
4. Wait 10 seconds, then check popup again

### Floating Button Not Appearing

**Problem**: No 🎯 Extract button visible on LinkedIn

**Solution**:
1. Check Console (F12):
   - Look for: `[GreatHire] Content script loaded`
   - If missing: extension content script didn't inject
2. Verify you're on supported page:
   - ✅ Supported: `/search/results/people/...` (people search)
   - ✅ Supported: `/in/[username]/` (profile page)
   - ❌ Not supported: `/jobs/...` (jobs page)
   - ❌ Not supported: `/feed/...` (feed page)
3. Refresh page and wait 2 seconds

### Extract Button Shows "No profiles found"

**Problem**: Click extract but nothing happens or says "No profiles found"

**Solution**:
1. **Check page type** in console:
   - Should show: "Page type: LinkedIn People Search"
   - If different: navigate to people search page
2. **Check selector matching**:
   - In Console, run:
   ```javascript
   document.querySelectorAll('.base-card, .reusable-search__result-container, .entity-result__item').length
   ```
   - Should return > 0
   - If 0: LinkedIn UI changed, selectors need updating
3. **Check name extraction**:
   ```javascript
   document.querySelector('a span[aria-hidden="true"]')?.textContent
   ```
   - Should show a person's name
   - If empty/null: selectors don't match current LinkedIn UI

### Extraction Says "Saving..." But Then Fails

**Problem**: Button shows saving spinner then ❌ Failed

**Solution**:
1. Check Network tab (F12 → Network):
   - Look for POST request to: `http://localhost:3000/api/v1/sourcing/upload-manual`
   - Check response status:
     - ✅ 200/201: Saved successfully
     - ❌ 401: Not authenticated (check backend auth)
     - ❌ 500: Server error (check backend logs)
2. Check Console logs:
   - Look for: `[Background] Upload error` or similar
3. Verify backend is running:
   - Check backend terminals
   - Try accessing: `http://localhost:3000/api/v1/recruiter/profile`
   - Should return 200 with recruiter data

### Profiles Saved But Not Showing in Dashboard

**Problem**: Extension says "Saved" but profiles don't appear in GreatHire

**Solution**:
1. Check backend logs for any errors
2. In GreatHire dashboard, refresh page: F5
3. Navigate to: Recruiter Dashboard → Candidate Database
4. Check if profiles appear with correct data
5. If missing: Check backend database

---

## Testing Checklist

- [ ] Extension loaded in Chrome
- [ ] Showing "Connected" status
- [ ] Floating button visible on LinkedIn
- [ ] Can click extract button
- [ ] Console shows `[GreatHire]` logs
- [ ] Shows profiles extracted count
- [ ] Can see upload progress
- [ ] Backend shows 200 response for uploads
- [ ] Profiles appear in GreatHire dashboard

---

## Manual Testing Commands

### Test Extension is Connected
```javascript
// In browser console on any page
chrome.runtime.sendMessage({action: 'checkLogin'}, (res) => console.log('Auth status:', res))
```

### Test Profile Extraction
```javascript
// In console on LinkedIn search page
chrome.runtime.sendMessage({action: 'extractProfiles'}, (res) => console.log('Profiles:', res))
```

### Test Backend API Directly
```javascript
// Test in any browser console
fetch('http://localhost:3000/api/v1/recruiter/profile', {
  credentials: 'include'
}).then(r => r.json()).then(d => console.log(d))
```

---

## Files to Check for Issues

1. **Extension Scripts**:
   - `chrome-extension/manifest.json` - Config
   - `chrome-extension/background.js` - Auth tracking
   - `chrome-extension/content.js` - LinkedIn extraction
   - `chrome-extension/inject.js` - Auth detection

2. **Backend**:
   - `BackEnd/routes/recruiter.route.js` - Auth endpoint
   - `BackEnd/routes/sourcing/sourcing.route.js` - Upload endpoint
   - `BackEnd/controllers/recruiter.contoller.js` - Profile controller

3. **Frontend**:
   - `frontend/src/pages/recruiter/candidate/CandidateDatabase.jsx` - Shows extracted candidates

---

## Still Stuck?

1. **Collect this info**:
   - Screenshot of DevTools Console (F12)
   - Network tab showing failed requests
   - Backend logs if applicable

2. **Check**:
   - Is GreatHire backend running? (check terminal)
   - Is GreatHire frontend running? (check `http://localhost:5173`)
   - Is Chrome extension loaded? (check `chrome://extensions`)
   - Are you logged in? (refresh `http://localhost:5173/recruiter/dashboard/home`)
