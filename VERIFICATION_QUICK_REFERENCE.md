# Quick Reference - Verification-Based Job Posting

## 🎯 Feature Overview
Allow recruiters to post 1 job before verification, and 2nd job after verification.

---

## 📊 Key Fields

### Company Model
```javascript
{
  isActive: Boolean,        // Admin sets this (verification status)
  freeJobsPosted: Number,   // Auto-incremented (0, 1, or 2)
  creditedForJobs: Number,  // Credits for paid jobs (default: 1000)
  hasUsedFreePlan: Boolean  // Set to true after 2 free jobs
}
```

---

## 🔄 State Flow

| State | isActive | freeJobsPosted | Can Post? | Message |
|-------|----------|----------------|-----------|---------|
| New Company | false | 0 | ✅ Yes | "You can post 1 free job" |
| 1st Job Posted | false | 1 | ❌ No | "Wait for verification" |
| Verified | true | 1 | ✅ Yes | "Post your 2nd free job" |
| 2 Jobs Posted | true | 2 | ⚠️ If credits | "Credits required" |

---

## 🚦 Validation Logic

### Backend (`job.controller.js`)
```javascript
// Block 2nd job before verification
if (!company.isActive && company.freeJobsPosted >= 1) {
  return 400; // "Wait for verification"
}

// Block 3rd job without credits
if (company.freeJobsPosted >= 2 && company.creditedForJobs < 500) {
  return 400; // "Insufficient credits"
}
```

### Frontend (`PostJob.jsx`)
```javascript
// Block form submission
if (!company.isActive && company.freeJobsPosted >= 1) {
  toast.error("Wait for verification");
  return;
}
```

---

## 💳 Credit System

| Job Number | Free? | Credits Deducted | Condition |
|------------|-------|------------------|-----------|
| 1st Job | ✅ Yes | 0 | Always free |
| 2nd Job | ✅ Yes | 0 | Always free |
| 3rd Job+ | ❌ No | 500 | Per job |

---

## 🎨 UI Components

### Banners

**Yellow (Pending Verification)**
```jsx
// RecruiterHome.jsx
{!company.isActive && (
  <YellowBanner>
    Verification Pending: You can post 1 free job
  </YellowBanner>
)}
```

**Red (Blocked)**
```jsx
// PostJob.jsx
{!company.isActive && company.freeJobsPosted >= 1 && (
  <RedBanner>
    1 free job remaining. Post after verification.
  </RedBanner>
)}
```

**Green (Verified)**
```jsx
// PostJob.jsx
{company.isActive && company.freeJobsPosted === 1 && (
  <GreenBanner>
    Verified! Post your remaining free job.
  </GreenBanner>
)}
```

---

## 🔧 API Endpoints

### POST /api/v1/job/post-job
**Request:**
```json
{
  "title": "Job Title",
  "companyId": "xxx",
  // ... other fields
}
```

**Responses:**
```javascript
// Success
201: { success: true, message: "Job posted successfully" }

// Blocked (not verified)
400: { success: false, message: "Wait for verification" }

// Blocked (no credits)
400: { success: false, message: "Insufficient credits" }
```

---

## 🧪 Testing Commands

```bash
# Run migration (ONCE after deployment)
node BackEnd/migrate-free-jobs.js

# Test scenarios
# 1. Create new recruiter
# 2. Post 1st job (should succeed)
# 3. Try 2nd job (should fail)
# 4. Admin verifies company
# 5. Post 2nd job (should succeed)
# 6. Try 3rd job (check credits)
```

---

## 📝 Database Queries

```javascript
// Check company status
db.companies.findOne({ _id: ObjectId("xxx") })

// Update verification manually
db.companies.updateOne(
  { _id: ObjectId("xxx") },
  { $set: { isActive: true } }
)

// Reset free jobs (for testing)
db.companies.updateOne(
  { _id: ObjectId("xxx") },
  { $set: { freeJobsPosted: 0 } }
)
```

---

## 🐛 Common Issues

### Issue: Form not unlocking after verification
**Solution:** Refresh page or check `company.isActive` in database

### Issue: Credits deducted for free jobs
**Solution:** Check `freeJobsPosted < 2` condition in controller

### Issue: Banner not showing
**Solution:** Check `company.isActive` and `company.freeJobsPosted` values

---

## 📞 Support

- Full Documentation: `VERIFICATION_BASED_JOB_POSTING.md`
- Testing Guide: `VERIFICATION_TESTING_GUIDE.md`
- Migration Script: `BackEnd/migrate-free-jobs.js`

---

**Last Updated:** 2024
**Version:** 1.0.0
