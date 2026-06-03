# Deduplication Fix - Prevent Fetching Same Candidates

## Problem
The system was fetching the same candidates repeatedly from GitHub and other portals because:
1. Deduplication was only checking within each recruiter's candidates
2. No global check across all recruiters
3. Same sorting strategy on every run led to same results

## Solution Implemented

### 1. Global Deduplication Check
**File:** `BackEnd/sourcing/services/deduplicationService.js`

**Changes:**
- Removed `createdBy: recruiterId` filter from all duplicate check conditions
- Now checks for duplicates globally across ALL recruiters
- Prevents the same candidate from being imported multiple times by different recruiters

**Duplicate Detection Methods:**
- ✅ Email match (exact, case-insensitive)
- ✅ Phone match (normalized, digits only)
- ✅ GitHub URL match (normalized, case-insensitive)
- ✅ LinkedIn URL match (normalized, case-insensitive)
- ✅ Full name match (exact, case-insensitive)

### 2. Rotating Sort Strategies for GitHub
**File:** `BackEnd/sourcing/scrapers/githubScraper.js`

**Changes:**
- Implemented 3 different sorting strategies that rotate on each run:
  1. `joined` + `desc` - Recently joined users
  2. `repositories` + `desc` - Users with most repos
  3. `followers` + `desc` - Users with most followers
- Strategy selection based on page number: `page % 3`
- Ensures diverse candidate pool on each auto-sourcing run

**Benefits:**
- Different candidates on each run
- Better coverage of GitHub developer community
- Avoids fetching same top results repeatedly

### 3. How It Works Now

#### First Run (Page 1):
- Uses "joined desc" strategy
- Fetches recently joined developers
- Checks globally for duplicates
- Imports only new candidates

#### Second Run (Page 2):
- Uses "repositories desc" strategy
- Fetches developers with most repos
- Checks globally for duplicates
- Skips already imported candidates

#### Third Run (Page 3):
- Uses "followers desc" strategy
- Fetches popular developers
- Checks globally for duplicates
- Skips already imported candidates

#### Fourth Run (Page 4):
- Cycles back to "joined desc" strategy
- But fetches page 2 of that strategy
- Continues with fresh candidates

## Expected Behavior

### Before Fix:
```
Run 1: Import 30 candidates from GitHub
Run 2: Import same 30 candidates again (duplicates)
Run 3: Import same 30 candidates again (duplicates)
```

### After Fix:
```
Run 1: Import 30 candidates (recently joined)
Run 2: Import 25 new candidates, skip 5 duplicates (most repos)
Run 3: Import 28 new candidates, skip 2 duplicates (most followers)
Run 4: Import 30 new candidates (recently joined, page 2)
```

## Testing

### Manual Test:
```bash
# Run auto-sourcing multiple times
npm run test:auto-sourcing

# Check logs for:
# - "⏭️ Skipping duplicate" messages
# - Different sort strategies being used
# - Decreasing duplicate count over time
```

### Database Check:
```javascript
// Count total sourced candidates
db.sourcingcandidates.countDocuments()

// Check for duplicates by GitHub URL
db.sourcingcandidates.aggregate([
  { $match: { githubUrl: { $ne: "" } } },
  { $group: { _id: "$githubUrl", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])

// Should return 0 duplicates
```

## Additional Improvements

### Deduplication Priority:
1. GitHub URL (highest priority for GitHub profiles)
2. Email address
3. Phone number
4. LinkedIn URL
5. Full name (lowest priority)

### Contact Extraction:
- Extracts emails from bio, README, profile
- Extracts phone numbers (Indian, US, International formats)
- Filters out invalid emails (noreply, example.com)

### Rate Limiting:
- 100ms delay between requests (with token)
- 1000ms delay between requests (without token)
- Prevents API rate limit issues

## Configuration

### Environment Variables:
```bash
# Add GitHub token for higher rate limits
GITHUB_TOKEN=your_github_personal_access_token

# With token: 5000 requests/hour
# Without token: 60 requests/hour
```

### Auto-Sourcing Config:
```javascript
{
  enabled: true,
  criteria: {
    languages: ['JavaScript', 'Python', 'Java', 'TypeScript'],
    locations: ['India', 'Bangalore', 'Hyderabad'],
    minRepos: 1,
    minFollowers: 0
  },
  stats: {
    platformPages: {
      github: 1  // Auto-increments on each run
    }
  }
}
```

## Monitoring

### Check Duplicate Rate:
```bash
# View auto-sourcing stats
curl http://localhost:8000/api/v1/auto-sourcing/stats

# Response includes:
{
  "totalImported": 150,
  "totalSkipped": 25,  // Should be low initially, increase over time
  "lastRunResult": {
    "imported": 28,
    "skipped": 2  // Duplicates found
  }
}
```

### Expected Metrics:
- **First few runs:** Low skip rate (0-5%)
- **After 10+ runs:** Higher skip rate (20-40%)
- **After 50+ runs:** Very high skip rate (60-80%)

This is normal and indicates the system is working correctly!

## Benefits

1. ✅ **No Duplicate Candidates** - Each candidate imported only once
2. ✅ **Diverse Candidate Pool** - Different profiles on each run
3. ✅ **Better Coverage** - Rotating strategies cover more developers
4. ✅ **Efficient** - Skips already imported candidates quickly
5. ✅ **Scalable** - Works across multiple recruiters
6. ✅ **Cost-Effective** - Reduces unnecessary API calls

## Notes

- Deduplication is based on unique identifiers (email, phone, URLs)
- If a candidate updates their GitHub username, they may be imported again
- LinkedIn and other platforms also benefit from global deduplication
- Page tracking ensures continuous progress through candidate pool
