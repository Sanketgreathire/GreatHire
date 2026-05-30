# Quick Fix for SourcingPage.jsx

## Issue
Your frontend sends `url` but backend expects `githubUrl` and `linkedinUrl`.

## Fix

### In `GithubImportTab` function, line ~180:
**Change:**
```javascript
const { data } = await axios.post(
  `${INGESTION_API}/import-github`,
  { url: url.trim() },  // ❌ WRONG
  { withCredentials: true }
);
```

**To:**
```javascript
const { data } = await axios.post(
  `${INGESTION_API}/import-github`,
  { githubUrl: url.trim() },  // ✅ CORRECT
  { withCredentials: true }
);
```

### In `LinkedinImportTab` function, line ~240:
**Change:**
```javascript
const { data } = await axios.post(
  `${INGESTION_API}/import-linkedin`,
  { url: url.trim() },  // ❌ WRONG
  { withCredentials: true }
);
```

**To:**
```javascript
const { data } = await axios.post(
  `${INGESTION_API}/import-linkedin`,
  { linkedinUrl: url.trim() },  // ✅ CORRECT
  { withCredentials: true }
);
```

---

## Summary

✅ **What's working:**
- Resume upload (already working)
- CSV import (backend ready)
- Manual entry (backend ready)
- Search & AI search (already working)
- Admin view (already working)

🔧 **What needs the fix above:**
- GitHub import (parameter name mismatch)
- LinkedIn import (parameter name mismatch)

After this fix, ALL 5 import methods will work perfectly!

---

## How to Test After Fix

1. **Resume Upload:** Upload a PDF → should parse and show candidate
2. **CSV Import:** Upload CSV with columns: `name, email, phone, skills, location, designation, experience`
3. **GitHub Import:** Enter `https://github.com/username` → fetches profile
4. **LinkedIn Import:** Enter `https://linkedin.com/in/username` → fetches profile
5. **Manual Entry:** Fill form → adds candidate

All candidates will appear in the search results and admin can see them in `/admin/ai-sourcing`.
