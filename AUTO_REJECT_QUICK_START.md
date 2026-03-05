# Auto-Reject Job Applications - Quick Setup Guide

## 🎯 What This Does
Automatically rejects job applications that have been pending for too long (default: 30 days) and sends email + in-app notifications to candidates.

## ⚡ Quick Start

### 1. Configuration (Already Done)
The `.env` file has been updated with:
```env
AUTO_REJECT_DAYS=30
```

### 2. Start the Server
```bash
cd BackEnd
npm run dev
```

The auto-reject cron job will start automatically and run daily at 2:00 AM.

### 3. Test It Manually (Optional)
```bash
# Test email service
node BackEnd/test-email.js

# Test auto-reject via API
curl -X POST http://localhost:8000/api/v1/application/auto-reject/trigger \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Files Added
- `BackEnd/utils/emailService.js` - Email sending
- `BackEnd/utils/autoRejectApplications.js` - Auto-reject logic
- `BackEnd/test-email.js` - Email testing script
- `AUTO_REJECT_FEATURE.md` - Full documentation

## 📁 Files Modified
- `BackEnd/index.js` - Added cron job initialization
- `BackEnd/.env` - Added AUTO_REJECT_DAYS config
- `BackEnd/controllers/application.controller.js` - Added manual trigger
- `BackEnd/routes/application.route.js` - Added trigger route

## 🔧 Customize

### Change Rejection Period
Edit `BackEnd/.env`:
```env
AUTO_REJECT_DAYS=15  # Reject after 15 days instead of 30
```

### Change Schedule
Edit `BackEnd/utils/autoRejectApplications.js` line 48:
```javascript
cron.schedule("0 2 * * *", async () => {  // Currently 2 AM daily
```

## 📊 How It Works
1. **Daily at 2 AM**: System checks for pending applications older than configured days
2. **Auto-Reject**: Changes status from "Pending" to "Rejected"
3. **Email**: Sends professional rejection email to candidate
4. **Notification**: Creates in-app notification
5. **Logs**: Records all actions in console

## ✅ What Candidates Receive

### Email
- Professional rejection message
- Job title and company name
- Encouragement for future applications
- Motivational quote

### In-App Notification
- Status update notification
- Link to view application details

## 🧪 Testing Checklist
- [ ] Server starts without errors
- [ ] Cron job initialization message appears
- [ ] Test email script works
- [ ] Manual trigger endpoint works
- [ ] Email arrives in inbox
- [ ] In-app notification created
- [ ] Application status changes to "Rejected"

## 📞 Support
For detailed documentation, see `AUTO_REJECT_FEATURE.md`

## 🚀 Ready to Use!
The feature is now active and will run automatically. No further action needed!
