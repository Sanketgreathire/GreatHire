# JD Matching Engine - Quick Reference Guide

## 📋 System Overview (30 seconds)

The AI Job Description Matching Engine automatically finds the best candidates for a job by:
1. **Parsing** the job description to extract skills, experience, designation, etc.
2. **Searching** both semantically (AI embeddings) and by keywords (MongoDB)
3. **Scoring** candidates across 6 dimensions (skill, experience, designation, location, domain, semantic)
4. **Ranking** using 7 weighted signals for superior results
5. **Recommending** candidates grouped into tiers and categories
6. **Learning** from recruiter feedback to improve future matches

---

## 🎯 How Candidates Are Scored (Simple Version)

Each candidate gets a **0-100 score** combining:

| Factor | Weight | Example |
|--------|--------|---------|
| Skills | 30% | Candidate has React, Node.js → 90 |
| Experience | 20% | 6 years, job needs 5-8 → 95 |
| Job Title | 10% | Engineer matches Senior Engineer → 80 |
| Location | 5% | Bangalore matches Bangalore → 100 |
| Industry | 5% | SaaS background matches SaaS job → 90 |
| AI Match | 30% | Vector similarity of profile to JD → 85 |
| **FINAL SCORE** | | **(85-95 = TOP MATCH)** |

---

## 🏆 Match Tiers

```
85-100  🥇 TOP_MATCH       → Call immediately
70-84   🥈 STRONG_MATCH    → Very good fit
55-69   🥉 GOOD_MATCH      → Worth interviewing
40-54   👤 PARTIAL_MATCH   → Consider if desperate
0-39    ❌ WEAK_MATCH      → Skip
```

---

## 🎨 Candidate Categories

```
💎 TOP_CANDIDATE     → Score >= 80, perfect fit
🔮 HIDDEN_GEM        → Has all skills but lower overall score
🔄 ADJACENT_SKILLS   → Related skills, not exact match
🚀 HIGH_POTENTIAL    → Junior but very skilled
📊 STANDARD          → Regular match
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Parse Job Description
```bash
POST /api/v1/jd-matching/parse-jd
Body: { "rawText": "Senior Full Stack Engineer...", "jobId": "123" }
```

### Step 2: Match Candidates
```bash
POST /api/v1/jd-matching/match-candidates/123
Response: { "queued": true, "pollUrl": "/jd-matching/123/matches" }
```

### Step 3: Get Matches
```bash
GET /api/v1/jd-matching/123/matches
Response: [ { candidateName, score, skills, ... }, ... ]
```

---

## 📊 Key Endpoints

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `POST /parse-jd` | Extract JD fields | Parsed skills, exp, domain, etc. |
| `POST /match-candidates/:jobId` | Start matching | Queued status or results |
| `GET /:jobId/matches` | Get results | Paginated candidate matches |
| `GET /:jobId/recommendations` | AI grouping | Top candidates, hidden gems, etc. |
| `PATCH /feedback/:matchId` | Record action | Updated match record |
| `GET /:jobId/feedback-analytics` | Funnel metrics | Shortlist→Contact→Hire rates |
| `GET /:jobId/recruiter-insights` | Your patterns | Your hiring preferences |
| `GET /candidate/:id/history` | Candidate history | All interactions with candidate |

---

## 💡 Feedback Loop

When you take action on a candidate:
```
1. View candidate details
   ↓
2. Click: SHORTLIST / REJECT / CONTACT / HIRED / ON_HOLD
   ↓
3. System records your decision
   ↓
4. System learns your preferences
   → Average hired score: 82
   → You prefer 6-year experience
   → You like React/Node/Docker
   ↓
5. Future matches ranked to your preferences
```

---

## 📈 Feedback Analytics

Track your hiring funnel:
```
100 Total Candidates
  ↓
 45 Shortlisted (45%)
  ↓
 32 Contacted (71% of shortlisted)
  ↓
  8 Hired (25% of contacted)

Conversion Rate: 8% overall
Your sweet spot: Score 80+
```

---

## 🔍 Filtering Matches

Get specific candidates:
```
GET /jd-matching/123/matches?tier=TOP_MATCH&minScore=80
GET /jd-matching/123/matches?category=HIDDEN_GEM
GET /jd-matching/123/matches?feedbackStatus=SHORTLISTED
GET /jd-matching/123/matches?page=2&limit=20
```

---

## ⚡ Performance

| Task | Time | Notes |
|------|------|-------|
| Parse JD | 50ms | Extract fields |
| Match 500 candidates | 500ms-2s | Parallel processing |
| Get results | Instant | Already computed |
| AI insights | <100ms | From stored feedback |

---

## 🛠️ Async Processing

If processing takes time:
```
POST /match-candidates/123
↓
Response (202): "Matching queued for background processing"
↓
Poll GET /matches/123 every 2 seconds
↓
Response (200): "Here are your 142 matches"
```

---

## 🎯 Tips for Better Matches

1. **Write detailed JD**
   - Include specific skills (React, Node.js, MongoDB)
   - Mention experience range (5-8 years)
   - State seniority clearly (Senior, Mid, Junior)
   - Add domain/industry context

2. **Update candidate profiles**
   - Fresh profiles rank higher (freshness signal)
   - Complete skill lists
   - Clear experience years

3. **Provide feedback**
   - Mark as HIRED/REJECTED when decision made
   - System learns your preferences
   - Next job gets better suggestions

4. **Review insights**
   - Check recommended score threshold
   - Review your preferred experience level
   - See your common skill patterns

---

## 🚨 Common Issues

**Q: Why is my top candidate scoring only 45?**
A: Check missing skills. Use `GET /parsed-jd` to see requirements.

**Q: Matching is slow**
A: First run takes 1-2s. Cached results are instant. Check Redis status.

**Q: No semantic results, only keyword matches**
A: AI service may be down. System falls back to keyword search automatically.

**Q: How do I view my hiring preferences?**
A: Use `GET /:jobId/recruiter-insights` (need prior hiring history)

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| `API_DOCUMENTATION.md` | All endpoints with examples |
| `ARCHITECTURE.md` | How system works internally |
| `USAGE_EXAMPLES.js` | Copy-paste code examples |
| `IMPLEMENTATION_SUMMARY.md` | Complete feature list |

---

## 🔐 Security

All endpoints require JWT authentication:
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Rate limits:
- Regular users: 100 req/min
- Premium users: 500 req/min

---

## 📊 Score Breakdown Example

**Candidate: Arjun Singh**
```
Skill Match:        95/100 (has 4/4 required skills + 2 bonus)
Experience:         90/100 (6 years, needs 5-8 years)
Job Title:          88/100 (Senior Engineer matches)
Location:          100/100 (Remote role, in Bangalore)
Industry:           82/100 (SaaS matches some domain keywords)
Semantic (AI):      87/100 (profile vector similar to JD)

HYBRID SCORE = 91/100 = 🥇 TOP_MATCH
```

---

## 🎓 Ranking Signals Explained

```
SEMANTIC (25%)      → AI reads profiles like humans
                     "Does this person feel like a good fit?"

KEYWORD (20%)       → TF-IDF search
                     "How many key skills does this person have?"

SKILL OVERLAP (20%) → Jaccard index (0-1)
                     "How much skill overlap exists?"

EXPERIENCE (15%)    → Years aligned
                     "Is experience in the right range?"

FRESHNESS (8%)      → Profile update recency
                     "Recent profile updates = actively looking"

SENIORITY (7%)      → Career level match
                     "Is seniority aligned?"

LOCATION (5%)       → Geographic/remote fit
                     "Can they work at this location?"
```

---

## 📱 Recruiter Workflow

```
1. Create Job
   ↓
2. Post Description
   ↓
3. System auto-parses JD
   ↓
4. Trigger "Match Candidates"
   ↓
5. Get Results (seconds to minutes)
   ↓
6. Review TOP_CANDIDATES
   ↓
7. SHORTLIST best fits
   ↓
8. Schedule interviews
   ↓
9. Mark CONTACTED when called
   ↓
10. Mark HIRED when offer accepted
    ↓
11. System learns → better matches for next job!
```

---

## 🎁 Example: How Score Changed

**Job Posted**: Senior Full Stack, React/Node/MongoDB, 5-8 years, Bangalore

**Before Feedback Loop**:
- Average match score: 65/100
- You could only pick top 10

**After Recording Feedback** (3 hires):
- All 3 hired candidates scored 82-88
- System learns threshold: 82+
- Next job: recommends candidates scoring 82+
- Saves you time screening

---

## 🔗 API Health Check

Verify system is running:
```bash
GET /api/v1/jd-matching/health
Response: {
  "status": "ok",
  "ai_service": "available",
  "database": "connected",
  "queue": "running"
}
```

---

## 💬 Getting Help

1. **Read the docs**: API_DOCUMENTATION.md
2. **Check examples**: USAGE_EXAMPLES.js
3. **Review logs**: Check LOG_LEVEL=DEBUG output
4. **Test manually**: Use cURL or Postman
5. **Contact support**: Check IMPLEMENTATION_SUMMARY.md

---

## 🌟 Key Features At a Glance

✅ Intelligent JD parsing (40+ skills recognized)
✅ Semantic + keyword hybrid search
✅ 6-dimensional scoring
✅ 7-signal ranking engine
✅ AI recommendations (top, hidden gems, high potential)
✅ Recruiter feedback loop with learning
✅ Conversion funnel analytics
✅ Personalized AI insights
✅ Async background processing
✅ Production-ready error handling
✅ Comprehensive logging
✅ Scalable architecture

---

## 📊 Score Distribution Example

Typical job matching results:

```
Score    Count   Tier            Action
85-100   8       TOP_MATCH       🎯 Call immediately
70-84    24      STRONG_MATCH    ✅ High priority
55-69    35      GOOD_MATCH      🔍 Review
40-54    48      PARTIAL_MATCH   ⏸️ Maybe later
0-39     142     WEAK_MATCH      ❌ Skip
────────────
Total    257     candidates

Recommendation: Call the 8 TOP_MATCH candidates first!
```

---

## 🚀 Pro Tips

1. **Use filters**: Filter by tier=TOP_MATCH to see best fits first
2. **Check insights**: Your hiring patterns help system improve
3. **Batch feedback**: Update multiple candidates at once
4. **Export analytics**: Track your hiring funnel over time
5. **Review metadata**: Score breakdown explains each component

---

**Last Updated**: May 8, 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
