# GreatHire AI JD Matching Engine - Architecture & Implementation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     RECRUITER FRONTEND                          │
│  (Parse JD, View Matches, Submit Feedback, View Analytics)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS BACKEND API                        │
│  ┌─────────────────────────────────────────────────────────────┤
│  │ JD Matching Routes (/api/v1/jd-matching)                   │
│  ├─────────────────────────────────────────────────────────────┤
│  │ • parseJd()                    - Extract JD fields          │
│  │ • matchCandidates()            - Trigger full pipeline      │
│  │ • getMatches()                 - Get results (paginated)    │
│  │ • getRecommendations()         - AI-grouped candidates      │
│  │ • submitFeedback()             - Record hiring decision     │
│  │ • batchSubmitFeedback()        - Bulk feedback update       │
│  │ • getFeedbackAnalytics()       - Funnel metrics             │
│  │ • getRecruiterInsights()       - AI insights from history   │
│  │ • getCandidateFeedbackHistory() - Candidate interactions    │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
         ┌──────────┐  ┌──────────┐  ┌──────────────┐
         │ MongoDB  │  │  Redis   │  │ AI Service   │
         │          │  │          │  │ (Python)     │
         │ • Jobs   │  │ • Queue  │  │              │
         │ • Matches│  │ • Cache  │  │ • Embeddings │
         │ • JDData │  │          │  │ • Qdrant     │
         └──────────┘  └──────────┘  └──────────────┘
```

## Component Architecture

### 1. Core Services

#### **jdParserService.js**
- **Purpose**: Extract structured fields from raw JD text
- **Inputs**: Raw JD text, existing job data
- **Outputs**: Parsed data with skills, experience, designation, etc.
- **Methods**:
  - `parseJobDescription()` - Main parsing function
  - `buildJdEmbeddingText()` - Format for embeddings

#### **jobEmbeddingService.js**
- **Purpose**: Generate and index JD embeddings
- **Integrations**: AI service (embeddings), Qdrant (vector DB)
- **Methods**:
  - `embedAndIndexJob()` - Generate embedding, store in Qdrant

#### **candidateMatchingService.js**
- **Purpose**: Score candidates against parsed JD (6 dimensions)
- **Scoring Dimensions**:
  - Skill match (30%)
  - Experience (20%)
  - Designation relevance (10%)
  - Location (5%)
  - Domain (5%)
  - Semantic similarity (30%)
- **Methods**:
  - `scoreCandidate()` - Compute composite match score
  - `getTier()` - Classify match quality
  - `getCategory()` - Classify candidate type

#### **hybridRankingEngine.js** ✨ NEW
- **Purpose**: Combine multiple ranking signals for superior results
- **Signals** (7 weighted factors):
  - Semantic similarity (25%)
  - Keyword coverage (20%)
  - Skill overlap (20%)
  - Experience (15%)
  - Freshness (8%)
  - Seniority (7%)
  - Location (5%)
- **Methods**:
  - `computeHybridRankScore()` - Multi-signal ranking
  - `sortByHybridRank()` - Sort candidates
  - `groupByHybridTier()` - Group by score bands
  - `diversifyTopCandidates()` - Reduce candidate similarity

#### **matchingPipelineService.js**
- **Purpose**: Orchestrate full matching workflow
- **Pipeline Stages**:
  1. Load job → Parse JD
  2. Generate embeddings
  3. Semantic search (Qdrant)
  4. Keyword search (MongoDB)
  5. Merge candidate pools
  6. Score all candidates
  7. Compute hybrid ranks
  8. Assign tiers & categories
  9. Bulk upsert results
  10. Assign final ranks
- **Methods**:
  - `runMatchingPipeline()` - Execute full pipeline
  - `assignRanks()` - Compute final ranking

#### **recruiterFeedbackService.js** ✨ NEW
- **Purpose**: Track feedback and generate recruiter insights
- **Features**:
  - Record feedback (HIRED, REJECTED, CONTACTED, etc.)
  - Compute conversion funnels
  - Extract hiring patterns
  - Generate recommendations
- **Methods**:
  - `recordFeedback()` - Save recruiter decision
  - `getFeedbackAnalytics()` - Funnel metrics
  - `getRecruiterInsights()` - Pattern extraction
  - `getCandidateFeedbackHistory()` - Candidate interactions

#### **recommendationEngine.js**
- **Purpose**: Bucket candidates into AI recommendation groups
- **Buckets**:
  - Top Candidates (score >= 80)
  - Hidden Gems (all required skills, lower score)
  - Adjacent Skills (related skills)
  - High Potential (junior but skilled)
  - Strong Matches
- **Methods**:
  - `buildRecommendations()` - Create recommendation groups
  - `updateMatchFeedback()` - Update recruiter feedback

#### **aiJdClient.js**
- **Purpose**: Client for Python AI service
- **Functions**:
  - `isAiServiceAvailable()` - Health check
  - `embedText()` - Generate embedding
  - `searchCandidatesForJd()` - Semantic search
  - `indexJobInQdrant()` - Index JD embedding
- **Integration**: FastAPI microservice (Python)

### 2. Data Models

#### **jdEmbedding.model.js**
```javascript
{
  jobId,                    // Reference to Job
  recruiterId,              // Reference to Recruiter
  parsedData: {
    requiredSkills,
    preferredSkills,
    designation,
    minExperience, maxExperience,
    seniorityLevel,
    industry, domain,
    location,
    educationReq,
    jobSummary,
    hiddenRequirements,
    normalizedSkills
  },
  embeddingStatus: PENDING|PROCESSING|DONE|FAILED,
  qdrantIndexed: boolean,
  lastMatchRun: Date,
  totalMatches: number
}
```

#### **candidateJobMatch.model.js**
```javascript
{
  jobId,                    // Reference to Job
  candidateId,              // Reference to SourcingCandidate
  recruiterId,
  
  // Composite Scores (0-100)
  matchScore,               // Final hybrid score
  hybridScore,              // Normalized 0-1
  semanticScore,            // Vector similarity
  skillScore,               // Skill match %
  experienceScore,          // Experience alignment
  designationScore,         // Job title relevance
  locationScore,            // Geographic fit
  domainScore,              // Industry expertise
  
  // Skill Analysis
  matchedSkills: [String],
  missingSkills: [String],
  bonusSkills: [String],
  
  // Classification
  tier: TOP_MATCH|STRONG_MATCH|GOOD_MATCH|PARTIAL_MATCH|WEAK_MATCH,
  category: TOP_CANDIDATE|HIDDEN_GEM|ADJACENT_SKILLS|HIGH_POTENTIAL|STANDARD,
  rank: number,
  
  // Recruiter Feedback
  feedback: {
    status: PENDING|SHORTLISTED|REJECTED|CONTACTED|HIRED|ON_HOLD,
    note: String,
    updatedAt: Date,
    updatedBy: Recruiter,
    metadata: Object
  }
}
```

### 3. Async Processing

#### **jdMatchingQueue.js**
- BullMQ queue configuration
- Handles background job processing
- Retry logic: 2 attempts, exponential backoff

#### **jdMatchingWorker.js**
- Worker process for queue jobs
- Concurrency: 2 jobs
- Logs all processing events

### 4. API Routes

#### **jdMatching.route.js**
```
POST   /parse-jd                    - Parse raw JD
POST   /match-candidates/:jobId     - Trigger matching
GET    /:jobId/parsed-jd            - Get parsed fields
GET    /:jobId/matches              - Get match results (paginated, filterable)
GET    /:jobId/recommendations      - Get AI recommendations
PATCH  /feedback/:matchId           - Submit feedback
POST   /feedback/batch              - Batch feedback
GET    /:jobId/feedback-analytics   - Get funnel metrics
GET    /:jobId/recruiter-insights   - Get AI insights
GET    /candidate/:candidateId/history - Candidate interactions
```

### 5. Error Handling & Logging

#### **logger.js** ✨ NEW
- Centralized logging
- Structured JSON format
- Module-specific convenience methods
- Configurable log levels

#### **Error Handling**
- Try-catch in all async operations
- Graceful degradation (e.g., keyword search when AI unavailable)
- Detailed error logging with context

---

## Data Flow Diagrams

### Matching Pipeline Flow
```
Job Posted
    ↓
Parse JD (extract: skills, exp, domain, etc.)
    ↓
Upsert JDEmbedding record (status: PENDING)
    ↓
┌─ Semantic Search ─────────┐  ┌─ Keyword Search ─────────┐
│ 1. Build embedding text   │  │ 1. Create MongoDB query  │
│ 2. Call AI service        │  │ 2. Search by skills      │
│ 3. Get vector embedding   │  │ 3. Get up to 500 results │
│ 4. Query Qdrant (top 200) │  │                          │
└───────────────────────────┘  └──────────────────────────┘
    ↓                                    ↓
    └─────────────┬──────────────────────┘
                  ↓
        Merge & Deduplicate Pools
                  ↓
        ┌─────────────────────────┐
        │ For Each Candidate:     │
        ├─────────────────────────┤
        │ • Compute 6 core scores │
        │ • Compute hybrid rank   │
        │ • Classify tier & cat   │
        │ • Build metadata        │
        └─────────────────────────┘
                  ↓
        Bulk Upsert Match Records
                  ↓
        Assign Final Ranks
                  ↓
        Update JDEmbedding Stats
                  ↓
        ✅ DONE - Results ready to fetch
```

### Feedback Learning Flow
```
Recruiter Views Candidate
    ↓
   Recruiter Takes Action
    ├─ SHORTLIST
    ├─ REJECT
    ├─ CONTACT
    ├─ HIRED ← Learning Signal
    └─ ON_HOLD
       ↓
   Record Feedback
       ↓
   If HIRED/REJECTED:
   Extract Learning Signals
   (score pattern, skill preference, experience level)
       ↓
   (Future) Feed to ML Model
   to optimize weights
```

---

## Integration Points

### Python AI Service Integration
```
Backend (Node.js)          Python AI Service
    │                          │
    ├─ POST /embed             │
    │  (text)  ───────────────→│ → embedText()
    │  ←─────────────────────── │ (embedding vector)
    │
    ├─ POST /embed/batch       │
    │  (texts) ───────────────→│ → embedBatch()
    │  ←─────────────────────── │ (embeddings)
    │
    ├─ POST /candidates/index  │
    │  (candidate) ──────────→ │ → Qdrant indexing
    │  ←─────────────────────── │ (indexed)
    │
    └─ POST /search/semantic   │
       (query, recruiter_id) ─→│ → searchCandidates()
       ←─────────────────────── │ (top-k results)
```

### Database Indexes

**MongoDB (Candidate Matching)**
```javascript
// jdEmbedding collection
db.jdembeddings.createIndex({ jobId: 1, recruiterId: 1 }, { unique: true })
db.jdembeddings.createIndex({ recruiterId: 1, createdAt: -1 })

// candidateJobMatch collection
db.candidateJobmatches.createIndex({ jobId: 1, candidateId: 1 }, { unique: true })
db.candidateJobmatches.createIndex({ jobId: 1, matchScore: -1 })
db.candidateJobmatches.createIndex({ jobId: 1, tier: 1, matchScore: -1 })
db.candidateJobmatches.createIndex({ recruiterId: 1, createdAt: -1 })
db.candidateJobmatches.createIndex({ "feedback.status": 1, recruiterId: 1 })
```

---

## Performance Considerations

### Scalability
- **Batch Processing**: Score 50 candidates at a time (MongoDB batch limits)
- **Async Processing**: Use Redis/BullMQ for background matching
- **Pagination**: Always paginate match results (20 per page default)
- **Indexes**: Proper indexing on job, recruiter, scores, tiers

### Caching
- Cache parsed JD data in MongoDB
- Use Redis for queue state
- AI service embeddings are indexed in Qdrant (persistent)

### Memory
- Stream large candidate queries
- Avoid loading entire result sets
- Use `.lean()` in queries where possible

---

## Testing Checklist

- [ ] JD Parsing: Test with various JD formats
- [ ] Skill extraction: Verify skill normalization
- [ ] Embedding generation: Test with AI service
- [ ] Semantic search: Verify Qdrant queries
- [ ] Scoring: Validate score calculations
- [ ] Hybrid ranking: Check signal combinations
- [ ] Match storage: Verify bulk upsert
- [ ] Feedback: Test all status transitions
- [ ] Analytics: Verify funnel calculations
- [ ] Async processing: Test queue mechanics
- [ ] Error handling: Test degradation modes
- [ ] Rate limiting: Verify API throttling

---

## Future Enhancements

1. **Machine Learning**
   - Learn optimal weights from hiring feedback
   - Predict interview success rate

2. **Resume Parsing**
   - Extract candidate data from uploaded resumes
   - Auto-populate candidate profile

3. **Compensation Analysis**
   - Analyze salary expectations vs. JD budget
   - Market comparison

4. **Candidate Outreach**
   - AI-generated personalized messages
   - Timing optimization

5. **Interview Intelligence**
   - AI-powered interview questions
   - Performance prediction

6. **Multi-language**
   - Support JDs in multiple languages
   - Translation + parsing

7. **Real-time Dashboards**
   - Live funnel updates
   - Recruiter activity tracking

---

## Deployment

### Environment Variables
```bash
# AI Service
AI_SERVICE_URL=http://ai-service:8001
AI_SERVICE_API_KEY=<secret>

# Redis/Queue
REDIS_URL=redis://redis:6379

# Database
MONGODB_URI=mongodb+srv://...

# Logging
LOG_LEVEL=INFO
```

### Scaling Strategy
1. **Stateless API**: Multiple instances behind load balancer
2. **Queue Workers**: Deploy multiple jdMatchingWorker instances
3. **Database**: Proper indexing, read replicas
4. **AI Service**: Horizontal scaling with load balancing
5. **Qdrant**: Cluster mode for high availability

---

## Monitoring

Track these metrics:
- Matching pipeline duration
- Semantic search success rate
- Average match scores by job
- Feedback submission rate
- Conversion funnel rates
- AI service availability
- Queue processing times

---

## File Structure
```
jd-matching/
├── jdMatching.route.js              # Routes
├── jdMatchingController.js           # Controllers
├── models/
│   ├── jdEmbedding.model.js
│   └── candidateJobMatch.model.js
├── services/
│   ├── jdParserService.js
│   ├── jobEmbeddingService.js
│   ├── candidateMatchingService.js
│   ├── hybridRankingEngine.js        # ✨ NEW
│   ├── matchingPipelineService.js
│   ├── recruiterFeedbackService.js   # ✨ NEW
│   ├── recommendationEngine.js
│   └── aiJdClient.js
├── queues/
│   └── jdMatchingQueue.js
├── workers/
│   └── jdMatchingWorker.js
├── API_DOCUMENTATION.md             # ✨ NEW
└── USAGE_EXAMPLES.js                # ✨ NEW
```

---

## Support & Troubleshooting

**Issue**: Matching hangs or times out
- Check AI service health: `GET /health`
- Verify Redis availability: `redis-cli ping`
- Check MongoDB indexes

**Issue**: Low match scores
- Verify JD parsing: `GET /:jobId/parsed-jd`
- Check candidate skills normalization
- Review hybrid signal breakdown

**Issue**: Empty semantic results
- Verify Qdrant connectivity
- Check candidate embedding status
- Ensure AI service has processed candidates

**Issue**: Slow feedback analytics
- Add index on `feedback.status`
- Use time-range filters
- Archive old match records

---

## Summary

This comprehensive AI JD Matching Engine provides:
✅ Intelligent job description parsing
✅ Semantic vector-based candidate search
✅ Hybrid multi-signal ranking
✅ AI-powered candidate recommendations
✅ Recruiter feedback loop & learning
✅ Production-ready async processing
✅ Comprehensive analytics & insights
✅ Scalable, modular architecture

All backend implementation - ready for frontend UI integration!
