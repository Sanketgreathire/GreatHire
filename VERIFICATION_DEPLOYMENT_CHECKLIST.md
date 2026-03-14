# Deployment Checklist - Verification-Based Job Posting

## 📋 Pre-Deployment Checklist

### Code Review
- [ ] All code changes reviewed
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Security checks in place

### Testing
- [ ] Unit tests pass (if applicable)
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Browser compatibility checked

### Documentation
- [ ] Feature documentation created
- [ ] Testing guide prepared
- [ ] Quick reference available
- [ ] README updated
- [ ] Migration script ready

---

## 🚀 Deployment Steps

### Step 1: Backup
```bash
# Backup database
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# Backup code
git tag -a v1.0.0-pre-verification -m "Before verification feature"
git push origin v1.0.0-pre-verification
```
- [ ] Database backed up
- [ ] Code tagged

### Step 2: Deploy Backend
```bash
cd BackEnd
git pull origin main
npm install
npm run build  # if applicable
```
- [ ] Code pulled
- [ ] Dependencies installed
- [ ] Build successful

### Step 3: Run Migration
```bash
cd BackEnd
node migrate-free-jobs.js
```
- [ ] Migration script executed
- [ ] Migration successful
- [ ] Migration logs reviewed

**Expected Output:**
```
🚀 Starting migration: Add freeJobsPosted field...
✅ Connected to database
📊 Found X companies to migrate
✅ Updated company: CompanyName (freeJobsPosted: 0)
...
📈 Migration Summary:
   ✅ Updated: X companies
   ⏭️  Skipped: Y companies
✅ Migration completed successfully!
```

### Step 4: Restart Backend
```bash
# Using PM2
pm2 restart greathire-backend
pm2 logs greathire-backend --lines 50

# Or using systemd
sudo systemctl restart greathire-backend
sudo journalctl -u greathire-backend -n 50
```
- [ ] Backend restarted
- [ ] No errors in logs
- [ ] Health check passed

### Step 5: Deploy Frontend
```bash
cd frontend
git pull origin main
npm install
npm run build
```
- [ ] Code pulled
- [ ] Dependencies installed
- [ ] Build successful

### Step 6: Deploy Frontend Build
```bash
# Copy build to server
scp -r dist/* user@server:/var/www/greathire/

# Or using deployment tool
# npm run deploy
```
- [ ] Build deployed
- [ ] Static files served correctly

---

## ✅ Post-Deployment Verification

### Backend Verification
```bash
# Check server status
curl https://api.greathire.com/health

# Check company endpoint
curl https://api.greathire.com/api/v1/company/xxx
```
- [ ] API responding
- [ ] Company data includes `freeJobsPosted`
- [ ] No 500 errors

### Frontend Verification
```bash
# Check website loads
curl https://greathire.com

# Check static assets
curl https://greathire.com/assets/index.js
```
- [ ] Website loads
- [ ] No console errors
- [ ] Assets loading correctly

### Database Verification
```javascript
// Check migration results
db.companies.findOne({})
// Should have freeJobsPosted field

// Count migrated companies
db.companies.countDocuments({ freeJobsPosted: { $exists: true } })
```
- [ ] All companies have `freeJobsPosted` field
- [ ] Values are correct (0, 1, or 2)

---

## 🧪 Functional Testing

### Test 1: New Recruiter Flow
1. [ ] Create new recruiter account
2. [ ] Complete company registration
3. [ ] Navigate to dashboard
4. [ ] Verify yellow banner shows
5. [ ] Click "Post Job"
6. [ ] Fill and submit job form
7. [ ] Verify job posted successfully
8. [ ] Check `freeJobsPosted = 1` in database

### Test 2: Second Job Blocked
1. [ ] Login as recruiter from Test 1
2. [ ] Navigate to "Post Job"
3. [ ] Verify red banner shows
4. [ ] Verify form is locked
5. [ ] Try to submit (should fail)

### Test 3: Admin Verification
1. [ ] Login as admin
2. [ ] Find company from Test 1
3. [ ] Set `isActive = true`
4. [ ] Save changes

### Test 4: Second Job After Verification
1. [ ] Login as recruiter from Test 1
2. [ ] Navigate to "Post Job"
3. [ ] Verify green banner shows
4. [ ] Fill and submit job form
5. [ ] Verify job posted successfully
6. [ ] Check `freeJobsPosted = 2` in database

### Test 5: Third Job (Credit Check)
1. [ ] Login as recruiter from Test 1
2. [ ] Navigate to "Post Job"
3. [ ] Fill and submit job form
4. [ ] If credits < 500: Verify redirect to upgrade
5. [ ] If credits >= 500: Verify job posted and credits deducted

---

## 📊 Monitoring

### Metrics to Watch
- [ ] Job posting success rate
- [ ] Error rate on job posting endpoint
- [ ] Average time to verification
- [ ] Free job usage rate
- [ ] Credit purchase rate

### Logs to Monitor
```bash
# Backend logs
pm2 logs greathire-backend --lines 100

# Look for:
# - "Job posted successfully"
# - "Wait for verification"
# - "Insufficient credits"
# - Any error messages
```

### Database Queries
```javascript
// Companies waiting for verification
db.companies.find({ 
  isActive: false, 
  freeJobsPosted: 1 
}).count()

// Companies that used both free jobs
db.companies.find({ 
  freeJobsPosted: 2 
}).count()

// Average freeJobsPosted
db.companies.aggregate([
  { $group: { 
    _id: null, 
    avg: { $avg: "$freeJobsPosted" } 
  }}
])
```

---

## 🐛 Rollback Procedure

### If Critical Issues Found

#### Quick Rollback (Git)
```bash
# Backend
cd BackEnd
git revert HEAD
git push
pm2 restart greathire-backend

# Frontend
cd frontend
git revert HEAD
npm run build
# Deploy build
```

#### Database Rollback (if needed)
```javascript
// Remove freeJobsPosted field
db.companies.updateMany(
  {},
  { $unset: { freeJobsPosted: "" } }
)

// Restore from backup
mongorestore --uri="mongodb://..." /backup/YYYYMMDD
```

#### Restore Previous Version
```bash
# Restore tagged version
git checkout v1.0.0-pre-verification
npm install
npm run build
# Deploy
```

- [ ] Rollback executed
- [ ] Services restarted
- [ ] Functionality verified

---

## 📞 Communication

### Stakeholders to Notify
- [ ] Development team
- [ ] QA team
- [ ] Product manager
- [ ] Customer support
- [ ] Admin users

### Notification Template
```
Subject: New Feature Deployed - Verification-Based Job Posting

Hi Team,

We've deployed a new feature: Verification-Based Job Posting

Key Changes:
- Recruiters can now post 1 job before verification
- 2nd job unlocks after admin verification
- Clear status messages throughout the flow

What to Watch:
- New recruiter onboarding
- Job posting success rate
- Verification requests

Documentation:
- Full Guide: VERIFICATION_BASED_JOB_POSTING.md
- Testing: VERIFICATION_TESTING_GUIDE.md
- Quick Ref: VERIFICATION_QUICK_REFERENCE.md

Please report any issues immediately.

Thanks!
```

---

## 📝 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Verify metrics
- [ ] Test critical paths
- [ ] Update status page

### Short-term (Week 1)
- [ ] Analyze usage patterns
- [ ] Gather user feedback
- [ ] Fix minor issues
- [ ] Update documentation
- [ ] Train support team

### Long-term (Month 1)
- [ ] Review metrics
- [ ] Plan improvements
- [ ] Optimize performance
- [ ] Consider enhancements

---

## ✅ Sign-off

### Development Team
- [ ] Code deployed successfully
- [ ] Tests passing
- [ ] No critical issues

**Signed:** _________________ Date: _________

### QA Team
- [ ] All test scenarios passed
- [ ] No blocking issues found
- [ ] Ready for production

**Signed:** _________________ Date: _________

### Product Manager
- [ ] Feature meets requirements
- [ ] User experience validated
- [ ] Approved for release

**Signed:** _________________ Date: _________

---

## 📊 Success Criteria

- [ ] Zero critical bugs in first 24 hours
- [ ] Job posting success rate > 95%
- [ ] No increase in error rate
- [ ] Positive user feedback
- [ ] All metrics within expected range

---

## 🎉 Deployment Complete!

**Deployment Date:** __________
**Deployment Time:** __________
**Deployed By:** __________
**Status:** ✅ Success / ❌ Failed / ⚠️ Partial

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Checklist Version:** 1.0.0
**Last Updated:** 2024
