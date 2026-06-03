# Auto-Sourcing Feature Documentation

## Overview
The Auto-Sourcing feature automatically fetches and imports candidates from public sources into your database. It runs as a scheduled cron job that scrapes GitHub profiles based on configurable criteria.

## Features
✅ **Automated GitHub Scraping** - Fetches developer profiles from GitHub API  
✅ **Smart Deduplication** - Prevents duplicate candidates  
✅ **Skill Normalization** - Standardizes skill names  
✅ **Scheduled Execution** - Runs daily at 3:00 AM (configurable)  
✅ **Rate Limiting** - Respects API limits  
✅ **Multi-Recruiter Support** - Sources for all verified recruiters  

## How It Works

### 1. **GitHub Scraper**
- Searches GitHub users by language, location, repos, followers
- Fetches detailed profiles including bio, skills, company
- Extracts programming languages from repositories
- Rate-limited to avoid API throttling

### 2. **Auto-Sourcing Service**
- Manages the sourcing workflow
- Checks for duplicates before importing
- Normalizes skills and data
- Creates SourcingCandidate records

### 3. **Cron Scheduler**
- Runs daily at 3:00 AM (default)
- Processes all verified recruiters
- Logs results and errors
- Configurable schedule via environment variable

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# GitHub API Token (optional but recommended for higher rate limits)
# Get token from: https://github.com/settings/tokens
GITHUB_TOKEN=your_github_personal_access_token

# Cron schedule (default: 3:00 AM daily)
# Format: minute hour day month weekday
AUTO_SOURCING_SCHEDULE=0 3 * * *

# Examples:
# Every 6 hours: 0 */6 * * *
# Every Monday at 9 AM: 0 9 * * 1
# Twice daily (6 AM & 6 PM): 0 6,18 * * *
```

### GitHub Token Setup

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`
4. Copy token and add to `.env`

**Benefits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

## Usage

### Automatic (Production)

The cron job starts automatically when the server starts:

```bash
npm run dev
# or
node index.js
```

You'll see:
```
✅ Auto-sourcing cron job scheduled: 0 3 * * *
```

### Manual Testing

Test the feature immediately without waiting for cron:

```bash
node test-auto-sourcing.js
```

This will:
1. Connect to database
2. Find all verified recruiters
3. Fetch GitHub profiles for each
4. Import candidates
5. Show results summary

## Search Criteria

Default criteria (can be customized per recruiter):

```javascript
{
  language: 'JavaScript',  // Programming language
  location: 'India',       // Geographic location
  minRepos: 5,            // Minimum public repositories
  minFollowers: 10        // Minimum followers
}
```

### Customization

Edit `autoSourcingService.js` to customize criteria:

```javascript
async getDefaultCriteria(recruiterId) {
  // Example: Fetch from recruiter's active jobs
  const jobs = await Job.find({ createdBy: recruiterId, status: 'active' });
  const skills = jobs.flatMap(j => j.skills);
  
  return {
    language: skills[0] || 'JavaScript',
    location: 'India',
    minRepos: 5,
    minFollowers: 10,
  };
}
```

## Data Flow

```
GitHub API
    ↓
GitHubScraper (fetch profiles)
    ↓
AutoSourcingService (process & validate)
    ↓
DeduplicationService (check duplicates)
    ↓
NormalizationService (standardize skills)
    ↓
SourcingCandidate Model (save to DB)
    ↓
EmbeddingWorker (AI processing - queued)
```

## Monitoring

### Logs

The system logs all activities:

```
🤖 [AUTO-SOURCING] Starting scheduled auto-sourcing job...
📊 Found 5 recruiters for auto-sourcing
🔍 Auto-sourcing for recruiter: John Doe
✅ Found 30 GitHub profiles
✅ Imported 25 candidates for John Doe
📊 Auto-sourcing summary: { total: 5, successful: 5, failed: 0, totalImported: 120 }
✅ [AUTO-SOURCING] Completed successfully
```

### Database

Check imported candidates:

```javascript
// In MongoDB or via API
db.sourcingcandidates.find({ 
  sourceType: 'GITHUB_PROFILE',
  createdAt: { $gte: new Date('2024-01-01') }
})
```

## API Endpoints (Optional)

You can create admin endpoints to control auto-sourcing:

```javascript
// routes/admin/autoSourcing.route.js
router.post('/trigger', async (req, res) => {
  const results = await triggerAutoSourcing();
  res.json(results);
});

router.get('/status', async (req, res) => {
  // Return last run time, stats, etc.
});
```

## Troubleshooting

### Issue: Rate Limit Exceeded

**Solution:** Add `GITHUB_TOKEN` to `.env`

### Issue: No Candidates Found

**Possible causes:**
- Search criteria too strict
- GitHub API down
- Network issues

**Solution:** Check logs, adjust criteria, verify GitHub API status

### Issue: Duplicates Still Created

**Solution:** Ensure deduplication service is working:
```bash
# Check dedupHash field
db.sourcingcandidates.find({ dedupHash: { $exists: true } })
```

### Issue: Cron Not Running

**Solution:** 
1. Check server logs for cron startup message
2. Verify `node-cron` is installed
3. Check schedule format is valid

## Performance

### Rate Limits
- **Without token:** 60 requests/hour = ~30 profiles/hour
- **With token:** 5,000 requests/hour = ~2,500 profiles/hour

### Recommendations
- Run once daily (default)
- Limit to 30 profiles per recruiter per run
- Add 2-second delay between recruiters

## Future Enhancements

### Planned Features
- [ ] LinkedIn scraping (requires API access)
- [ ] Stack Overflow profiles
- [ ] AngelList/Wellfound integration
- [ ] RSS feed parsing for job boards
- [ ] Per-recruiter criteria customization
- [ ] Email notifications for new candidates
- [ ] Admin dashboard for auto-sourcing stats

### Customization Ideas
- Source based on active job requirements
- Geographic targeting per recruiter
- Skill-based filtering
- Experience level filtering
- Company size preferences

## Security & Privacy

### Compliance
- Only scrapes **public** GitHub profiles
- Respects GitHub's Terms of Service
- No private data accessed
- Rate-limited to avoid abuse

### Data Storage
- Stores only public information
- No passwords or tokens stored
- Complies with GDPR (public data)

## Testing Checklist

- [ ] GitHub token configured
- [ ] Cron schedule set
- [ ] Test script runs successfully
- [ ] Candidates appear in database
- [ ] No duplicates created
- [ ] Skills normalized correctly
- [ ] Logs show proper execution
- [ ] Rate limiting works
- [ ] Deduplication works

## Support

For issues or questions:
1. Check logs in console
2. Run test script: `node test-auto-sourcing.js`
3. Verify environment variables
4. Check GitHub API status

## Quick Start

```bash
# 1. Add GitHub token to .env
echo "GITHUB_TOKEN=your_token_here" >> .env

# 2. Start server (cron starts automatically)
npm run dev

# 3. Test manually (optional)
node test-auto-sourcing.js

# 4. Check results in database or admin panel
# Navigate to: /admin/ai-sourcing
```

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2024
