# Auto-Reject Feature - Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Environment Configuration
- [ ] Verify `.env` file has `AUTO_REJECT_DAYS=30` (or your preferred value)
- [ ] Confirm `EMAIL_USER` is set correctly
- [ ] Confirm `EMAIL_PASS` is set correctly
- [ ] Test email credentials work

### ✅ Code Verification
- [ ] All new files are committed to repository
- [ ] Modified files are committed
- [ ] No syntax errors in code
- [ ] Dependencies are installed (`npm install`)

### ✅ Testing (Development)
- [ ] Run `npm run test:email` - Email sends successfully
- [ ] Run `npm run backdate:applications` - Creates test data
- [ ] Run `npm run test:auto-reject` - Auto-reject works
- [ ] Check MongoDB - Application status changed to "Rejected"
- [ ] Check email inbox - Rejection email received
- [ ] Check notifications collection - Notification created
- [ ] Test manual trigger API endpoint

### ✅ Server Configuration
- [ ] Server can run continuously (not just during development)
- [ ] Cron job initializes on server start
- [ ] Server timezone is correct (affects 2 AM schedule)
- [ ] Logs are being captured/monitored

---

## 🚀 Deployment Steps

### Step 1: Backup
```bash
# Backup database before deployment
mongodump --uri="your-mongodb-uri" --out=backup-$(date +%Y%m%d)
```

### Step 2: Deploy Code
```bash
# Pull latest code
git pull origin main

# Install dependencies
cd BackEnd
npm install

# Verify environment variables
cat .env | grep AUTO_REJECT_DAYS
cat .env | grep EMAIL_USER
```

### Step 3: Start Server
```bash
# Start the server
npm run dev

# Or for production with PM2
pm2 start index.js --name greathire-backend
pm2 save
```

### Step 4: Verify Deployment
```bash
# Check server logs
pm2 logs greathire-backend

# Look for these messages:
# ✅ Auto-reject cron job scheduled
# ✅ Server running on port 8000
```

---

## 🧪 Post-Deployment Testing

### Immediate Tests (Within 5 minutes)
- [ ] Server is running without errors
- [ ] Cron job initialization message appears in logs
- [ ] API endpoints are accessible
- [ ] Test manual trigger endpoint works

### Short-term Tests (Within 24 hours)
- [ ] Wait for cron job to run at 2 AM
- [ ] Check logs next morning for execution
- [ ] Verify any old applications were processed
- [ ] Confirm emails were sent (if applicable)
- [ ] Check notification system works

### Long-term Monitoring (First week)
- [ ] Monitor daily cron execution
- [ ] Check email delivery rates
- [ ] Review any error logs
- [ ] Verify candidate feedback (if any)
- [ ] Monitor database performance

---

## 📊 Monitoring Setup

### Log Monitoring
```bash
# Watch logs in real-time
pm2 logs greathire-backend --lines 100

# Filter for auto-reject logs
pm2 logs greathire-backend | grep "auto-reject"

# Check for errors
pm2 logs greathire-backend | grep "ERROR"
```

### Database Monitoring
```javascript
// MongoDB query to check recent rejections
db.applications.find({
  status: "Rejected",
  updatedAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
}).count()

// Check notifications created
db.notifications.find({
  type: "application-status-changed",
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
}).count()
```

### Email Monitoring
- [ ] Set up email delivery monitoring
- [ ] Check bounce rates
- [ ] Monitor spam complaints
- [ ] Track open rates (optional)

---

## 🔧 Configuration Adjustments

### If Rejection Period Needs Changing
```bash
# Edit .env file
nano BackEnd/.env

# Change this line:
AUTO_REJECT_DAYS=30  # Change to desired number

# Restart server
pm2 restart greathire-backend
```

### If Cron Schedule Needs Changing
```bash
# Edit the cron file
nano BackEnd/utils/autoRejectApplications.js

# Find this line (around line 48):
cron.schedule("0 2 * * *", async () => {

# Change to desired schedule
# Examples:
# "0 3 * * *"     - 3 AM daily
# "0 */6 * * *"   - Every 6 hours
# "0 9 * * 1"     - Every Monday at 9 AM

# Restart server
pm2 restart greathire-backend
```

---

## 🐛 Troubleshooting Guide

### Issue: Cron Job Not Running

**Check 1: Server Running?**
```bash
pm2 status
# Should show "online" status
```

**Check 2: Initialization Message?**
```bash
pm2 logs greathire-backend | grep "Auto-reject cron"
# Should see: "✅ Auto-reject cron job scheduled"
```

**Check 3: Correct Time Zone?**
```bash
date
# Verify server time is correct
```

**Solution:**
```bash
# Restart server
pm2 restart greathire-backend

# Check logs
pm2 logs greathire-backend --lines 50
```

### Issue: Emails Not Sending

**Check 1: Email Credentials**
```bash
# Verify credentials in .env
cat BackEnd/.env | grep EMAIL
```

**Check 2: Test Email Service**
```bash
cd BackEnd
npm run test:email
```

**Check 3: Gmail Settings**
- Verify "App Passwords" is enabled
- Check account isn't blocked
- Review Gmail security settings

**Solution:**
- Generate new App Password
- Update EMAIL_PASS in .env
- Restart server

### Issue: Applications Not Being Rejected

**Check 1: Are There Old Applications?**
```javascript
// In MongoDB
db.applications.find({
  status: "Pending",
  createdAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
}).count()
```

**Check 2: Test Manually**
```bash
cd BackEnd
npm run test:auto-reject
```

**Check 3: Review Logs**
```bash
pm2 logs greathire-backend | grep "auto-reject"
```

---

## 📈 Success Metrics

### Daily Metrics to Track
- Number of applications auto-rejected
- Email delivery success rate
- Notification creation success rate
- Error count
- Processing time

### Weekly Review
- Total applications processed
- Average age of rejected applications
- Candidate feedback (if any)
- System performance impact
- Email bounce rate

### Monthly Analysis
- Trend analysis of rejections
- Optimization opportunities
- Feature enhancement needs
- Cost analysis (email sending)

---

## 🔒 Security Checklist

### Pre-Production
- [ ] .env file not committed to repository
- [ ] Email credentials are secure
- [ ] API endpoints require authentication
- [ ] Error messages don't expose sensitive data
- [ ] Logs don't contain passwords or tokens

### Post-Production
- [ ] Monitor for unauthorized access attempts
- [ ] Review API endpoint usage
- [ ] Check for unusual email sending patterns
- [ ] Verify database access is restricted
- [ ] Regular security audits

---

## 📞 Emergency Contacts

### If Something Goes Wrong

**Disable Auto-Reject Immediately:**
```bash
# Option 1: Stop the server
pm2 stop greathire-backend

# Option 2: Comment out cron initialization
nano BackEnd/index.js
# Comment out: startAutoRejectCron();
pm2 restart greathire-backend
```

**Rollback Deployment:**
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Redeploy
pm2 restart greathire-backend
```

**Contact Information:**
- Technical Support: hr@babde.tech
- Email Issues: greathire.team@gmail.com

---

## ✅ Final Verification

### Before Marking as Complete
- [ ] All tests passed
- [ ] Server running in production
- [ ] Cron job scheduled and working
- [ ] Email service functional
- [ ] Notifications working
- [ ] Logs being monitored
- [ ] Documentation complete
- [ ] Team trained on feature
- [ ] Rollback plan ready
- [ ] Emergency contacts documented

---

## 🎉 Deployment Complete!

Once all items are checked, the auto-reject feature is successfully deployed and operational.

**Next Review Date:** _____________

**Deployed By:** _____________

**Date:** _____________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## 📚 Additional Resources

- Full Documentation: `AUTO_REJECT_FEATURE.md`
- Quick Start Guide: `AUTO_REJECT_QUICK_START.md`
- Implementation Summary: `AUTO_REJECT_IMPLEMENTATION_SUMMARY.md`
- Process Flowcharts: `AUTO_REJECT_FLOWCHART.md`

---

**Remember:** Monitor the system closely for the first week after deployment!
