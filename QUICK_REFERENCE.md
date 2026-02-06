# Quick Reference: New Features

## 🎯 What Changed?

### 1. Viewing Applicant Details Now Costs Credits
- **Cost:** 1 candidate credit per view
- **When:** Clicking "View" button on applicant list
- **Validation:** Must have credits to view details

### 2. Dashboard Shows Real Max Job Posts
- **Before:** Showed "Infinity"
- **Now:** Shows actual number based on credits
- **Formula:** Max Jobs = Credits ÷ 500

---

## 💰 Credit System

### Job Credits
```
1 Job Post = 500 Credits
```

**Examples:**
- 500 credits → 1 job
- 2,500 credits → 5 jobs
- 7,500 credits → 15 jobs

### Candidate Credits
```
1 Applicant View = 1 Credit
```

**Examples:**
- 50 credits → 50 applicant views
- 300 credits → 300 applicant views
- 1,500 credits → 1,500 applicant views

---

## 🔄 User Flow

### Viewing Applicant (With Credits)
```
1. Click "View" button
2. Credit deducted automatically
3. Applicant details shown
4. Dashboard updates
```

### Viewing Applicant (No Credits)
```
1. Click "View" button
2. Error: "Insufficient credits"
3. Redirect to plans page
4. Details NOT shown
```

### Posting Job (With Credits)
```
1. Fill job form
2. Submit job
3. 500 credits deducted
4. Max jobs updated
```

---

## 📊 Dashboard Cards

### Before
```
Max Post Jobs: ∞
```

### After
```
Max Post Jobs: 5
(Based on 2,500 credits)
```

---

## 🧪 Quick Tests

### Test Credit Deduction
```bash
# Check current credits
GET /api/v1/company/company-by-userid

# View applicant
POST /api/v1/company/deduct-candidate-credit
Body: { "companyId": "xxx" }

# Verify credits decreased by 1
```

### Test Max Jobs Display
```bash
# Check credits
Credits: 2,500

# Expected max jobs
Max Jobs: 5 (2,500 ÷ 500)
```

---

## ⚠️ Important Notes

1. **Credits are deducted immediately** when viewing applicant
2. **No refunds** if you close the modal quickly
3. **Dashboard updates in real-time** via Redux
4. **Authorization required** for all credit operations
5. **Minimum 500 credits** needed to post a job

---

## 🐛 Common Issues

### "Insufficient credits" error
**Cause:** No candidate credits available
**Fix:** Purchase a plan with candidate credits

### Max jobs showing 0
**Cause:** Less than 500 job credits
**Fix:** Purchase credits (minimum 500)

### Credits not updating
**Cause:** Redux state not syncing
**Fix:** Refresh page or re-login

---

## 📱 API Quick Reference

### Deduct Credit
```http
POST /api/v1/company/deduct-candidate-credit
Body: { "companyId": "xxx" }
Response: { "success": true, "remainingCredits": 49 }
```

### Get Company
```http
POST /api/v1/company/company-by-userid
Body: { "userId": "xxx" }
Response: { "success": true, "company": {...} }
```

---

## 🎨 UI Changes

### Applicant List
- "View" button → Deducts 1 credit on click
- Error toast if no credits
- Auto-redirect to plans page

### Dashboard
- "Max Post Jobs" card → Shows calculated value
- Updates after job post
- Updates after credit purchase

---

## 🔐 Security

✅ Authorization check before deduction
✅ Credit validation before showing details
✅ Prevents duplicate deductions
✅ Server-side validation

---

## 📈 Credit Usage Examples

### Standard Plan (₹999)
- Job Credits: 2,500 (5 jobs)
- Candidate Credits: 50 (50 views)

**Usage:**
- Post 2 jobs → 1,000 credits used → 3 jobs left
- View 10 applicants → 10 credits used → 40 views left

### Premium Plan (₹2,999)
- Job Credits: 7,500 (15 jobs)
- Candidate Credits: 300 (300 views)

**Usage:**
- Post 5 jobs → 2,500 credits used → 10 jobs left
- View 50 applicants → 50 credits used → 250 views left

---

## 🚀 Next Steps

1. Test credit deduction in dev environment
2. Verify dashboard calculations
3. Check error handling
4. Test with different credit amounts
5. Validate Redux state updates

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Redux DevTools for state
4. Review backend logs for errors
