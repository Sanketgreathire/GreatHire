# Auto-Sourcing System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTO-SOURCING SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   Cron Scheduler │  ← Runs daily at 3 AM (configurable)
│   (autoSourcingCron.js)
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Load Recruiters with Auto-Sourcing Enabled                 │
│  - Check AutoSourcingConfig collection                      │
│  - Fallback to all verified recruiters if no configs        │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  For Each Recruiter:                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. Get Search Criteria (custom or default)            │ │
│  │    - Languages: ['JavaScript', 'Python', 'Java']      │ │
│  │    - Locations: ['India']                             │ │
│  │    - Min Repos: 5                                     │ │
│  │    - Min Followers: 10                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 2. GitHub Scraper                                     │ │
│  │    - Search GitHub API                                │ │
│  │    - Fetch 30 developer profiles                      │ │
│  │    - Extract: name, email, skills, bio, company       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 3. Process Each Profile                               │ │
│  │    ├─ Check Deduplication (dedupHash)                 │ │
│  │    ├─ Normalize Skills                                │ │
│  │    ├─ Create SourcingCandidate                        │ │
│  │    └─ Queue for AI Embedding                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 4. Update Statistics                                  │ │
│  │    - Total runs                                       │ │
│  │    - Imported count                                   │ │
│  │    - Skipped count                                    │ │
│  │    - Last run timestamp                               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

```
GitHub API
    │
    ├─ Search Users
    │  (language, location, repos, followers)
    │
    ▼
┌─────────────────┐
│ GitHub Scraper  │
│ - Fetch profiles│
│ - Parse data    │
│ - Rate limiting │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Auto-Sourcing       │
│ Service             │
│ - Validate data     │
│ - Check duplicates  │
│ - Normalize skills  │
└────────┬────────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│ Deduplication    │   │ Normalization    │
│ Service          │   │ Service          │
│ - Generate hash  │   │ - Standardize    │
│ - Check existing │   │   skill names    │
└────────┬─────────┘   └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ SourcingCandidate    │
         │ Model                │
         │ - Save to MongoDB    │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Embedding Queue      │
         │ - AI processing      │
         │ - Semantic search    │
         └──────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        COMPONENTS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Scrapers                                             │  │
│  │ ├─ githubScraper.js                                  │  │
│  │ │  - Search GitHub users                            │  │
│  │ │  - Fetch detailed profiles                        │  │
│  │ │  - Extract skills from repos                      │  │
│  │ │  - Rate limiting (60/hr or 5000/hr with token)   │  │
│  │ └─ [Future: linkedinScraper.js, etc.]              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Services                                             │  │
│  │ ├─ autoSourcingService.js                           │  │
│  │ │  - Main orchestration                             │  │
│  │ │  - Criteria management                            │  │
│  │ │  - Stats tracking                                 │  │
│  │ ├─ deduplicationService.js                          │  │
│  │ │  - Hash generation                                │  │
│  │ │  - Duplicate detection                            │  │
│  │ └─ normalizationService.js                          │  │
│  │    - Skill standardization                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Cron Jobs                                            │  │
│  │ └─ autoSourcingCron.js                              │  │
│  │    - Scheduler (node-cron)                          │  │
│  │    - Multi-recruiter processing                     │  │
│  │    - Error handling                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Models                                               │  │
│  │ ├─ sourcingCandidate.model.js                       │  │
│  │ │  - Candidate data storage                         │  │
│  │ └─ autoSourcingConfig.model.js                      │  │
│  │    - Per-recruiter configuration                    │  │
│  │    - Statistics tracking                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Routes                                           │  │
│  │ └─ autoSourcing.route.js                            │  │
│  │    - GET  /config    (get configuration)            │  │
│  │    - PUT  /config    (update configuration)         │  │
│  │    - GET  /stats     (get statistics)               │  │
│  │    - POST /trigger   (manual trigger - admin)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│ AutoSourcingConfig Collection                              │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   recruiterId: ObjectId,           // Reference to Recruiter│
│   enabled: Boolean,                // Enable/disable        │
│   criteria: {                                               │
│     languages: [String],           // ['JavaScript', ...]   │
│     locations: [String],           // ['India', ...]        │
│     minRepos: Number,              // Minimum repos         │
│     minFollowers: Number,          // Minimum followers     │
│     maxCandidatesPerRun: Number    // Max per run          │
│   },                                                        │
│   stats: {                                                  │
│     lastRunAt: Date,               // Last execution time   │
│     totalRuns: Number,             // Total executions      │
│     totalImported: Number,         // Total imported        │
│     totalSkipped: Number,          // Total skipped         │
│     lastRunResult: {                                        │
│       imported: Number,                                     │
│       skipped: Number,                                      │
│       errors: Number                                        │
│     }                                                       │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SourcingCandidate Collection                               │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   fullName: String,                                         │
│   emails: [String],                                         │
│   phones: [String],                                         │
│   skills: [String],                                         │
│   normalizedSkills: [String],                               │
│   totalExperience: Number,                                  │
│   currentCompany: String,                                   │
│   designation: String,                                      │
│   location: String,                                         │
│   githubUrl: String,                                        │
│   linkedinUrl: String,                                      │
│   portfolioUrl: String,                                     │
│   resumeUrl: String,                                        │
│   summary: String,                                          │
│   sourceType: 'GITHUB_PROFILE',    // Auto-sourced         │
│   sourceUrl: String,                                        │
│   createdBy: ObjectId,             // Recruiter            │
│   dedupHash: String,               // For deduplication     │
│   embeddingStatus: String,         // AI processing status  │
│   ingestionStatus: String          // Import status         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## API Flow

```
┌──────────────┐
│   Recruiter  │
└──────┬───────┘
       │
       │ GET /api/v1/auto-sourcing/config
       ▼
┌──────────────────────────────────────┐
│ Return current configuration         │
│ - enabled: true/false                │
│ - criteria: { languages, locations } │
└──────────────────────────────────────┘

       │ PUT /api/v1/auto-sourcing/config
       ▼
┌──────────────────────────────────────┐
│ Update configuration                 │
│ - Save to AutoSourcingConfig         │
│ - Return updated config              │
└──────────────────────────────────────┘

       │ GET /api/v1/auto-sourcing/stats
       ▼
┌──────────────────────────────────────┐
│ Return statistics                    │
│ - totalRuns                          │
│ - totalImported                      │
│ - lastRunAt                          │
└──────────────────────────────────────┘

┌──────────────┐
│    Admin     │
└──────┬───────┘
       │
       │ POST /api/v1/auto-sourcing/trigger
       ▼
┌──────────────────────────────────────┐
│ Manually trigger auto-sourcing       │
│ - Run in background                  │
│ - Return immediate response          │
└──────────────────────────────────────┘
```

## Execution Timeline

```
Day 1
├─ 03:00 AM - Cron triggers
├─ 03:01 AM - Load 5 recruiters
├─ 03:02 AM - Recruiter 1: Fetch 30 profiles
├─ 03:05 AM - Recruiter 1: Import 25 candidates
├─ 03:07 AM - Recruiter 2: Fetch 30 profiles
├─ 03:10 AM - Recruiter 2: Import 28 candidates
├─ 03:12 AM - Recruiter 3: Fetch 30 profiles
├─ 03:15 AM - Recruiter 3: Import 22 candidates
├─ 03:17 AM - Recruiter 4: Fetch 30 profiles
├─ 03:20 AM - Recruiter 4: Import 30 candidates
├─ 03:22 AM - Recruiter 5: Fetch 30 profiles
├─ 03:25 AM - Recruiter 5: Import 27 candidates
└─ 03:26 AM - Complete (132 candidates imported)

Day 2
└─ 03:00 AM - Repeat...
```

## Rate Limiting Strategy

```
Without GitHub Token:
├─ 60 requests per hour
├─ ~30 profiles per hour
└─ Suitable for 1-2 recruiters

With GitHub Token:
├─ 5,000 requests per hour
├─ ~2,500 profiles per hour
└─ Suitable for 80+ recruiters

Rate Limiting Implementation:
├─ 1 second delay between profiles (no token)
├─ 100ms delay between profiles (with token)
└─ 2 second delay between recruiters
```

## Error Handling

```
┌─────────────────────────────────────┐
│ Error Scenarios                     │
├─────────────────────────────────────┤
│                                     │
│ 1. GitHub API Rate Limit            │
│    └─ Skip recruiter, continue next │
│                                     │
│ 2. Network Error                    │
│    └─ Retry 3 times, then skip     │
│                                     │
│ 3. Duplicate Candidate              │
│    └─ Skip, increment skipped count│
│                                     │
│ 4. Invalid Profile Data             │
│    └─ Log error, continue next     │
│                                     │
│ 5. Database Error                   │
│    └─ Log error, continue next     │
│                                     │
└─────────────────────────────────────┘
```

## Monitoring & Logs

```
Console Logs:
├─ 🤖 [AUTO-SOURCING] Starting scheduled job...
├─ 📊 Found 5 recruiters for auto-sourcing
├─ 🔍 Auto-sourcing for recruiter: John Doe
├─ ✅ Found 30 GitHub profiles
├─ ✅ Imported 25 candidates for John Doe
├─ ⏭️  Skipped 5 duplicates
├─ 📊 Auto-sourcing summary: { total: 5, successful: 5, totalImported: 120 }
└─ ✅ [AUTO-SOURCING] Completed successfully

Database Stats:
├─ AutoSourcingConfig.stats.totalRuns
├─ AutoSourcingConfig.stats.totalImported
├─ AutoSourcingConfig.stats.lastRunAt
└─ AutoSourcingConfig.stats.lastRunResult
```

---

**System Status:** ✅ Production Ready
