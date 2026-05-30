# Quick Extension Token Detection Test

## Problem Solved ✅
The extension now **intercepts API Authorization headers** to capture the token instead of looking for it in localStorage.

**Why?** GreatHire backend returns the token as an **httpOnly cookie** (secure, inaccessible to JavaScript). The extension now:
1. Monitors fetch() and XMLHttpRequest calls
2. Captures the `Authorization: Bearer <token>` header
3. Passes token to extension storage
4. Enables profile extraction

## How to Test

### Step 1: Verify Extension is Loaded
1. Open Chrome DevTools (F12)
2. Go to **Chrome Menu → More Tools → Extensions** (or type `chrome://extensions/`)
3. Find "GreatHire Candidate Extractor" 
4. Make sure it's **Enabled**
5. Note the Extension ID

### Step 2: Login to GreatHire
1. Navigate to **http://localhost:5173/recruiter/dashboard/home**
2. Login with your recruiter credentials
3. You should see your dashboard

### Step 3: Check Console Logs (Token Interception)
1. Open **Chrome DevTools** (F12) on the GreatHire website
2. Go to **Console** tab
3. You should see messages like:
   ```
   [GreatHire Extension] Injected script loaded
   [GreatHire Extension] ✅ Captured token from Authorization header
   [GreatHire Extension] Injected script ready - monitoring API calls
   ```

4. OR if the token was already captured during login, messages like:
   ```
   [GreatHire Extension] ✅ Captured token from XHR Authorization header
   ```

### Step 4: Check Extension Service Worker Logs
1. Go to **chrome://extensions/**
2. Find "GreatHire Candidate Extractor"
3. Click **"Service Worker"** link
4. Look for messages like:
   ```
   [Background] Message received: setAuthToken
   [Background] ✅ Auth token stored successfully
   ```

### Step 5: Test Extension Popup
1. Click the Extension Icon in Chrome toolbar
2. The popup should show **"✅ Logged In"** in green
3. The "Extract Profiles" button should be active

### Step 6: Extract from LinkedIn
1. Navigate to **https://www.linkedin.com** (LinkedIn People Search)
2. The floating button with 🎯 emoji should appear
3. Click "Extract Profile" 
4. You should see extracted profiles in the popup

## How It Works Now

```
Flow:
1. User logs into GreatHire at localhost:5173
2. Backend authenticates and sets httpOnly cookie with token
3. When making API calls, browser auto-sends Authorization header
4. inject.js intercepts the Authorization header: "Bearer <token>"
5. inject.js sends token to content-greathire.js via postMessage
6. content-greathire.js sends token to background.js
7. background.js stores in chrome.storage.local
8. Extension popup shows "Logged In" status
9. User can extract from LinkedIn/Naukri/Indeed
10. Extracted profiles sent to backend with stored token
```

## Debugging if Still Not Working

### If token is NOT captured:
1. Make sure you're actually logged in to GreatHire
2. Check DevTools Network tab to see if API calls have Authorization header
3. Look for fetch/XHR requests in Network tab
4. Click a request and check Request Headers → Authorization

### If extension shows "Not Logged In":
1. Make sure Service Worker is receiving the token message
2. Check Service Worker logs for any errors
3. Try manually triggering an API call (refresh page) to capture the token

### If extraction shows "No profiles found":
- Make sure you're on a page with profile data visible
- LinkedIn: Go to https://www.linkedin.com/search/results/people/?keywords=software%20engineer
- Refresh and click extract

## Technical Details

**Token Storage:**
- Backend: Sets as httpOnly cookie (secure, not accessible to JS)
- Extension: Intercepts Authorization header when browser sends it
- Extension Storage: Saved in chrome.storage.local

**Why Not localStorage?**
- GreatHire doesn't store token in localStorage
- Token sent only via httpOnly cookie for security

**Why Interception Works:**
- Even though cookie is httpOnly, JavaScript can still intercept fetch/XHR
- When browser sends request, it includes the Authorization header
- Extension can see this header in the request config

