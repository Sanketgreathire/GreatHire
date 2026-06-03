# Where to See Auto-Sourced Candidates & How to Trigger

## 📍 Where to View Auto-Sourced Candidates

### 1. **Admin Dashboard** (Main Overview)
**URL:** `/admin/dashboard`

**What you see:**
- "AI Sourced" stat card showing total count
- Updates automatically when new candidates are imported
- Located in the top stats row with other metrics

**Screenshot location:**
```
┌─────────────────────────────────────────────────┐
│ Total Companies | Total Recruiters | Total Users │
│ Total Jobs      | AI Sourced: 150               │
└─────────────────────────────────────────────────┘
```

---

### 2. **AI Sourcing Page** (Detailed View)
**URL:** `/admin/ai-sourcing`

**What you see:**
- **Stats Bar:**
  - Total Sourced
  - Resume Uploads
  - CSV Imports
  - GitHub Profiles (auto-sourced)
  - Manual Entries

- **Auto-Sourcing Statistics Card:**
  - Total Runs (how many times cron ran)
  - Total Imported (all-time count)
  - Total Skipped (duplicates)
  - Last Run Result (most recent import)
  - Last Run Timestamp

- **Trigger Button:**
  - Big purple "Trigger Auto-Sourcing" button
  - Click to manually start sourcing immediately
  - Shows progress spinner while running

- **Candidate Cards:**
  - All sourced candidates with filters
  - Search by name, skills, location
  - Filter by source type (GitHub Profile, Resume, CSV, etc.)
  - View resume, delete candidates
  - See who imported each candidate

**Features:**
✅ Search candidates by name, company, designation
✅ Filter by skills (e.g., "React, Python")
✅ Filter by location
✅ Filter by source type (GitHub Profile, Resume, etc.)
✅ Pagination (12 candidates per page)
✅ Delete candidates
✅ View resumes
✅ See recruiter who imported each candidate

---

### 3. **Recruiter Sourcing Page**
**URL:** `/recruiter/dashboard/sourcing`

**What recruiters see:**
- Their own sourced candidates only
- Same search and filter capabilities
- Import tabs (Resume, CSV, GitHub, LinkedIn, Manual)
- Stats for their pool only

---

## 🚀 How to Trigger Auto-Sourcing

### Method 1: Click Button (Easiest)

1. **Login as Admin**
2. **Navigate to:** `/admin/ai-sourcing`
3. **Click:** "Trigger Auto-Sourcing" button (top right, purple gradient)
4. **Confirm:** Click "OK" in the confirmation dialog
5. **Wait:** System runs in background (5-10 minutes)
6. **Refresh:** Stats update automatically after 5 seconds

**What happens:**
```
Click Button
    ↓
Confirmation Dialog
    ↓
Backend starts sourcing
    ↓
For each verified recruiter:
  - Search GitHub
  - Fetch 30 profiles
  - Check duplicates
  - Import candidates
    ↓
Stats update
    ↓
Toast notification: "Auto-sourcing triggered!"
```

---

### Method 2: Wait for Cron (Automatic)

**Default Schedule:** Every day at 3:00 AM

**What happens automatically:**
- Cron job wakes up at 3 AM
- Loads all verified recruiters
- For each recruiter:
  - Gets their search criteria (or uses defaults)
  - Searches GitHub for developers
  - Fetches 30 profiles
  - Checks for duplicates
  - Imports new candidates
  - Updates statistics
- Logs results to console

**No action needed!** Just let it run.

---

### Method 3: Manual Script (Testing)

**For developers/testing:**

```bash
cd BackEnd
node test-auto-sourcing.js
```

**Output:**
```
🚀 Testing Auto-Sourcing Feature...
📊 Found 5 recruiters for auto-sourcing
🔍 Auto-sourcing for recruiter: John Doe
✅ Found 30 GitHub profiles
✅ Imported 25 candidates for John Doe
📊 Auto-sourcing summary: { total: 5, successful: 5, totalImported: 120 }
✅ Test completed successfully!
```

---

## 📊 Understanding the Stats

### Stats Bar (Top of AI Sourcing Page)

```
┌─────────────────────────────────────────────────────────┐
│ Total Sourced: 500                                      │
│ Resume Uploads: 200 | CSV Imports: 150                  │
│ GitHub Profiles: 100 | Manual Entries: 50               │
└─────────────────────────────────────────────────────────┘
```

- **Total Sourced:** All candidates in database
- **GitHub Profiles:** Auto-sourced from GitHub (this is the auto-sourcing count)
- **Resume Uploads:** Manually uploaded by recruiters
- **CSV Imports:** Bulk imported via CSV
- **Manual Entries:** Hand-entered by recruiters

---

### Auto-Sourcing Statistics Card

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Auto-Sourcing Statistics                             │
│ Last run: 2024-01-15 03:00:00                           │
│                                                         │
│ Total Runs: 30        Total Imported: 750               │
│ Total Skipped: 150    Last Run Result: 25 imported     │
└─────────────────────────────────────────────────────────┘
```

- **Total Runs:** How many times cron has executed (30 days = 30 runs)
- **Total Imported:** All candidates ever imported via auto-sourcing
- **Total Skipped:** Duplicates that were skipped
- **Last Run Result:** Most recent execution (e.g., "25 imported")
- **Last Run At:** Timestamp of last execution

---

## 🔍 Filtering & Searching

### Search Bar Features

**1. Name/Company/Designation Search:**
```
Input: "John"
Results: All candidates with "John" in name, company, or designation
```

**2. Skills Filter:**
```
Input: "React, Python"
Results: Candidates with React OR Python skills
```

**3. Location Filter:**
```
Input: "India"
Results: Candidates in India
```

**4. Source Type Filter:**
```
Dropdown: "GitHub Profile"
Results: Only auto-sourced candidates from GitHub
```

**5. Combined Filters:**
```
Skills: "JavaScript"
Location: "India"
Source: "GitHub Profile"
Results: JavaScript developers in India from GitHub
```

---

## 🎯 Candidate Cards

Each candidate card shows:

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
│ GITHUB PROFILE          by Jane Smith          │
└─────────────────────────────────────────────────┘
```

**Icons:**
- 👁️ View Resume (if available)
- 🗑️ Delete candidate
- 🕐 Years of experience
- 📍 Location
- ✉️ Email

**Badge Colors:**
- 🟦 Blue: Resume Upload
- 🟩 Green: CSV Import
- 🟧 Orange: GitHub Profile (auto-sourced)
- 🟪 Pink: Manual Entry

---

## 🔔 Notifications & Feedback

### Success Messages

**After clicking "Trigger Auto-Sourcing":**
```
✅ Auto-sourcing triggered successfully. Check logs for progress.
```

**After deletion:**
```
✅ Deleted.
```

### Error Messages

**If trigger fails:**
```
❌ Failed to trigger auto-sourcing
```

**If not admin:**
```
❌ Admin access required
```

---

## 📈 Real-Time Updates

### What Updates Automatically

1. **Stats refresh** after triggering (5-second delay)
2. **Candidate list** refreshes after deletion
3. **Pagination** updates when filtering
4. **AI status badge** (green = ready, red = offline)

### What Requires Manual Refresh

1. **Cron job results** (refresh page after 3 AM)
2. **Other recruiters' imports** (refresh to see)

---

## 🎨 Visual Guide

### Admin AI Sourcing Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ 🧠 AI Sourcing — Admin View    [AI Ready] [Trigger]    │
│ All sourced candidates across all recruiters           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Total: 500] [Resume: 200] [CSV: 150] [GitHub: 100]   │
│                                                         │
│ ⚡ Auto-Sourcing Statistics                             │
│ Total Runs: 30 | Imported: 750 | Last: 25 imported    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Search...] [Skills...] [Location...] [Source ▼]      │
│ [Search] [Clear]                                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 500 candidates found                                   │
│                                                         │
│ [Card] [Card] [Card] [Card]                           │
│ [Card] [Card] [Card] [Card]                           │
│ [Card] [Card] [Card] [Card]                           │
│                                                         │
│         [< Prev]  Page 1 of 42  [Next >]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚦 Quick Actions

### View All Auto-Sourced Candidates
1. Go to `/admin/ai-sourcing`
2. Select "GitHub Profile" from source dropdown
3. Click "Search"

### Trigger Sourcing Now
1. Go to `/admin/ai-sourcing`
2. Click "Trigger Auto-Sourcing" button
3. Confirm
4. Wait 5 seconds for stats to update

### Check Last Run
1. Go to `/admin/ai-sourcing`
2. Look at "Auto-Sourcing Statistics" card
3. See "Last run" timestamp and result

### Delete Duplicate
1. Find candidate card
2. Click 🗑️ icon
3. Confirm deletion

### View Candidate Resume
1. Find candidate card
2. Click 👁️ icon
3. Resume opens in new tab

---

## 📱 Mobile View

All features work on mobile:
- Stats cards stack vertically
- Search filters stack
- Candidate cards are responsive
- Trigger button accessible
- Pagination works

---

## 🔐 Permissions

### Admin Only:
- ✅ View all candidates (all recruiters)
- ✅ Trigger auto-sourcing manually
- ✅ Delete any candidate
- ✅ See global statistics

### Recruiter Only:
- ✅ View their own candidates
- ✅ Import candidates manually
- ✅ Delete their own candidates
- ❌ Cannot trigger auto-sourcing
- ❌ Cannot see other recruiters' candidates

---

## 💡 Pro Tips

1. **Filter by GitHub Profile** to see only auto-sourced candidates
2. **Check stats card** to see when last run happened
3. **Trigger manually** if you need candidates urgently (don't wait for 3 AM)
4. **Use skills filter** to find specific tech stacks
5. **Combine filters** for precise searches
6. **Check console logs** after triggering to see progress
7. **Refresh after 5 seconds** to see updated stats

---

## 🐛 Troubleshooting

### "No candidates found"
- Check if cron has run (look at "Last run" timestamp)
- Try triggering manually
- Check if recruiters are verified
- Look at console logs for errors

### "Trigger button not working"
- Ensure you're logged in as admin
- Check browser console for errors
- Verify backend is running
- Check network tab for API errors

### "Stats not updating"
- Wait 5 seconds after triggering
- Refresh the page manually
- Check if backend is running
- Verify API endpoints are accessible

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend logs
3. Verify environment variables (GITHUB_TOKEN)
4. Run test script: `node test-auto-sourcing.js`
5. Check documentation: [AUTO_SOURCING_FEATURE.md](./AUTO_SOURCING_FEATURE.md)

---

**Quick Links:**
- Admin Dashboard: `/admin/dashboard`
- AI Sourcing Page: `/admin/ai-sourcing`
- Recruiter Sourcing: `/recruiter/dashboard/sourcing`
