# GreatHire AI Job Description Matching Engine - API Documentation

## Overview

The AI JD Matching Engine is a comprehensive system for intelligent candidate-to-job matching using hybrid ranking combining semantic similarity, keyword matching, and skill analysis.

**Architecture:**
- JD Parsing Service (NLP-based field extraction)
- Embedding Pipeline (Semantic vector generation via Qdrant)
- Hybrid Ranking Engine (Multi-signal scoring)
- Recruiter Feedback Loop (Learning from hiring decisions)
- Async Processing (BullMQ + Redis)

---

## Base URL
```
http://localhost:8000/api/v1/jd-matching
```

## Authentication
All endpoints require JWT bearer token in Authorization header:
```
Authorization: Bearer <recruiterId_jwt_token>
```

---

## Endpoints

### 1. Parse Job Description
**Endpoint:** `POST /parse-jd`

Extract structured fields from raw job description text.

**Request Body:**
```json
{
  "jobId": "65f1234567890abcdef123",  // Optional: existing job ID
  "rawText": "Senior Full Stack Engineer...\n\nRequired:\n- 5+ years experience\n- React, Node.js...\n\nPreferred:\n- TypeScript..."
}
```

**Response (200):**
```json
{
  "success": true,
  "parsedData": {
    "requiredSkills": ["React", "Node.js", "MongoDB", "Docker"],
    "preferredSkills": ["TypeScript", "Kubernetes", "AWS"],
    "designation": "Senior Full Stack Engineer",
    "minExperience": 5,
    "maxExperience": 8,
    "seniorityLevel": "senior",
    "industry": "saas",
    "domain": "ai_ml",
    "location": "Bangalore",
    "educationReq": "Bachelors",
    "jobSummary": "Senior Full Stack Engineer required for high-growth SaaS...",
    "hiddenRequirements": [
      "startup mindset",
      "self-starter",
      "distributed systems"
    ],
    "normalizedSkills": ["react", "nodejs", "mongodb", "docker", "typescript"]
  }
}
```

**Error Responses:**
```json
// 400 - Missing required field
{
  "success": false,
  "message": "rawText is required."
}

// 500 - Processing error
{
  "success": false,
  "message": "Error message"
}
```

---

### 2. Trigger Candidate Matching
**Endpoint:** `POST /match-candidates/:jobId`

Initiate the full matching pipeline for a job (async or sync based on Redis availability).

**Request Body:**
```json
{}  // No body required
```

**Response (202 - Async):**
```json
{
  "success": true,
  "queued": true,
  "message": "Candidate matching queued for background processing.",
  "jobId": "65f1234567890abcdef123",
  "pollUrl": "/api/v1/jd-matching/65f1234567890abcdef123/matches"
}
```

**Response (200 - Sync):**
```json
{
  "success": true,
  "queued": false,
  "jobId": "65f1234567890abcdef123",
  "stats": {
    "matched": 145,
    "skipped": 23,
    "errors": 2
  }
}
```

**Pipeline Process:**
1. Load & parse JD
2. Generate semantic embeddings (if AI service available)
3. Semantic candidate search via Qdrant
4. Keyword candidate search via MongoDB
5. Merge candidate pools
6. Score candidates (6 dimensions):
   - Semantic similarity
   - Skill overlap
   - Experience alignment
   - Designation relevance
   - Location proximity
   - Domain expertise
7. Compute hybrid rank scores
8. Assign tiers & categories
9. Store match records

---

### 3. Get Matched Candidates
**Endpoint:** `GET /:jobId/matches`

Retrieve paginated candidate matches for a job.

**Query Parameters:**
```
page=1              // Pagination: default 1
limit=20            // Per-page: default 20, max 100
tier=TOP_MATCH      // Filter: TOP_MATCH | STRONG_MATCH | GOOD_MATCH | PARTIAL_MATCH | WEAK_MATCH
category=HIDDEN_GEM // Filter: TOP_CANDIDATE | HIDDEN_GEM | ADJACENT_SKILLS | HIGH_POTENTIAL | STANDARD
feedbackStatus=SHORTLISTED  // Filter: PENDING | SHORTLISTED | REJECTED | CONTACTED | HIRED | ON_HOLD
minScore=70         // Min match score (0-100)
```

**Response (200):**
```json
{
  "success": true,
  "jobId": "65f1234567890abcdef123",
  "matches": [
    {
      "_id": "65f1234567890abcdef456",
      "jobId": "65f1234567890abcdef123",
      "candidateId": {
        "_id": "65f1234567890abcdef789",
        "fullName": "Arjun Singh",
        "designation": "Senior Engineer",
        "currentCompany": "TechCorp",
        "location": "Bangalore",
        "skills": ["React", "Node.js", "MongoDB", "Docker"],
        "totalExperience": 6,
        "emails": ["arjun@example.com"],
        "phones": ["+91-999-888-7777"],
        "githubUrl": "https://github.com/arjun"
      },
      "matchScore": 92,
      "hybridScore": 0.92,
      "tier": "TOP_MATCH",
      "category": "TOP_CANDIDATE",
      "semanticScore": 0.87,
      "skillScore": 95,
      "experienceScore": 90,
      "designationScore": 88,
      "locationScore": 100,
      "domainScore": 82,
      "matchedSkills": ["React", "Node.js", "MongoDB", "Docker"],
      "missingSkills": [],
      "bonusSkills": ["AWS", "Kubernetes"],
      "rank": 1,
      "feedback": {
        "status": "SHORTLISTED",
        "note": "Strong technical background",
        "updatedAt": "2024-05-08T10:30:00Z",
        "updatedBy": "65f1234567890abcdef999"
      },
      "rankingMetadata": {
        "experienceGap": 1,
        "seniorityMatch": true,
        "locationMatch": true,
        "educationMatch": true,
        "industryMatch": true,
        "hybridSignals": {
          "semantic": 0.87,
          "keyword": 0.95,
          "skillOverlap": 0.98,
          "experience": 0.90,
          "freshness": 1.0,
          "seniority": 1.0,
          "location": 1.0
        },
        "explanation": "skillOverlap: 98% | experience: 90% | semantic: 87%"
      }
    },
    // ... more matches
  ],
  "pagination": {
    "total": 145,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### 4. Get AI Recommendations
**Endpoint:** `GET /:jobId/recommendations`

Get AI-grouped candidate recommendations organized by quality tiers.

**Response (200):**
```json
{
  "success": true,
  "jobId": "65f1234567890abcdef123",
  "totalMatches": 145,
  "topCandidates": [
    {
      "matchId": "65f1234567890abcdef456",
      "fullName": "Arjun Singh",
      "matchScore": 92,
      "tier": "TOP_MATCH",
      "matchedSkills": ["React", "Node.js", "MongoDB", "Docker"],
      "scores": {
        "semantic": 0.87,
        "skill": 95,
        "experience": 90,
        "designation": 88
      },
      "contact": {
        "email": "arjun@example.com",
        "phone": "+91-999-888-7777",
        "github": "https://github.com/arjun"
      }
    },
    // ... up to 10 top candidates
  ],
  "hiddenGems": [
    // Candidates with all required skills but lower overall score
  ],
  "adjacentSkills": [
    // Candidates with related but not exact skills
  ],
  "highPotential": [
    // Junior candidates with strong skill match
  ],
  "strongMatches": [
    // STRONG_MATCH tier candidates (20 max)
  ],
  "allMatches": [
    // Remaining matches (50 max)
  ],
  "stats": {
    "topCount": 10,
    "hiddenGems": 5,
    "adjacent": 8,
    "highPotential": 4,
    "strong": 20
  }
}
```

---

### 5. Get Parsed JD
**Endpoint:** `GET /:jobId/parsed-jd`

Retrieve the parsed job description fields.

**Response (200):**
```json
{
  "success": true,
  "parsedData": { ... },  // Same as parse-jd endpoint
  "stats": {
    "totalMatches": 145,
    "lastMatchRun": "2024-05-08T10:30:00Z"
  }
}
```

---

### 6. Submit Recruiter Feedback
**Endpoint:** `PATCH /feedback/:matchId`

Record recruiter feedback on a candidate match.

**Request Body:**
```json
{
  "status": "SHORTLISTED",  // SHORTLISTED | REJECTED | CONTACTED | HIRED | ON_HOLD
  "note": "Strong technical skills, good communication",
  "metadata": {
    "interviewRound": 1,
    "interviewDate": "2024-05-15",
    "interviewer": "tech_lead",
    "feedback": "Passed technical round"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "match": {
    "_id": "65f1234567890abcdef456",
    "feedback": {
      "status": "SHORTLISTED",
      "note": "Strong technical skills, good communication",
      "updatedAt": "2024-05-08T11:45:00Z",
      "updatedBy": "65f1234567890abcdef999",
      "metadata": { ... }
    }
  }
}
```

---

### 7. Batch Submit Feedback
**Endpoint:** `POST /feedback/batch`

Update feedback for multiple matches at once.

**Request Body:**
```json
{
  "updates": [
    {
      "matchId": "65f1234567890abcdef456",
      "status": "SHORTLISTED",
      "note": "Good fit"
    },
    {
      "matchId": "65f1234567890abcdef457",
      "status": "REJECTED",
      "note": "Experience too junior"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "updated": 2,
  "failed": 0,
  "results": [
    { "matchId": "...", "success": true, "updated": { ... } },
    { "matchId": "...", "success": true, "updated": { ... } }
  ]
}
```

---

### 8. Get Feedback Analytics
**Endpoint:** `GET /:jobId/feedback-analytics`

Get hiring funnel metrics for a job.

**Response (200):**
```json
{
  "success": true,
  "jobId": "65f1234567890abcdef123",
  "analytics": {
    "total": 145,
    "byStatus": {
      "pending": 87,
      "shortlisted": 42,
      "rejected": 12,
      "contacted": 28,
      "hired": 2,
      "onHold": 0
    },
    "conversionRates": {
      "shortlistToContacted": 0.67,
      "contactedToHired": 0.07,
      "overallConversion": 0.014
    },
    "scoreAnalysis": {
      "hiredAvgScore": 88,
      "rejectedAvgScore": 35,
      "shortlistedAvgScore": 72
    }
  }
}
```

**Insights:**
- **Shortlist-to-Contact Rate**: 67% of shortlisted candidates are contacted
- **Contact-to-Hire Rate**: 7% of contacted candidates are hired
- **Hired Candidates Average Score**: 88/100 (use as quality threshold)
- **Rejected Candidates Average Score**: 35/100 (lower threshold for quick filter)

---

### 9. Get Recruiter Insights
**Endpoint:** `GET /:jobId/recruiter-insights`

AI-generated insights based on recruiter's hiring history.

**Response (200):**
```json
{
  "success": true,
  "jobId": "65f1234567890abcdef123",
  "insights": [
    {
      "type": "score_threshold",
      "message": "You typically hire candidates scoring 82+. Current top matches: check if they exceed this threshold.",
      "avgHireScore": 82
    },
    {
      "type": "experience_preference",
      "message": "You've hired candidates with ~6 years of experience. Consider prioritizing this experience level.",
      "preferredExperience": 6
    },
    {
      "type": "skill_preference",
      "message": "You've hired candidates skilled in: React, Node.js, Docker. Prioritize these in recommendations.",
      "preferredSkills": ["React", "Node.js", "Docker"]
    }
  ]
}
```

---

### 10. Get Candidate Feedback History
**Endpoint:** `GET /candidate/:candidateId/history`

Get all interactions with a specific candidate across jobs.

**Response (200):**
```json
{
  "success": true,
  "candidateId": "65f1234567890abcdef789",
  "history": {
    "total": 8,
    "hired": 1,
    "rejected": 3,
    "shortlisted": 2,
    "contacted": 5,
    "pending": 0,
    "byJob": [
      {
        "jobId": "65f1234567890abcdef123",
        "matchScore": 92,
        "status": "HIRED",
        "feedback": {
          "status": "HIRED",
          "note": "Performed well in interview",
          "updatedAt": "2024-05-08T14:00:00Z"
        }
      },
      // ... more job interactions
    ]
  }
}
```

---

## Scoring System

### Hybrid Rank Score Components

The matching engine combines 7 signals with weighted influence:

| Signal | Weight | Description |
|--------|--------|-------------|
| Semantic | 25% | Vector cosine similarity from embeddings |
| Keyword | 20% | TF-IDF style keyword coverage |
| Skill Overlap | 20% | Jaccard coefficient of skill sets |
| Experience | 15% | Years of experience alignment |
| Freshness | 8% | Profile update recency (reward new profiles) |
| Seniority | 7% | Career level match |
| Location | 5% | Geographic proximity/remote options |

**Example Calculation:**
```
Candidate: 6 yrs exp, React/Node/Python/AWS, Senior, Bangalore
Job: 5-8 yrs, React/Node/MongoDB/Docker/Kubernetes, Senior, Remote

Scores:
- Semantic: 0.85 (strong vector match)
- Keyword: 0.78 (good coverage)
- Skill Overlap: 0.67 (2 of 3 required, Jaccard 67%)
- Experience: 0.95 (within range)
- Freshness: 1.0 (profile updated yesterday)
- Seniority: 1.0 (exact match)
- Location: 0.95 (remote role accepts Bangalore)

Hybrid = (0.85×0.25) + (0.78×0.20) + (0.67×0.20) + (0.95×0.15) + 
         (1.0×0.08) + (1.0×0.07) + (0.95×0.05) = 0.85 (85%)
```

### Match Tiers

| Tier | Score Range | Meaning |
|------|-------------|---------|
| TOP_MATCH | 85-100 | Highly qualified, immediate interview |
| STRONG_MATCH | 70-84 | Well-qualified, good fit |
| GOOD_MATCH | 55-69 | Qualified for role, some gaps |
| PARTIAL_MATCH | 40-54 | Possible fit, notable skill gaps |
| WEAK_MATCH | 0-39 | Poor fit, not recommended |

### Match Categories

| Category | Criteria |
|----------|----------|
| TOP_CANDIDATE | Score >= 80 overall |
| HIDDEN_GEM | Score >= 55 + ALL required skills present |
| ADJACENT_SKILLS | Score >= 45 + 3+ bonus skills |
| HIGH_POTENTIAL | Junior (< min exp) + skill score >= 70 |
| STANDARD | Default category |

---

## Error Handling

### Standard Error Responses

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "JWT token missing or invalid"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:
- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute
- **Premium Recruiters**: 500 requests/minute

---

## Best Practices

### 1. Parsing a JD
```bash
curl -X POST http://localhost:8000/api/v1/jd-matching/parse-jd \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"rawText": "Senior React Engineer..."}'
```

### 2. Triggering Matches (Async)
```bash
curl -X POST http://localhost:8000/api/v1/jd-matching/match-candidates/65f123... \
  -H "Authorization: Bearer <token>"
  
# Poll for results
curl http://localhost:8000/api/v1/jd-matching/65f123.../matches \
  -H "Authorization: Bearer <token>"
```

### 3. Viewing Top Matches
```bash
curl "http://localhost:8000/api/v1/jd-matching/65f123.../recommendations" \
  -H "Authorization: Bearer <token>"
```

### 4. Recording Hiring Decision
```bash
curl -X PATCH http://localhost:8000/api/v1/jd-matching/feedback/65f456... \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "HIRED",
    "note": "Excellent interview performance",
    "metadata": {
      "interviewRound": 2,
      "salary": "₹20 LPA"
    }
  }'
```

### 5. Getting Analytics
```bash
curl http://localhost:8000/api/v1/jd-matching/65f123.../feedback-analytics \
  -H "Authorization: Bearer <token>"
```

---

## Async Processing with BullMQ

Candidate matching automatically uses async processing when Redis is available:

1. **Queued Response**: Immediate 202 response with poll URL
2. **Background Processing**: Worker processes matches in queue
3. **Polling**: Client polls `/matches` endpoint for completion
4. **Retry Logic**: Automatic retry on failure (2 attempts, 5s exponential backoff)

Example polling loop:
```javascript
async function waitForMatches(jobId, maxWait = 60000) {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWait) {
    const res = await fetch(`/api/v1/jd-matching/${jobId}/matches`);
    const data = await res.json();
    if (data.matches?.length > 0) return data;
    await new Promise(r => setTimeout(r, 2000));  // Poll every 2s
  }
  throw new Error('Matching timeout');
}
```

---

## Logging

All operations are logged with structured JSON for easy analysis:

```json
{
  "timestamp": "2024-05-08T10:30:00.123Z",
  "level": "INFO",
  "module": "matching-pipeline",
  "message": "Pipeline completed for jobId=65f123...",
  "jobId": "65f123...",
  "matched": 145,
  "skipped": 23,
  "errors": 0
}
```

Set `LOG_LEVEL` environment variable: `DEBUG | INFO | WARN | ERROR`

---

## Environment Variables

```bash
# AI Service
AI_SERVICE_URL=http://localhost:8001
AI_SERVICE_API_KEY=greathire-ai-secret-key-change-in-prod

# Redis
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
```

---

## Performance Metrics

Typical matching pipeline performance on modern hardware:

| Operation | Time | Candidates |
|-----------|------|-----------|
| JD Parsing | 50ms | - |
| Semantic Search | 200ms | up to 50 |
| Keyword Search | 100ms | up to 500 |
| Scoring (batch 50) | 150ms | 50 |
| Full Pipeline | ~500ms-2s | ~500 |

---

## Future Enhancements

- [ ] Machine learning model for dynamic weight optimization
- [ ] Resume-to-JD matching
- [ ] Multi-language JD parsing
- [ ] Compensation analysis
- [ ] Interview performance prediction
- [ ] Candidate journey analytics

---

## Support

For issues or questions:
1. Check logs: `LOG_LEVEL=DEBUG`
2. Verify AI service: `GET /health`
3. Check Redis: `redis-cli ping`
4. Review match metadata: `GET /:jobId/parsed-jd`
