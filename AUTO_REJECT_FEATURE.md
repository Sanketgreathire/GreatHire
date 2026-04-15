# Auto-Reject Job Applications Feature

## Overview
This feature automatically rejects job applications that have been in "Pending" status for a specified period of time. When an application is auto-rejected, the candidate receives both an in-app notification and an email notification.

## Features
✅ Automatic rejection of old pending applications
✅ Email notifications to candidates
✅ In-app notifications via notification service
✅ Configurable time period (default: 30 days)
✅ Scheduled daily cron job (runs at 2 AM)
✅ Manual trigger endpoint for testing

## Configuration

### Environment Variable
Add this to your `.env` file:

```env
# Auto-reject applications after X days (default: 30)
AUTO_REJECT_DAYS=30
```

You can change the value to any number of days you prefer:
- `AUTO_REJECT_DAYS=7` - Reject after 7 days
- `AUTO_REJECT_DAYS=15` - Reject after 15 days
- `AUTO_REJECT_DAYS=30` - Reject after 30 days (default)
- `AUTO_REJECT_DAYS=60` - Reject after 60 days

## How It Works

### Automatic Process (Cron Job)
1. **Daily Schedule**: The system runs automatically every day at 2:00 AM
2. **Check Applications**: Finds all applications with status "Pending" that are older than the configured days
3. **Update Status**: Changes the application status from "Pending" to "Rejected"
4. **Send Email**: Sends a professional rejection email to the candidate
5. **Send Notification**: Creates an in-app notification for the candidate
6. **Log Results**: Logs the number of applications processed

### Manual Trigger (For Testing)
You can manually trigger the auto-reject process using the API endpoint:

**Endpoint**: `POST /api/v1/application/auto-reject/trigger`

**Headers**:
```
Authorization: Bearer <your-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Auto-reject process completed successfully"
}
```

## Email Template
The rejection email includes:
- Professional and empathetic message
- Job title and company name
- Encouragement for future applications
- Motivational quote
- Professional formatting with HTML styling

## Files Created/Modified

### New Files:
1. **`BackEnd/utils/emailService.js`** - Email sending utility
2. **`BackEnd/utils/autoRejectApplications.js`** - Auto-reject cron job logic

### Modified Files:
1. **`BackEnd/index.js`** - Added cron job initialization
2. **`BackEnd/.env`** - Added AUTO_REJECT_DAYS configuration
3. **`BackEnd/controllers/application.controller.js`** - Added manual trigger endpoint
4. **`BackEnd/routes/application.route.js`** - Added route for manual trigger

## Testing

### Test the Manual Trigger
1. Start your backend server:
   ```bash
   cd BackEnd
   npm run dev
   ```

2. Use Postman or curl to test:
   ```bash
   curl -X POST http://localhost:8000/api/v1/application/auto-reject/trigger \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. Check the console logs for results

### Test with Old Applications
To test with actual data:
1. Create a test application
2. Manually update its `createdAt` date in MongoDB to be older than AUTO_REJECT_DAYS
3. Run the manual trigger endpoint
4. Check if the application status changed to "Rejected"
5. Check if the email was sent
6. Check if the in-app notification was created

## Monitoring

### Console Logs
The system logs the following:
- ✅ Number of applications found for rejection
- ✅ Each application that gets rejected
- ✅ Email sending status
- ❌ Any errors that occur

### Example Log Output:
```
⏰ Running auto-reject cron job...
🔍 Checking for applications older than 30 days...
📋 Found 5 applications to auto-reject
✅ Auto-rejected application 507f1f77bcf86cd799439011
✅ Rejection email sent to candidate@example.com
✅ Auto-rejected application 507f1f77bcf86cd799439012
✅ Rejection email sent to candidate2@example.com
✅ Auto-rejection complete: 5 succeeded, 0 failed
```

## Customization

### Change Rejection Time Period
Edit `.env`:
```env
AUTO_REJECT_DAYS=15  # Change to your preferred number of days
```

### Change Cron Schedule
Edit `BackEnd/utils/autoRejectApplications.js`:
```javascript
// Current: Runs daily at 2 AM
cron.schedule("0 2 * * *", async () => {

// Examples:
// Every hour: "0 * * * *"
// Every 6 hours: "0 */6 * * *"
// Every Monday at 9 AM: "0 9 * * 1"
// Twice daily (9 AM and 9 PM): "0 9,21 * * *"
```

### Customize Email Template
Edit `BackEnd/utils/emailService.js` to modify the email content and styling.

## Security Considerations
- ✅ Manual trigger endpoint requires authentication
- ✅ Email credentials stored in environment variables
- ✅ Error handling prevents system crashes
- ✅ Logs don't expose sensitive information

## Troubleshooting

### Emails Not Sending
1. Check `.env` has correct EMAIL_USER and EMAIL_PASS
2. Verify Gmail account has "App Passwords" enabled
3. Check console logs for email errors

### Cron Job Not Running
1. Verify server is running continuously
2. Check console for cron initialization message
3. Ensure node-cron package is installed

### Applications Not Being Rejected
1. Verify AUTO_REJECT_DAYS is set correctly
2. Check if applications are actually older than the configured days
3. Ensure applications have status "Pending"
4. Check MongoDB connection

## Future Enhancements
- [ ] Add admin dashboard to view auto-reject statistics
- [ ] Allow per-job custom rejection periods
- [ ] Add option to disable auto-reject for specific jobs
- [ ] Send reminder to recruiter before auto-rejection
- [ ] Add analytics for rejection rates

## Support
For issues or questions, contact: hr@babde.tech
