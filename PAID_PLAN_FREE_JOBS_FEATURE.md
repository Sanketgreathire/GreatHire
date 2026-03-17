# Paid Plan Free Jobs Feature

## Overview
This feature enhances the recruiter plan system so that paid users also get 2 free monthly job posts in addition to their paid plan benefits. Both free and paid job posts are counted together in the maximum allowed job posts.

## How It Works

### For Paid Plan Users
When a recruiter purchases any paid plan (STANDARD, PREMIUM, or ENTERPRISE), they receive:
- All features of their selected paid plan
- **PLUS** 2 free job posts per month (launchpad/free quota)

### Job Post Limits
The total job posting limit is calculated as:
```
Total Allowed = Paid Plan Limit + 2 Free Jobs
```

Examples:
- STANDARD (5 jobs) + 2 free = **7 total jobs per month**
- PREMIUM (15 jobs) + 2 free = **17 total jobs per month**  
- ENTERPRISE (unlimited) + 2 free = **Unlimited jobs per month**

### Consumption Logic
The system consumes job posts in this order:
1. **Free jobs first** (2 free jobs per month)
2. **Paid plan jobs** (after free jobs are exhausted)

This ensures users get maximum value from their free allocation.

### Reset Logic
- **Free jobs**: Reset every month (same as existing free plan)
- **Paid plan limits**: Follow existing validity rules (no changes)

## Technical Implementation

### Database Changes
Added new fields to Company model:
```javascript
paidPlanFreeJobsPosted: {
  type: Number,
  default: 0, // Track free jobs posted by paid plan users this month
},
paidPlanFreeJobsRenewal: {
  type: Date,
  default: null, // Track when paid plan free jobs were last renewed
},
```

### Key Files Modified
1. **models/company.model.js** - Added tracking fields
2. **controllers/job.controller.js** - Updated job posting limits and consumption logic
3. **controllers/verification.controller.js** - Initialize free jobs tracking on payment
4. **utils/monthlyFreePlanRenewal.js** - Added monthly reset for paid plan free jobs
5. **models/jobSubscription.model.js** - Reset fields when subscription expires

### Job Posting Flow
1. Check if user is verified (existing logic)
2. For paid plans:
   - Reset monthly counters if new month
   - Calculate total jobs posted (paid + free)
   - Check against total allowed limit (paid limit + 2 free)
   - Consume free jobs first, then paid jobs
3. Update appropriate counter based on consumption logic

## Migration

### Required Migration
Run this command ONCE after deploying the new code:
```bash
node BackEnd/migrate-paid-plan-free-jobs.js
```

This initializes the new tracking fields for existing companies.

### Testing
Test the implementation:
```bash
node BackEnd/test-paid-plan-free-jobs.js
```

## Benefits

### For Users
- **More Value**: Paid plan users get extra job posts at no additional cost
- **Seamless Experience**: Free jobs are consumed automatically first
- **Clear Limits**: Transparent total job posting limits

### For Business
- **Competitive Advantage**: More generous limits than competitors
- **User Retention**: Additional value encourages plan upgrades
- **Fair Usage**: Free jobs reset monthly to prevent abuse

## Examples

### STANDARD Plan User
- **Month Start**: 0 paid jobs, 0 free jobs used
- **After 3 jobs**: 0 paid jobs, 2 free jobs used, 1 paid job used
- **Limit Check**: 3/7 total jobs used (5 paid + 2 free)
- **Next Month**: Resets to 0 paid jobs, 0 free jobs used

### PREMIUM Plan User  
- **Month Start**: 0 paid jobs, 0 free jobs used
- **After 10 jobs**: 0 paid jobs, 2 free jobs used, 8 paid jobs used
- **Limit Check**: 10/17 total jobs used (15 paid + 2 free)
- **Remaining**: 7 more jobs available (all paid)

## Monitoring

### Key Metrics to Track
- `paidPlanFreeJobsPosted` - Free jobs used by paid plan users
- `planJobsPostedThisMonth` - Paid jobs used this month
- Total consumption rate across different plans
- Monthly reset effectiveness

### Logs to Monitor
- Monthly renewal process logs
- Job posting limit checks
- Payment verification initialization

## Backward Compatibility
- ✅ Existing free plan users: No changes
- ✅ Existing paid plan users: Automatically get free jobs
- ✅ Existing job posting logic: Enhanced, not replaced
- ✅ Admin panel: Works with existing subscription management

## Support
For any issues or questions about this feature, check:
1. Migration logs for initialization issues
2. Monthly renewal cron job logs
3. Job posting controller logs for limit checks
4. Payment verification logs for new subscriptions