# Quick Testing Guide - Verification-Based Job Posting

## Test Scenarios

### Scenario 1: New Recruiter - First Job Post
**Steps:**
1. Create new recruiter account
2. Complete company registration
3. Navigate to Dashboard
4. Check verification banner shows: "You can post 1 free job"
5. Click "Post Job"
6. Fill job details and submit
7. Verify job posted successfully
8. Check `freeJobsPosted = 1` in database

**Expected Result:** ✅ Job posted successfully without verification

---

### Scenario 2: Try to Post Second Job (Not Verified)
**Steps:**
1. After posting first job (from Scenario 1)
2. Navigate to "Post Job" page
3. Check red banner shows: "1 free job remaining. This job can be posted after verification"
4. Verify form is locked with message
5. Try to submit form (should be blocked)

**Expected Result:** ❌ Form is locked, cannot post second job

---

### Scenario 3: Admin Verifies Company
**Steps:**
1. Login as admin
2. Find the company in admin panel
3. Set `isActive = true`
4. Save changes

**Expected Result:** ✅ Company verified

---

### Scenario 4: Post Second Job After Verification
**Steps:**
1. Login as recruiter (same account from Scenario 1)
2. Navigate to Dashboard
3. Check verification banner is removed or updated
4. Navigate to "Post Job"
5. Check green banner shows: "Verified! You can now post your remaining free job"
6. Fill job details and submit
7. Verify job posted successfully
8. Check `freeJobsPosted = 2` in database

**Expected Result:** ✅ Second job posted successfully

---

### Scenario 5: Try to Post Third Job (No Credits)
**Steps:**
1. After posting 2 free jobs
2. Navigate to "Post Job"
3. Fill job details and submit
4. Check error message

**Expected Result:** ❌ Redirected to upgrade plans page with message: "Insufficient credits"

---

### Scenario 6: Post Third Job (With Credits)
**Steps:**
1. Ensure company has `creditedForJobs >= 500`
2. Navigate to "Post Job"
3. Fill job details and submit
4. Verify job posted successfully
5. Check `creditedForJobs` reduced by 500

**Expected Result:** ✅ Job posted, credits deducted

---

## Database Checks

### Check Company Document
```javascript
// MongoDB query
db.companies.findOne({ _id: ObjectId("COMPANY_ID") })

// Expected fields:
{
  isActive: false,        // Before verification
  freeJobsPosted: 0,      // Initially
  creditedForJobs: 1000,  // Default
  hasUsedFreePlan: false  // Initially
}
```

### After First Job
```javascript
{
  isActive: false,
  freeJobsPosted: 1,      // ✅ Incremented
  creditedForJobs: 1000,  // ✅ Not deducted
  hasUsedFreePlan: false
}
```

### After Verification
```javascript
{
  isActive: true,         // ✅ Admin verified
  freeJobsPosted: 1,
  creditedForJobs: 1000,
  hasUsedFreePlan: false
}
```

### After Second Job
```javascript
{
  isActive: true,
  freeJobsPosted: 2,      // ✅ Incremented
  creditedForJobs: 1000,  // ✅ Still not deducted
  hasUsedFreePlan: true   // ✅ Marked as used
}
```

### After Third Job
```javascript
{
  isActive: true,
  freeJobsPosted: 2,      // ✅ Stays at 2
  creditedForJobs: 500,   // ✅ Deducted 500
  hasUsedFreePlan: true
}
```

---

## UI Checks

### Dashboard (RecruiterHome)
- [ ] Verification banner shows when `isActive = false`
- [ ] Banner message changes based on `freeJobsPosted`
- [ ] "Max Post Jobs" card shows correct count
- [ ] No blocking message when company exists

### Post Job Page
- [ ] Red banner shows when blocked (not verified + 1 job posted)
- [ ] Green banner shows after verification (1 job posted)
- [ ] Form locks when posting is blocked
- [ ] Credit display shows free jobs correctly
- [ ] Submit button disabled when blocked

---

## API Testing

### Test POST /api/v1/job/post-job

**Test 1: First Job (Not Verified)**
```bash
# Should succeed
POST /api/v1/job/post-job
Body: { ...jobData, companyId: "xxx" }
Expected: 201 Created
```

**Test 2: Second Job (Not Verified)**
```bash
# Should fail
POST /api/v1/job/post-job
Body: { ...jobData, companyId: "xxx" }
Expected: 400 Bad Request
Message: "You have posted your free job. Please wait for admin verification"
```

**Test 3: Second Job (Verified)**
```bash
# Should succeed
POST /api/v1/job/post-job
Body: { ...jobData, companyId: "xxx" }
Expected: 201 Created
```

**Test 4: Third Job (No Credits)**
```bash
# Should fail
POST /api/v1/job/post-job
Body: { ...jobData, companyId: "xxx" }
Expected: 400 Bad Request
Message: "Insufficient credits to post jobs"
```

---

## Edge Cases

### Edge Case 1: Direct API Call (Bypass UI)
- Try posting 2nd job via API when not verified
- Should be blocked by backend validation

### Edge Case 2: Multiple Tabs
- Open Post Job in 2 tabs
- Post job in tab 1
- Try to post in tab 2
- Should show updated state

### Edge Case 3: Admin Changes Verification Mid-Session
- Recruiter on Post Job page (blocked)
- Admin verifies company
- Recruiter refreshes page
- Should now be able to post

---

## Rollback Plan

If issues occur:
1. Revert backend changes in `job.controller.js`
2. Revert frontend changes in `RecruiterHome.jsx` and `PostJob.jsx`
3. Remove `freeJobsPosted` field from company model
4. Restart backend server
5. Clear browser cache

---

## Success Criteria

✅ All 6 scenarios pass
✅ Database updates correctly
✅ UI shows correct messages
✅ API validation works
✅ No existing functionality broken
✅ User experience is smooth

---

**Last Updated:** 2024
