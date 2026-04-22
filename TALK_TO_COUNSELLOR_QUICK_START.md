# Talk to Counsellor - Quick Start Guide

## ✅ What's Been Implemented

A complete "Talk to Counsellor" form with OTP verification that saves data to the Course Dashboard in Admin Panel.

### Features:
- ✅ Name, Email, Mobile Number fields
- ✅ OTP verification via email
- ✅ Data saved to MongoDB
- ✅ Visible in Admin Panel under Courses → Enquiries
- ✅ Integrated in ALL 22 course pages

## 🚀 Quick Test

### 1. Start Backend
```bash
cd BackEnd
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test the Feature

#### As a User:
1. Go to any course page: `http://localhost:5173/courses/python-training`
2. Scroll down to the sidebar
3. Click "📞 Talk to Counsellor" button
4. Fill the form:
   - Name: Your Name
   - Email: your-email@gmail.com
   - Mobile: 9876543210
5. Click "Send OTP"
6. Check your email for the 6-digit OTP
7. Enter OTP and click "Verify & Submit"
8. See success message!

#### As an Admin:
1. Login to admin panel: `http://localhost:5173/admin/login`
2. Navigate to "Courses" section
3. Click "Enquiries" tab (default)
4. See the new enquiry with all details
5. Update status: New → Contacted → Enrolled → Closed

## 📋 All Course Pages with Feature

✅ All 22 course pages now have the "Talk to Counsellor" button:

1. `/courses/python-training`
2. `/courses/java-training`
3. `/courses/data-science-training`
4. `/courses/digital-marketing-training`
5. `/courses/data-analytics-training`
6. `/courses/saleforce-training`
7. `/courses/aws-devops-training`
8. `/courses/bim-training`
9. `/courses/medical-training`
10. `/courses/sap-fico-training`
11. `/courses/testing-tools-training`
12. `/courses/vlsi-training`
13. `/courses/multimedia-training`
14. `/courses/advanced-excel-training`
15. `/courses/autocad-training`
16. `/courses/revit-mep-training`
17. `/courses/business-analytics-training`
18. `/courses/generative-AI-training`
19. `/courses/sap-mm-training`
20. `/courses/cyber-security-training`
21. `/courses/pmp-training`
22. `/courses` (main course page)

## 🔧 Environment Setup

Make sure `BackEnd/.env` has:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

**Note:** Use Gmail App Password, not regular password.
Generate at: https://myaccount.google.com/apppasswords

## 📊 Admin Panel Access

The enquiries appear in:
- **Path:** `/admin/courses`
- **Tab:** Enquiries (first tab)
- **Columns:** #, Name, Email, Phone, Course, Mode, Date, Status
- **Actions:** Update status dropdown

## 🎯 User Flow

```
User clicks "Talk to Counsellor"
    ↓
Fills Name, Email, Mobile
    ↓
Clicks "Send OTP"
    ↓
Receives OTP via email (valid 10 min)
    ↓
Enters 6-digit OTP
    ↓
Clicks "Verify & Submit"
    ↓
Data saved to MongoDB
    ↓
Success message shown
    ↓
Admin sees enquiry in dashboard
```

## 🔐 Security Features

- ✅ Email validation (regex)
- ✅ Phone validation (10 digits)
- ✅ OTP expiry (10 minutes)
- ✅ Resend cooldown (30 seconds)
- ✅ Rate limiting (API level)
- ✅ Input sanitization

## 📱 Responsive Design

- ✅ Mobile-friendly modal
- ✅ Touch-optimized buttons
- ✅ Adaptive layouts
- ✅ Dark mode compatible

## 🐛 Troubleshooting

### OTP Not Received?
- Check spam folder
- Verify EMAIL_USER and EMAIL_PASS in .env
- Ensure Gmail App Password is used
- Check backend console for errors

### Modal Not Opening?
- Check browser console for errors
- Clear browser cache
- Verify JavaScript is enabled

### Data Not Saving?
- Check MongoDB connection
- Verify API endpoints are running
- Check network tab for API errors

## 📝 Files Modified

### Backend:
- `BackEnd/controllers/course.controller.js` - Added OTP endpoints
- `BackEnd/routes/course.route.js` - Added OTP routes

### Frontend:
- `frontend/src/components/TalkToCounsellorModal.jsx` - New component
- `frontend/src/pages/course/*.jsx` - All 22 course pages updated

### Admin:
- No changes needed - existing Courses dashboard shows the data

## 🎉 Success Criteria

✅ User can fill the form
✅ OTP is sent to email
✅ OTP can be verified
✅ Data is saved to database
✅ Admin can see enquiry
✅ Admin can update status
✅ Works on all course pages

## 📞 Support

For issues or questions, check:
- `TALK_TO_COUNSELLOR_FEATURE.md` - Detailed documentation
- Backend console logs
- Browser console logs
- Network tab in DevTools

---

**Status:** ✅ FULLY IMPLEMENTED AND TESTED
**Last Updated:** 2025
