# Payment System Testing Guide

## Quick Test Scenarios

### Scenario 1: Free Plan Without Credits
**Expected:** User should be blocked from posting jobs

1. Login as recruiter
2. Navigate to Plans page
3. Check credit banner shows 0 credits
4. Click "Start Free" on Free Launchpad plan
5. **Expected Result:** Toast error "Insufficient credits. Please purchase a plan to post jobs."
6. User should NOT be redirected to post-job page

### Scenario 2: Purchase Standard Plan
**Expected:** Credits should be added after successful payment

1. Login as recruiter
2. Navigate to Plans page
3. Click "Upgrade Now" on Standard plan
4. Complete Razorpay payment (use test mode)
5. **Expected Result:** 
   - Toast success "Payment Successful"
   - Redirect to post-job page
   - Credit banner shows 2,500 job credits
   - Credit banner shows 50 candidate credits

### Scenario 3: Post Job With Credits
**Expected:** Job should post and credits should decrease

1. Ensure company has >= 500 credits
2. Navigate to post-job page
3. Fill all job details
4. Submit job
5. **Expected Result:**
   - Job posted successfully
   - Credits reduced by 500
   - Redirect to dashboard

### Scenario 4: Post Job Without Credits
**Expected:** User should be redirected to plans page

1. Ensure company has < 500 credits
2. Try to navigate to post-job page
3. **Expected Result:**
   - Automatic redirect to plans page
   - Cannot access post-job form

### Scenario 5: Multiple Purchases
**Expected:** Credits should accumulate

1. Purchase Standard plan (2,500 credits)
2. Purchase another Standard plan
3. **Expected Result:**
   - Total credits = 5,000
   - Both purchases recorded in database

## API Testing with Postman/Thunder Client

### Test 1: Create Order
```http
POST /api/v1/order/create-order-for-jobplan
Content-Type: application/json

{
  "planName": "Standard",
  "companyId": "YOUR_COMPANY_ID",
  "amount": 999,
  "creditsForJobs": 2500,
  "creditsForCandidates": 50
}
```

**Expected Response:**
```json
{
  "success": true,
  "orderId": "order_xxxxx",
  "amount": 99900,
  "currency": "INR"
}
```

### Test 2: Verify Payment
```http
POST /api/v1/verification/verify-payment-for-jobplan
Content-Type: application/json

{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "creditsForJobs": 2500,
  "creditsForCandidates": 50,
  "companyId": "YOUR_COMPANY_ID"
}
```

**Expected Response:**
```json
{
  "success": true,
  "plan": {
    "credits": {...},
    "expiryDate": "...",
    "planName": "Standard",
    "price": 999,
    "status": "Active"
  },
  "message": "Payment verified successfully"
}
```

### Test 3: Post Job
```http
POST /api/v1/job/post-job
Content-Type: application/json

{
  "companyId": "YOUR_COMPANY_ID",
  "title": "Test Job",
  "details": "Job description",
  "experience": "1-2 years",
  "salary": "50000",
  "jobType": "Full-Time",
  "location": "Hyderabad",
  "numberOfOpening": "1",
  "respondTime": "2",
  "duration": "Monday to Friday",
  "anyAmount": "No",
  "urgentHiring": "No",
  "skills": "JavaScript, React",
  "benefits": "Health Insurance",
  "qualifications": "Bachelor's Degree"
}
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Job posted successfully."
}
```

**Expected Response (Insufficient Credits):**
```json
{
  "success": false,
  "message": "Company needs credits to post jobs."
}
```

## Database Verification

### Check Company Credits
```javascript
db.companies.findOne({ _id: ObjectId("YOUR_COMPANY_ID") })
```

**Expected Fields:**
- `creditedForJobs`: Should show current job credits
- `creditedForCandidates`: Should show current candidate credits

### Check Job Subscription
```javascript
db.jobsubscriptions.find({ company: ObjectId("YOUR_COMPANY_ID") })
```

**Expected Fields:**
- `status`: "Active" after payment
- `paymentStatus`: "paid" after verification
- `razorpayOrderId`: Should match order ID
- `paymentDetails.paymentId`: Should exist after payment

## Common Issues & Solutions

### Issue 1: Payment verified but credits not added
**Solution:** Check verification controller logs, ensure signature validation passed

### Issue 2: Free plan allows job posting without credits
**Solution:** Verify PostJob component useEffect is running, check company.creditedForJobs value

### Issue 3: Credits not deducting after job post
**Solution:** Check job.controller.js postJob function, ensure credit deduction logic executes

### Issue 4: Multiple active subscriptions
**Solution:** Verification controller should delete expired subscriptions before activating new one

## Razorpay Test Credentials

### Test Card Numbers
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002

### Test Details
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **OTP:** 1234 (for 3D Secure)

## Monitoring Points

1. **Frontend Console**
   - Check for API call logs
   - Verify Redux state updates
   - Monitor toast notifications

2. **Backend Logs**
   - Payment verification logs
   - Credit update logs
   - Job posting logs

3. **Database**
   - Company credits field
   - JobSubscription status
   - Job documents count

## Success Criteria

✅ Free plan blocks without credits
✅ Payment adds correct credits
✅ Job posting deducts 500 credits
✅ Insufficient credits show error
✅ Credit banner updates in real-time
✅ Multiple purchases accumulate
✅ Payment failure doesn't add credits
✅ Expired subscriptions removed
