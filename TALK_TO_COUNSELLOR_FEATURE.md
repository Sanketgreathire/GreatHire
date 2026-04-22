# Talk to Counsellor Feature - Implementation Guide

## Overview
A complete "Talk to Counsellor" form with OTP verification has been implemented. The data is saved to the Course Dashboard in the Admin Panel under the "Enquiries" tab.

## Features Implemented

### 1. Backend API Endpoints
**Location:** `BackEnd/controllers/course.controller.js` & `BackEnd/routes/course.route.js`

#### New Endpoints:
- `POST /api/v1/courses/counsellor/send-otp` - Sends OTP to user's email
- `POST /api/v1/courses/counsellor/verify-otp` - Verifies the OTP
- `POST /api/v1/courses/enquiry` - Saves enquiry data (existing, now used for counsellor requests)

#### OTP Flow:
- OTP is 6-digit random number
- Sent via email using nodemailer
- Valid for 10 minutes
- Stored in-memory (Map) for simplicity
- Resend functionality with 30-second cooldown

### 2. Frontend Component
**Location:** `frontend/src/components/TalkToCounsellorModal.jsx`

#### Form Fields:
1. **Name** - Text input (required)
2. **Email** - Email input with validation (required)
3. **Mobile Number** - 10-digit number input (required)
4. **OTP Verification** - 6-digit OTP input

#### User Flow:
1. User fills Name, Email, Mobile Number
2. Clicks "Send OTP" → OTP sent to email
3. User enters 6-digit OTP
4. Clicks "Verify & Submit" → Data saved to database
5. Success message displayed

#### Features:
- Real-time validation
- Error handling
- Loading states
- Resend OTP with timer
- Responsive design
- Dark mode compatible

### 3. Integration in Course Pages
**Files Updated:**
- `frontend/src/pages/course/python.jsx` ✅
- `frontend/src/pages/course/java.jsx` ✅

**Pattern to Apply to All Course Pages:**

```jsx
// 1. Add import at top
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";

// 2. Add state in component
const [showCounsellor, setShowCounsellor] = useState(false);

// 3. Wire up button (find existing "Talk to Counsellor" button)
<button onClick={() => setShowCounsellor(true)} className="...">
  📞 Talk to Counsellor
</button>

// 4. Add modal render at bottom (before closing div)
{showCounsellor && (
  <TalkToCounsellorModal 
    courseName="[Course Name Here]" 
    onClose={() => setShowCounsellor(false)} 
  />
)}
```

### 4. Admin Panel Integration
**Location:** `frontend/src/pages/admin/courses/Courses.jsx`

The enquiries are automatically visible in the Admin Panel:
- Navigate to: `localhost:5173/admin/courses`
- Tab: "Enquiries" (default tab)
- All counsellor requests appear with type="enquiry"
- Columns: Name, Email, Phone, Course, Mode, Date, Status
- Status can be updated: New → Contacted → Enrolled → Closed

## Database Schema
**Model:** `BackEnd/models/courseEnquiry.model.js`

```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  courseName: String (required),
  fee: String,
  mode: String (Online/Offline/Hybrid),
  batch: String,
  type: String (enquiry/demo/enrollment),
  status: String (new/contacted/enrolled/closed),
  createdAt: Date,
  updatedAt: Date
}
```

## Course Pages with "Talk to Counsellor" Button
All the following pages have the button and need the same integration:

1. AdvancedExcelCoursePage.jsx
2. AutoCADCoursePage.jsx
3. AWSDevOpsCoursePage.jsx
4. BIMCoursePage.jsx
5. BusinessAnalystPage.jsx
6. CourseMain.jsx
7. CyberSecurityPage.jsx
8. DataAnalytics.jsx
9. DataScience.jsx
10. DigitalMarketing.jsx
11. GenerativeAIPage.jsx
12. java.jsx ✅
13. MedicalCodingCoursePage.jsx
14. MultimediaCoursePage.jsx
15. PMPPage.jsx
16. python.jsx ✅
17. RevitMEPCoursePage.jsx
18. saleforcePage.jsx
19. SAPFICOCoursePage.jsx
20. SAPMMPage.jsx
21. TestingToolsCoursePage.jsx
22. VLSICoursePage.jsx

## How to Apply to Remaining Course Pages

For each course page file:

1. **Add Import** (after existing imports):
```jsx
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";
```

2. **Add State** (after existing useState declarations):
```jsx
const [showCounsellor, setShowCounsellor] = useState(false);
```

3. **Update Button** (find the "Talk to Counsellor" button):
```jsx
// FROM:
<button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
  📞 Talk to Counsellor
</button>

// TO:
<button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
  📞 Talk to Counsellor
</button>
```

4. **Add Modal** (before the closing `</div>` of the main component, after other modals):
```jsx
{showCounsellor && (
  <TalkToCounsellorModal 
    courseName="[Replace with actual course name]" 
    onClose={() => setShowCounsellor(false)} 
  />
)}
```

## Testing Checklist

### Backend Testing:
1. ✅ Start backend: `cd BackEnd && npm run dev`
2. ✅ Test OTP send: POST to `/api/v1/courses/counsellor/send-otp`
3. ✅ Check email for OTP
4. ✅ Test OTP verify: POST to `/api/v1/courses/counsellor/verify-otp`
5. ✅ Verify data saved in MongoDB

### Frontend Testing:
1. ✅ Start frontend: `cd frontend && npm run dev`
2. ✅ Navigate to any course page (e.g., `/courses/python-training`)
3. ✅ Click "Talk to Counsellor" button
4. ✅ Fill form and submit
5. ✅ Verify OTP received in email
6. ✅ Enter OTP and verify
7. ✅ Check success message
8. ✅ Verify data in Admin Panel (`/admin/courses`)

### Admin Panel Testing:
1. ✅ Login as admin
2. ✅ Navigate to Courses section
3. ✅ Check "Enquiries" tab
4. ✅ Verify new entry appears
5. ✅ Test status update functionality
6. ✅ Test search/filter functionality

## Environment Variables Required

Add to `BackEnd/.env`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

## Security Considerations

1. **OTP Storage**: Currently in-memory (Map). For production, consider Redis
2. **Rate Limiting**: Already implemented via express-rate-limit
3. **Email Validation**: Regex validation on frontend + backend
4. **Phone Validation**: 10-digit validation
5. **OTP Expiry**: 10 minutes
6. **Resend Cooldown**: 30 seconds

## Future Enhancements

1. **SMS OTP**: Add Twilio/AWS SNS for SMS-based OTP
2. **Persistent OTP Store**: Use Redis instead of in-memory Map
3. **Email Templates**: Rich HTML email templates
4. **Analytics**: Track conversion rates
5. **Auto-follow-up**: Automated email reminders
6. **CRM Integration**: Sync with external CRM systems

## API Documentation

### Send OTP
```http
POST /api/v1/courses/counsellor/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "9876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent to email"
}
```

### Verify OTP
```http
POST /api/v1/courses/counsellor/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified"
}
```

### Submit Enquiry
```http
POST /api/v1/courses/enquiry
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "courseName": "Full Stack Python Developer",
  "type": "enquiry",
  "mode": "Online"
}

Response:
{
  "success": true,
  "message": "Submitted successfully",
  "data": { ... }
}
```

## Troubleshooting

### OTP Not Received
- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail "App Password" is used (not regular password)
- Check spam folder
- Verify email service is running

### Modal Not Opening
- Check browser console for errors
- Verify import path is correct
- Ensure state is properly initialized

### Data Not Saving
- Check MongoDB connection
- Verify API endpoint is correct
- Check network tab for API errors
- Verify CORS settings

## Summary

✅ **Backend**: OTP send/verify endpoints created
✅ **Frontend**: Reusable TalkToCounsellorModal component created
✅ **Integration**: Wired up in python.jsx and java.jsx
✅ **Admin Panel**: Data visible in Courses dashboard
✅ **Database**: Enquiries saved with all required fields

**Next Steps**: Apply the same pattern to remaining 20 course pages using the integration guide above.
