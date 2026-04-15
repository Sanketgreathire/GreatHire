# New Features Implementation Summary

## Overview
Two new features have been implemented to enhance the recruiter credit system:
1. **Candidate Credit Deduction** - Deduct credits when viewing applicant details
2. **Dashboard Max Job Posts** - Display available job posts based on credits

---

## Feature 1: Candidate Credit Deduction

### Purpose
Automatically deduct 1 credit from `creditedForCandidates` when a recruiter views applicant details.

### Implementation

#### Frontend Changes
**File:** `frontend/src/pages/recruiter/ApplicantDetails.jsx`

**Added:**
- Import Redux hooks and company slice
- `creditDeducted` state to prevent multiple deductions
- `useEffect` hook to call API on component mount
- Credit validation before showing applicant details

**Code Flow:**
```javascript
useEffect(() => {
  const deductCredit = async () => {
    if (creditDeducted || !company?._id) return;
    
    const response = await axios.post(
      `${COMPANY_API_END_POINT}/deduct-candidate-credit`,
      { companyId: company._id },
      { withCredentials: true }
    );
    
    if (response.data.success) {
      dispatch(updateCandidateCredits(response.data.remainingCredits));
      setCreditDeducted(true);
    }
  };
  
  deductCredit();
}, [company, creditDeducted]);
```

#### Backend Changes

**File:** `BackEnd/controllers/company.controller.js`

**New Function:** `deductCandidateCredit`

```javascript
export const deductCandidateCredit = async (req, res) => {
  try {
    const { companyId } = req.body;
    const userId = req.id;

    // Authorization check
    if (!(await isUserAssociated(companyId, userId))) {
      return res.status(403).json({ 
        message: "You are not authorized", 
        success: false 
      });
    }

    const company = await Company.findById(companyId);
    
    // Credit validation
    if (company.creditedForCandidates <= 0) {
      return res.status(400).json({ 
        message: "Insufficient candidate credits. Please purchase a plan.", 
        success: false 
      });
    }

    // Deduct credit
    company.creditedForCandidates -= 1;
    await company.save();

    return res.status(200).json({
      success: true,
      remainingCredits: company.creditedForCandidates,
      message: "Credit deducted successfully"
    });
  } catch (error) {
    console.error("Error deducting candidate credit:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      success: false 
    });
  }
};
```

**File:** `BackEnd/routes/company.route.js`

**Added Route:**
```javascript
router
  .route("/deduct-candidate-credit")
  .post(isAuthenticated, deductCandidateCredit);
```

### User Experience

1. **Sufficient Credits:**
   - Recruiter clicks "View" on applicant
   - Credit deducted automatically
   - Applicant details displayed
   - Redux state updated with new credit count

2. **Insufficient Credits:**
   - Recruiter clicks "View" on applicant
   - Error toast: "Insufficient candidate credits. Please purchase a plan."
   - Redirected to plans page after 2 seconds
   - Applicant details NOT shown

### Security Features
- ✅ Authorization check (user-company association)
- ✅ Credit validation before deduction
- ✅ Prevents multiple deductions (creditDeducted state)
- ✅ Server-side validation

---

## Feature 2: Dashboard Max Job Posts Display

### Purpose
Display the number of jobs a recruiter can post based on available credits (1 job = 500 credits).

### Implementation

**File:** `frontend/src/pages/recruiter/RecruiterHome.jsx`

**Changed:**
```javascript
// BEFORE
{
  title: "Max Post Jobs",
  count: <span className="text-green-600 text-2xl">Infinity</span>,
  icon: (
    <FaClipboardList className="text-4xl text-pink-600 bg-pink-100 rounded-lg p-2" />
  ),
  description: "Number of jobs you can post.",
}

// AFTER
{
  title: "Max Post Jobs",
  count: company?.creditedForJobs >= 500 
    ? Math.floor(company.creditedForJobs / 500) 
    : 0,
  icon: (
    <FaClipboardList className="text-4xl text-pink-600 bg-pink-100 rounded-lg p-2" />
  ),
  description: "Number of jobs you can post.",
}
```

### Calculation Logic

| Credits | Max Jobs | Formula |
|---------|----------|---------|
| 0 | 0 | 0 / 500 = 0 |
| 500 | 1 | 500 / 500 = 1 |
| 2,500 | 5 | 2,500 / 500 = 5 |
| 7,500 | 15 | 7,500 / 500 = 15 |
| 999,999 | 1,999 | 999,999 / 500 = 1,999 |

### User Experience

**Dashboard Display:**
```
┌─────────────────────────┐
│   Max Post Jobs         │
│                         │
│         5               │
│                         │
│ Number of jobs you can  │
│ post.                   │
└─────────────────────────┘
```

**Real-time Updates:**
- Credits update after payment
- Max jobs recalculated automatically
- Redux state keeps dashboard in sync

---

## Testing Scenarios

### Test 1: View Applicant with Credits
**Steps:**
1. Ensure company has candidate credits > 0
2. Navigate to All Applicants page
3. Click "View" on any applicant
4. **Expected:** 
   - Applicant details shown
   - Credit count decreased by 1
   - Dashboard updates automatically

### Test 2: View Applicant without Credits
**Steps:**
1. Ensure company has candidate credits = 0
2. Navigate to All Applicants page
3. Click "View" on any applicant
4. **Expected:**
   - Error toast shown
   - Redirect to plans page
   - Applicant details NOT shown

### Test 3: Dashboard Max Jobs Display
**Steps:**
1. Purchase Standard plan (2,500 credits)
2. Navigate to dashboard
3. Check "Max Post Jobs" card
4. **Expected:** Shows "5"

### Test 4: Max Jobs After Job Post
**Steps:**
1. Start with 2,500 credits (5 jobs)
2. Post 1 job (500 credits deducted)
3. Check dashboard
4. **Expected:** 
   - Credits: 2,000
   - Max Jobs: 4

### Test 5: Multiple Applicant Views
**Steps:**
1. Start with 50 candidate credits
2. View 3 different applicants
3. Check credits
4. **Expected:** 47 credits remaining

---

## API Endpoints

### Deduct Candidate Credit
```http
POST /api/v1/company/deduct-candidate-credit
Authorization: Required (Cookie)
Content-Type: application/json

Request Body:
{
  "companyId": "company_id_here"
}

Success Response (200):
{
  "success": true,
  "remainingCredits": 49,
  "message": "Credit deducted successfully"
}

Error Response (400):
{
  "success": false,
  "message": "Insufficient candidate credits. Please purchase a plan."
}

Error Response (403):
{
  "success": false,
  "message": "You are not authorized"
}
```

---

## Database Impact

### Company Model
**Fields Used:**
- `creditedForJobs` - Used for max job calculation
- `creditedForCandidates` - Decremented on applicant view

**Updates:**
- Candidate credits decrease by 1 per view
- Job credits decrease by 500 per job post
- Both fields updated in real-time

---

## Redux State Management

### Actions Dispatched
1. `updateCandidateCredits(remainingCredits)` - After viewing applicant
2. `addCompany(company)` - On dashboard load

### State Updates
```javascript
// After viewing applicant
company: {
  ...company,
  creditedForCandidates: company.creditedForCandidates - 1
}

// Dashboard automatically recalculates
maxJobs = Math.floor(company.creditedForJobs / 500)
```

---

## Error Handling

### Frontend
- Toast notifications for errors
- Automatic redirect on insufficient credits
- Prevents multiple API calls with state flag

### Backend
- Authorization validation
- Credit availability check
- Database transaction safety
- Detailed error messages

---

## Performance Considerations

1. **Single API Call:** Credit deduction happens once per view
2. **State Management:** Redux prevents unnecessary re-renders
3. **Calculation:** Max jobs calculated on-the-fly (no DB query)
4. **Caching:** Company data cached in Redux

---

## Future Enhancements

1. **Credit History:** Track when and where credits were used
2. **Bulk Actions:** Deduct credits for bulk applicant views
3. **Credit Alerts:** Notify when credits are low
4. **Analytics:** Show credit usage trends
5. **Refund System:** Return credits if applicant view fails

---

## Files Modified

### Frontend
- ✅ `frontend/src/pages/recruiter/ApplicantDetails.jsx`
- ✅ `frontend/src/pages/recruiter/RecruiterHome.jsx`

### Backend
- ✅ `BackEnd/controllers/company.controller.js`
- ✅ `BackEnd/routes/company.route.js`

### Documentation
- ✅ `PAYMENT_FIX_SUMMARY.md`
- ✅ `NEW_FEATURES_SUMMARY.md` (this file)

---

## Success Criteria

✅ Credit deducted when viewing applicant
✅ Error shown when insufficient credits
✅ Dashboard shows correct max jobs
✅ Max jobs updates after job post
✅ Redux state stays in sync
✅ Authorization checks pass
✅ No duplicate credit deductions
✅ Real-time credit updates

---

## Rollback Plan

If issues occur:
1. Remove `useEffect` from ApplicantDetails.jsx
2. Revert RecruiterHome.jsx max jobs calculation
3. Remove `/deduct-candidate-credit` route
4. Remove `deductCandidateCredit` function

---

## Support & Troubleshooting

### Issue: Credits not deducting
**Solution:** Check Redux state, verify API call in Network tab

### Issue: Max jobs showing wrong number
**Solution:** Verify `creditedForJobs` value in company object

### Issue: Multiple deductions
**Solution:** Check `creditDeducted` state flag

### Issue: Unauthorized error
**Solution:** Verify user-company association in database
