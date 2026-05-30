# Auto-Sourcing: Complete Answer to Your Questions

## ✅ Your Questions Answered

### 1. "Where can I see these candidates?"

**Answer: 3 Places**

#### A. Admin Dashboard (`/admin/dashboard`)
- **What:** Total count of AI sourced candidates
- **Location:** Top stats row, 5th card labeled "AI Sourced"
- **Shows:** Total number (e.g., "150")
- **Updates:** Automatically when new candidates imported

#### B. AI Sourcing Page (`/admin/ai-sourcing`) ⭐ MAIN VIEW
- **What:** Complete list of all sourced candidates
- **Features:**
  - View all candidates with cards
  - Search by name, company, designation
  - Filter by skills, location, source type
  - See detailed stats (total runs, imported, skipped)
  - View auto-sourcing statistics card
  - Pagination (12 per page)
  - Delete candidates
  - View resumes
  - See who imported each candidate

#### C. Recruiter Sourcing Page (`/recruiter/dashboard/sourcing`)
- **What:** Recruiters see their own sourced candidates
- **Shows:** Only candidates they imported
- **Features:** Same search/filter as admin view

---

### 2. "How can I trigger this?"

**Answer: 3 Methods**

#### Method 1: Click Button (EASIEST) ⭐
```
1. Login as admin
2. Go to: /admin/ai-sourcing
3. Click: "Trigger Auto-Sourcing" button (purple, top right)
4. Confirm: Click "OK"
5. Wait: 5 seconds for stats to update
```

**What happens:**
- Backend starts sourcing immediately
- Fetches candidates from GitHub for all verified recruiters
- Shows toast notification: "Auto-sourcing triggered!"
- Stats update automatically after 5 seconds

#### Method 2: Automatic (Cron Job)
```
Runs automatically every day at 3:00 AM
No action needed!
```

#### Method 3: Manual Script (Testing)
```bash
cd BackEnd
node test-auto-sourcing.js
```

---

### 3. "Can I see these in admin candidate database and count?"

**Answer: YES! ✅**

#### Count Visible In:
1. **Admin Dashboard** - "AI Sourced" stat card
2. **AI Sourcing Page** - Multiple stats:
   - Total Sourced
   - GitHub Profiles (auto-sourced count)
   - Total Runs
   - Total Imported
   - Last Run Result

#### Database View:
- **AI Sourcing Page** (`/admin/ai-sourcing`) shows ALL candidates
- Filter by "GitHub Profile" to see only auto-sourced ones
- Each card shows source badge (orange = GitHub Profile)

---

### 4. "Can't we scrape by clicking a button?"

**Answer: YES! ✅ Already Implemented**

**The Button:**
- **Location:** `/admin/ai-sourcing` page
- **Label:** "Trigger Auto-Sourcing"
- **Style:** Purple gradient button, top right
- **Icon:** Play icon (▶️)

**How to Use:**
```
Step 1: Go to /admin/ai-sourcing
Step 2: Click "Trigger Auto-Sourcing" button
Step 3: Confirm in dialog
Step 4: Wait (runs in background)
Step 5: Stats update after 5 seconds
```

**What It Does:**
- Immediately starts GitHub scraping
- Processes all verified recruiters
- Fetches 30 profiles per recruiter
- Checks for duplicates
- Imports new candidates
- Updates statistics
- Shows success notification

---

## 🎯 Quick Access Guide

### To View Candidates:
```
Admin Dashboard: /admin/dashboard (see count)
AI Sourcing Page: /admin/ai-sourcing (see all candidates)
```

### To Trigger Scraping:
```
1. /admin/ai-sourcing
2. Click "Trigger Auto-Sourcing" button
3. Done!
```

### To See Stats:
```
/admin/ai-sourcing
Look at:
- Stats bar (top)
- Auto-Sourcing Statistics card (below stats bar)
```

---

## 📊 What You'll See

### Admin Dashboard View
```
┌─────────────────────────────────────────────────┐
│ Total Companies: 50                             │
│ Total Recruiters: 25                            │
│ Total Users: 500                                │
│ Total Jobs: 100                                 │
│ AI Sourced: 150  ← YOUR COUNT HERE             │
└─────────────────────────────────────────────────┘
```

### AI Sourcing Page View
```
┌─────────────────────────────────────────────────┐
│ 🧠 AI Sourcing — Admin View                     │
│                    [AI Ready] [Trigger Button]  │
├─────────────────────────────────────────────────┤
│ Stats Bar:                                      │
│ Total: 500 | Resume: 200 | CSV: 150            │
│ GitHub: 100 ← AUTO-SOURCED | Manual: 50        │
├─────────────────────────────────────────────────┤
│ ⚡ Auto-Sourcing Statistics                     │
│ Last run: 2024-01-15 03:00:00                   │
│ Total Runs: 30 | Imported: 750 | Skipped: 150  │
│ Last Result: 25 imported                        │
├─────────────────────────────────────────────────┤
│ [Search] [Skills] [Location] [Source]          │
├─────────────────────────────────────────────────┤
│ 500 candidates found                            │
│                                                 │
│ [Candidate Card] [Candidate Card]               │
│ [Candidate Card] [Candidate Card]               │
│                                                 │
│ Page 1 of 42                                    │
└─────────────────────────────────────────────────┘
```

### Candidate Card Example
```
┌─────────────────────────────────────────────────┐
│ John Doe                              👁️ 🗑️    │
│ Senior Developer                                │
│ Google Inc.                                     │
│                                                 │
│ 🕐 5y  📍 India  ✉️ john@example.com           │
│                                                 │
│ [React] [Node.js] [Python] [+3]                │
│                                                 │
│ 🟧 GITHUB PROFILE    by Jane Smith             │
│    ↑ AUTO-SOURCED                               │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step: First Time Setup

### 1. Initialize (One Time Only)
```bash
cd BackEnd
npm run init:auto-sourcing
```
This creates configs for all existing recruiters.

### 2. Test It Works
```bash
npm run test:auto-sourcing
```
Should see: "✅ Imported X candidates"

### 3. Start Server
```bash
npm run dev
```
Cron starts automatically, runs at 3 AM daily.

### 4. View Results
- Go to: `http://localhost:5173/admin/ai-sourcing`
- Login as admin
- See candidates!

### 5. Trigger Manually (Optional)
- Click "Trigger Auto-Sourcing" button
- Wait 5 seconds
- See new candidates appear

---

## 🎨 Button Location Visual

```
┌─────────────────────────────────────────────────────────┐
│ 🧠 AI Sourcing — Admin View                             │
│ All sourced candidates across all recruiters           │
│                                                         │
│                    [AI Ready] [Trigger Auto-Sourcing]  │
│                                      ↑                  │
│                                   THE BUTTON            │
└─────────────────────────────────────────────────────────┘
```

**Button Details:**
- Color: Purple gradient (purple-600 to blue-600)
- Size: Medium
- Icon: Play icon (▶️)
- Text: "Trigger Auto-Sourcing"
- Location: Top right corner
- Hover: Darker gradient
- Click: Shows spinner "Triggering..."

---

## 📈 Stats Breakdown

### What Each Stat Means:

**Total Sourced (500)**
- All candidates in database
- Includes: Resume, CSV, GitHub, Manual

**GitHub Profiles (100)**
- Auto-sourced from GitHub
- This is your auto-sourcing count

**Total Runs (30)**
- How many times cron executed
- 30 days = 30 runs

**Total Imported (750)**
- All candidates ever auto-sourced
- Cumulative count

**Total Skipped (150)**
- Duplicates that were rejected
- Deduplication working

**Last Run Result (25 imported)**
- Most recent execution
- How many imported in last run

---

## 🔍 Filtering Examples

### See Only Auto-Sourced:
```
Source Type: "GitHub Profile"
Click: Search
Result: Only auto-sourced candidates
```

### Find JavaScript Developers:
```
Skills: "JavaScript"
Source Type: "GitHub Profile"
Click: Search
Result: Auto-sourced JavaScript devs
```

### Find Candidates in India:
```
Location: "India"
Source Type: "GitHub Profile"
Click: Search
Result: Auto-sourced candidates in India
```

---

## ✅ Checklist

Before using auto-sourcing:
- [ ] Backend running (`npm run dev`)
- [ ] Admin account created
- [ ] Logged in as admin
- [ ] Navigated to `/admin/ai-sourcing`
- [ ] See "Trigger Auto-Sourcing" button
- [ ] GitHub token added to `.env` (optional)
- [ ] Initialized configs (`npm run init:auto-sourcing`)

To trigger scraping:
- [ ] Click "Trigger Auto-Sourcing" button
- [ ] Confirm dialog
- [ ] Wait 5 seconds
- [ ] See toast notification
- [ ] Stats update
- [ ] Candidates appear

To view candidates:
- [ ] Go to `/admin/ai-sourcing`
- [ ] See candidate cards
- [ ] Use filters to search
- [ ] Click cards to view details

---

## 🎯 Summary

**Q: Where to see candidates?**
A: `/admin/ai-sourcing` - Complete list with search/filter

**Q: How to trigger?**
A: Click "Trigger Auto-Sourcing" button on `/admin/ai-sourcing`

**Q: Can I see count?**
A: Yes! Admin dashboard shows "AI Sourced" count

**Q: Can I scrape by clicking?**
A: Yes! "Trigger Auto-Sourcing" button does exactly that

---

## 📞 Need Help?

**Button not visible?**
- Ensure you're logged in as admin
- Check URL is `/admin/ai-sourcing`
- Refresh page

**No candidates showing?**
- Click "Trigger Auto-Sourcing" to import now
- Or wait until 3 AM for automatic run
- Check if recruiters are verified

**Stats not updating?**
- Wait 5 seconds after triggering
- Refresh page manually
- Check backend logs

---

**Everything is ready to use! Just click the button and watch candidates appear! 🎉**
