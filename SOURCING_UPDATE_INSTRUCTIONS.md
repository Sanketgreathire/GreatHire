# SourcingPage Update Instructions

## Current Status
Your current `SourcingPage.jsx` only has Resume Upload (the old version).

You pasted the NEW complete tabbed version with all 5 import methods in the chat.

## What to Do

1. **Replace the entire `SourcingPage.jsx` file** with the code you pasted (the one with tabs)

2. **After replacing, make these 2 fixes:**

### Fix 1: GitHub Import (around line 180)
Find this line in `GithubImportTab`:
```javascript
{ url: url.trim() },
```

Change to:
```javascript
{ githubUrl: url.trim() },
```

### Fix 2: LinkedIn Import (around line 240)  
Find this line in `LinkedinImportTab`:
```javascript
{ url: url.trim() },
```

Change to:
```javascript
{ linkedinUrl: url.trim() },
```

## Why These Fixes?
The backend expects:
- `githubUrl` (not `url`) for GitHub import
- `linkedinUrl` (not `url`) for LinkedIn import

## After Fixing
All 5 import methods will work:
✅ Resume Upload
✅ CSV Import  
✅ GitHub Import
✅ LinkedIn Import
✅ Manual Entry

Plus search, AI search, stats panel, and admin view all working!
