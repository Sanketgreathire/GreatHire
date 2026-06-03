# Auto-Sourcing Quick Start Guide

## What is Auto-Sourcing?

Automatically fetch developer profiles from GitHub and import them into your candidate database. Runs daily at 3:00 AM.

## Setup (2 minutes)

### Step 1: Get GitHub Token (Optional but Recommended)

1. Visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: "GreatHire Auto-Sourcing"
4. Select scopes: `public_repo`, `read:user`
5. Click "Generate token"
6. Copy the token

### Step 2: Add to Environment

Edit `BackEnd/.env`:

```bash
# GitHub Token (increases rate limit from 60 to 5000 requests/hour)
GITHUB_TOKEN=ghp_your_token_here

# Optional: Change schedule (default is 3 AM daily)
AUTO_SOURCING_SCHEDULE=0 3 * * *
```

### Step 3: Start Server

```bash
cd BackEnd
npm run dev
```

You should see:
```
✅ Auto-sourcing cron job scheduled: 0 3 * * *
```

## Test It Now

Don't want to wait until 3 AM? Test immediately:

```bash
cd BackEnd
node test-auto-sourcing.js
```

Expected output:
```
🚀 Testing Auto-Sourcing Feature...
📊 Found 5 recruiters for auto-sourcing
🔍 Auto-sourcing for recruiter: John Doe
✅ Found 30 GitHub profiles
✅ Imported 25 candidates for John Doe
📊 Auto-sourcing summary: { total: 5, successful: 5, totalImported: 120 }
✅ Test completed successfully!
```

## View Results

### Option 1: Admin Dashboard
1. Login as admin
2. Navigate to `/admin/ai-sourcing`
3. See all auto-sourced candidates

### Option 2: Recruiter Dashboard
1. Login as recruiter
2. Navigate to `/recruiter/dashboard/sourcing`
3. See your sourced candidates

### Option 3: Database
```javascript
db.sourcingcandidates.find({ 
  sourceType: 'GITHUB_PROFILE' 
}).sort({ createdAt: -1 })
```

## How It Works

```
Every day at 3 AM:
  ↓
For each verified recruiter:
  ↓
Search GitHub for developers
  ↓
Fetch 30 profiles (JavaScript, India, 5+ repos)
  ↓
Check for duplicates
  ↓
Import new candidates
  ↓
Queue for AI processing
```

## Customize Search Criteria

Edit `BackEnd/sourcing/services/autoSourcingService.js`:

```javascript
async getDefaultCriteria(recruiterId) {
  return {
    language: 'Python',      // Change language
    location: 'USA',         // Change location
    minRepos: 10,           // More repos
    minFollowers: 50,       // More followers
  };
}
```

## Schedule Options

Change when it runs by editing `AUTO_SOURCING_SCHEDULE`:

```bash
# Every 6 hours
AUTO_SOURCING_SCHEDULE=0 */6 * * *

# Every Monday at 9 AM
AUTO_SOURCING_SCHEDULE=0 9 * * 1

# Twice daily (6 AM & 6 PM)
AUTO_SOURCING_SCHEDULE=0 6,18 * * *

# Every hour
AUTO_SOURCING_SCHEDULE=0 * * * *
```

## Troubleshooting

### No candidates imported?

**Check logs:**
```bash
# Look for errors in console
```

**Verify GitHub API:**
```bash
curl https://api.github.com/search/users?q=language:javascript
```

**Check criteria:**
- Too strict? Lower minRepos/minFollowers
- Wrong location? Change to broader area

### Rate limit errors?

**Add GitHub token** to `.env` (see Step 1)

### Duplicates created?

**Check deduplication:**
```javascript
db.sourcingcandidates.find({ 
  dedupHash: { $exists: true } 
})
```

## What Gets Imported?

For each GitHub profile:
- ✅ Full name
- ✅ Email (if public)
- ✅ GitHub URL
- ✅ Location
- ✅ Company
- ✅ Bio/Summary
- ✅ Skills (from repo languages)
- ✅ Public repos count
- ✅ Followers count

## Next Steps

1. ✅ Set up GitHub token
2. ✅ Test with `node test-auto-sourcing.js`
3. ✅ Check results in admin panel
4. ✅ Customize search criteria
5. ✅ Adjust schedule if needed

## Full Documentation

See [AUTO_SOURCING_FEATURE.md](./AUTO_SOURCING_FEATURE.md) for:
- Advanced configuration
- API integration
- Performance tuning
- Security details
- Future enhancements

---

**Ready to go!** The system will automatically source candidates every day at 3 AM.
