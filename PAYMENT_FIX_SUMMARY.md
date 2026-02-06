# Payment & Credit System Fix Summary

## Problem
The RecruiterPlans component was allowing users to access job posting features without proper payment verification and credit validation.

## Changes Made

### 1. Frontend - RecruiterPlans.jsx
**Location:** `frontend/src/pages/recruiter/RecruiterPlans.jsx`

#### Added Credit Status Banner
- Shows current job credits and candidate credits
- Displays warning when credits are insufficient (< 500 for job posting)
- Helps recruiters understand their current credit balance

#### Updated handleSubscription Function
**Before:**
```javascript
if (plan.isFree) {
  navigate("/recruiter/dashboard/post-job");
  return;
}
```

**After:**
```javascript
if (plan.isFree) {
  // Check if company has enough credits for free plan
  if (company.creditedForJobs < 500) {
    toast.error("Insufficient credits. Please purchase a plan to post jobs.");
    return;
  }
  navigate("/recruiter/dashboard/post-job");
  return;
}
```

#### Fixed Credit Calculation
Now properly calculates credits based on plan type:
- **Swift Hire (Standard):** 2,500 credits (5 jobs × 500)
- **Growth Engine (Premium):** 7,500 credits (15 jobs × 500)
- **Enterprise Elite:** 999,999 credits (unlimited)

### 2. Backend - JobSubscription Model
**Location:** `BackEnd/models/jobSubscription.model.js`

#### Added Missing Fields
- `razorpayOrderId`: Required for payment tracking
- `paymentStatus`: Tracks payment state (created/paid/failed)
- `paymentDetails`: Stores payment ID and signature after verification

#### Changed Default Status
- Changed from `"Active"` to `"Hold"` 
- Ensures subscriptions are only activated after successful payment

### 3. Existing Validations (Already Working)

#### PostJob Component
**Location:** `frontend/src/pages/recruiter/postJob/PostJob.jsx`
```javascript
useEffect(() => {
  if (company && company?.maxJobPosts === 0 && company?.creditedForJobs < 500)
    navigate("/recruiter/dashboard/your-plans");
}, []);
```
This prevents access to job posting if credits are insufficient.

#### Backend Job Controller
**Location:** `BackEnd/controllers/job.controller.js`
```javascript
if (company.maxJobPosts === 0 && company.creditedForJobs < 500) {
  return res.status(400).json({
    success: false,
    message: "Company needs credits to post jobs.",
  });
}
```
Server-side validation ensures no job can be posted without credits.

## Payment Flow

### 1. User Selects Plan
- User clicks on a plan in RecruiterPlans
- System validates if free plan requires credits
- For paid plans, initiates payment

### 2. Order Creation
- Frontend calls `createOrderForJobPlan` API
- Backend creates Razorpay order
- JobSubscription created with status "Hold"

### 3. Payment Processing
- Razorpay payment modal opens
- User completes payment
- Razorpay returns payment details

### 4. Payment Verification
- Frontend calls `verifyPaymentForJobPlans` API
- Backend verifies signature
- Updates subscription status to "Active"
- Adds credits to company account

### 5. Credit Usage
- Each job posting deducts 500 credits
- System checks credits before allowing job post
- Redirects to plans page if insufficient

## Credit System

### Job Credits
- **1 Job Post = 500 Credits**
- Minimum required: 500 credits
- Deducted automatically on job posting

### Plan Credits
| Plan | Jobs | Credits | Candidate Credits |
|------|------|---------|-------------------|
| Free Launchpad | 2 | 0 (requires purchase) | 0 |
| Standard | 5 | 2,500 | 50 |
| Premium | 15 | 7,500 | 300 |
| Enterprise | Unlimited | 999,999 | 1,500 |

## Security Features

1. **Payment Signature Verification**
   - HMAC-SHA256 signature validation
   - Prevents payment tampering

2. **Authorization Checks**
   - User-company association validation
   - Prevents unauthorized purchases

3. **Credit Validation**
   - Frontend validation (UX)
   - Backend validation (Security)
   - Double-check before job posting

## Testing Checklist

- [ ] Free plan blocks access without credits
- [ ] Paid plans correctly calculate credits
- [ ] Payment verification updates credits
- [ ] Job posting deducts 500 credits
- [ ] Insufficient credits show error
- [ ] Credit banner displays correctly
- [ ] Payment failure doesn't add credits
- [ ] Multiple purchases accumulate credits

## Notes

- Credits are cumulative (new purchases add to existing)
- Expired subscriptions are automatically removed
- Company can have only one active subscription
- Free plan users must purchase credits to post jobs
- **1 Candidate View = 1 Credit deducted** (when viewing applicant details)
- **Max Job Posts = Total Job Credits ÷ 500** (displayed in dashboard)

## New Features Added

### 1. Candidate Credit Deduction
**When:** Recruiter clicks "View" button on applicant details
**Action:** Automatically deducts 1 credit from `creditedForCandidates`
**Validation:** 
- Checks if credits are available before showing details
- Shows error toast if insufficient credits
- Redirects to plans page if no credits

**Files Modified:**
- `frontend/src/pages/recruiter/ApplicantDetails.jsx`
- `BackEnd/controllers/company.controller.js` (added `deductCandidateCredit`)
- `BackEnd/routes/company.route.js`

### 2. Dashboard Max Job Posts Display
**Calculation:** `Math.floor(creditedForJobs / 500)`
**Example:**
- 2,500 credits = 5 jobs
- 7,500 credits = 15 jobs
- 500 credits = 1 job
- 0 credits = 0 jobs

**Files Modified:**
- `frontend/src/pages/recruiter/RecruiterHome.jsx`
