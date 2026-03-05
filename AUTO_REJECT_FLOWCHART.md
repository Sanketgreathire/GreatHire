# Auto-Reject Process Flow

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GreatHire Platform                          │
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │  Candidate   │────────▶│  Applies for │                    │
│  │              │         │     Job      │                    │
│  └──────────────┘         └──────┬───────┘                    │
│                                   │                             │
│                                   ▼                             │
│                          ┌────────────────┐                    │
│                          │  Application   │                    │
│                          │ Status: Pending│                    │
│                          │  Created: Date │                    │
│                          └────────┬───────┘                    │
│                                   │                             │
│                                   │ Time Passes...              │
│                                   │                             │
│                                   ▼                             │
│                          ┌────────────────┐                    │
│                          │   Cron Job     │                    │
│                          │  Runs Daily    │                    │
│                          │   at 2:00 AM   │                    │
│                          └────────┬───────┘                    │
│                                   │                             │
│                                   ▼                             │
│                          ┌────────────────┐                    │
│                          │  Check if      │                    │
│                          │  Application   │                    │
│                          │  > X days old  │                    │
│                          └────────┬───────┘                    │
│                                   │                             │
│                    ┌──────────────┴──────────────┐            │
│                    │                               │            │
│                    ▼                               ▼            │
│            ┌──────────────┐              ┌──────────────┐     │
│            │   YES        │              │     NO       │     │
│            │ Auto-Reject  │              │  Keep Pending│     │
│            └──────┬───────┘              └──────────────┘     │
│                   │                                             │
│                   ▼                                             │
│         ┌─────────────────────┐                               │
│         │  Update Status to   │                               │
│         │     "Rejected"      │                               │
│         └─────────┬───────────┘                               │
│                   │                                             │
│         ┌─────────┴─────────┐                                 │
│         │                   │                                 │
│         ▼                   ▼                                 │
│  ┌─────────────┐    ┌─────────────┐                         │
│  │ Send Email  │    │   Create    │                         │
│  │ Notification│    │   In-App    │                         │
│  │             │    │ Notification│                         │
│  └──────┬──────┘    └──────┬──────┘                         │
│         │                   │                                 │
│         └─────────┬─────────┘                                 │
│                   │                                             │
│                   ▼                                             │
│          ┌────────────────┐                                   │
│          │   Candidate    │                                   │
│          │   Receives     │                                   │
│          │  Notification  │                                   │
│          └────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Detailed Process Flow

### Step 1: Application Submission
```
Candidate → Applies for Job → Application Created (Status: Pending)
```

### Step 2: Waiting Period
```
Day 1  ────────────────────────────────────────────▶ Day 30
       Application remains in "Pending" status
       Recruiter can manually update status anytime
```

### Step 3: Auto-Reject Check (Daily at 2 AM)
```
┌─────────────────────────────────────────────────────────┐
│ Cron Job Executes                                       │
│                                                         │
│ 1. Query Database:                                      │
│    Find applications where:                             │
│    - status = "Pending"                                 │
│    - createdAt < (Today - AUTO_REJECT_DAYS)            │
│                                                         │
│ 2. For each application found:                          │
│    a. Update status to "Rejected"                       │
│    b. Send rejection email                              │
│    c. Create in-app notification                        │
│    d. Log the action                                    │
│                                                         │
│ 3. Report Results:                                      │
│    - Total applications processed                       │
│    - Success count                                      │
│    - Failure count                                      │
└─────────────────────────────────────────────────────────┘
```

### Step 4: Notification Delivery

#### Email Notification
```
┌──────────────────────────────────────────────────┐
│ Professional Rejection Email                     │
│                                                  │
│ To: candidate@example.com                       │
│ Subject: Application Update - Job Title         │
│                                                  │
│ Content:                                         │
│ - Personalized greeting                          │
│ - Job title and company name                     │
│ - Professional rejection message                 │
│ - Encouragement for future applications          │
│ - Motivational quote                             │
│ - Professional signature                         │
└──────────────────────────────────────────────────┘
```

#### In-App Notification
```
┌──────────────────────────────────────────────────┐
│ Notification Panel                               │
│                                                  │
│ 🔔 Application Update                           │
│                                                  │
│ "Thank you for your interest! Unfortunately,    │
│  we won't be proceeding with your application   │
│  for the [Job Title] position at [Company]."    │
│                                                  │
│ [View Details]                                   │
└──────────────────────────────────────────────────┘
```

## ⚙️ Configuration Flow

```
.env File
   │
   ├─▶ AUTO_REJECT_DAYS=30
   │
   ├─▶ EMAIL_USER=your-email@gmail.com
   │
   └─▶ EMAIL_PASS=your-app-password
         │
         ▼
   Server Startup
         │
         ├─▶ Load Environment Variables
         │
         ├─▶ Initialize Cron Job
         │
         └─▶ Schedule Daily Execution (2 AM)
               │
               ▼
         Auto-Reject Process
```

## 🧪 Testing Flow

```
Manual Testing
   │
   ├─▶ Option 1: Backdate Application
   │     │
   │     ├─▶ node BackEnd/backdate-applications.js
   │     │
   │     └─▶ Sets application date to 35 days ago
   │
   ├─▶ Option 2: Test Auto-Reject
   │     │
   │     ├─▶ node BackEnd/test-auto-reject.js
   │     │
   │     └─▶ Runs auto-reject process immediately
   │
   └─▶ Option 3: API Endpoint
         │
         ├─▶ POST /api/v1/application/auto-reject/trigger
         │
         └─▶ Triggers auto-reject via HTTP request
```

## 📈 Data Flow

```
MongoDB Database
   │
   ├─▶ Applications Collection
   │     │
   │     ├─▶ Find: { status: "Pending", createdAt: { $lt: cutoffDate } }
   │     │
   │     └─▶ Update: { status: "Rejected" }
   │
   ├─▶ Notifications Collection
   │     │
   │     └─▶ Insert: New notification document
   │
   └─▶ Jobs Collection
         │
         └─▶ Populate: Job details for email content
```

## 🔐 Security Flow

```
Authentication Required
   │
   ├─▶ Manual Trigger Endpoint
   │     │
   │     └─▶ isAuthenticated Middleware
   │           │
   │           └─▶ Verify JWT Token
   │
   └─▶ Email Service
         │
         └─▶ Environment Variables
               │
               ├─▶ EMAIL_USER (from .env)
               │
               └─▶ EMAIL_PASS (from .env)
```

## 📊 Success Metrics

```
Auto-Reject Execution
   │
   ├─▶ Applications Found: X
   │
   ├─▶ Successfully Rejected: Y
   │
   ├─▶ Emails Sent: Z
   │
   ├─▶ Notifications Created: W
   │
   └─▶ Failures: F
         │
         └─▶ Logged for Review
```

## 🎯 Timeline Example

```
Day 0:  Candidate applies for job
        Status: Pending
        
Day 1-29: Application remains pending
          Recruiter can review anytime
          
Day 30: Cron job runs at 2:00 AM
        Application is 30 days old
        Meets auto-reject criteria
        
        ↓
        
        Status changed to: Rejected
        Email sent to candidate
        In-app notification created
        
Day 31+: Candidate sees rejection
         Can apply for other jobs
```

## 🔄 Error Handling Flow

```
Auto-Reject Process
   │
   ├─▶ Try to Process Application
   │     │
   │     ├─▶ Success
   │     │     │
   │     │     └─▶ Log: ✅ Application rejected
   │     │
   │     └─▶ Error
   │           │
   │           ├─▶ Log: ❌ Error details
   │           │
   │           ├─▶ Continue to next application
   │           │
   │           └─▶ Don't crash the system
   │
   └─▶ Final Report
         │
         └─▶ Summary of successes and failures
```

This visual representation helps understand how the auto-reject system works from start to finish!
