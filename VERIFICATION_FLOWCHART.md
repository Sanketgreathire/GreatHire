# Verification-Based Job Posting - Flowchart

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW RECRUITER SIGNS UP                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  COMPANY CREATED                                 │
│  • isActive: false                                               │
│  • freeJobsPosted: 0                                             │
│  • creditedForJobs: 1000                                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DASHBOARD ACCESS ✅                             │
│  Banner: "Verification Pending: You can post 1 free job"        │
│  Post Job button: ENABLED                                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CLICKS "POST JOB"                               │
│  • Form is accessible                                            │
│  • No blocking message                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POSTS FIRST JOB ✅                              │
│  • Job posted successfully                                       │
│  • freeJobsPosted: 1                                             │
│  • creditedForJobs: 1000 (no deduction)                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  TRIES TO POST SECOND JOB ❌                     │
│  Red Banner: "1 free job remaining. Post after verification"    │
│  Form: LOCKED                                                    │
│  Message: "Wait for admin verification"                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN VERIFIES COMPANY ✅                       │
│  • Admin sets isActive: true                                     │
│  • Automatic unlock triggered                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DASHBOARD UPDATED                               │
│  Banner: Removed or shows "Verified"                             │
│  Post Job button: ENABLED                                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CLICKS "POST JOB" AGAIN                         │
│  Green Banner: "Verified! Post your remaining free job"         │
│  Form: UNLOCKED                                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POSTS SECOND JOB ✅                             │
│  • Job posted successfully                                       │
│  • freeJobsPosted: 2                                             │
│  • creditedForJobs: 1000 (no deduction)                          │
│  • hasUsedFreePlan: true                                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  TRIES TO POST THIRD JOB                         │
│  Check: creditedForJobs >= 500?                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│  YES (≥500)   │           │   NO (<500)   │
└───────┬───────┘           └───────┬───────┘
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│  POST JOB ✅  │           │  BLOCKED ❌   │
│  Deduct 500   │           │  Redirect to  │
│  credits      │           │  Upgrade      │
└───────────────┘           └───────────────┘
```

---

## 🎯 Decision Points

### Decision 1: Can Post First Job?
```
┌─────────────────────────┐
│  isActive = false       │
│  freeJobsPosted = 0     │
└───────────┬─────────────┘
            │
            ▼
    ┌───────────────┐
    │   ALLOWED ✅  │
    └───────────────┘
```

### Decision 2: Can Post Second Job (Not Verified)?
```
┌─────────────────────────┐
│  isActive = false       │
│  freeJobsPosted = 1     │
└───────────┬─────────────┘
            │
            ▼
    ┌───────────────┐
    │   BLOCKED ❌  │
    └───────────────┘
```

### Decision 3: Can Post Second Job (Verified)?
```
┌─────────────────────────┐
│  isActive = true        │
│  freeJobsPosted = 1     │
└───────────┬─────────────┘
            │
            ▼
    ┌───────────────┐
    │   ALLOWED ✅  │
    └───────────────┘
```

### Decision 4: Can Post Third Job?
```
┌─────────────────────────┐
│  freeJobsPosted = 2     │
│  creditedForJobs?       │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌────────┐      ┌────────┐
│ ≥ 500  │      │ < 500  │
│ ALLOW  │      │ BLOCK  │
└────────┘      └────────┘
```

---

## 🔐 Backend Validation Flow

```
POST /api/v1/job/post-job
        │
        ▼
┌─────────────────────────┐
│  Get Company Data       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Check 1:               │
│  !isActive &&           │
│  freeJobsPosted >= 1?   │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌────────┐      ┌────────┐
│  YES   │      │   NO   │
│ 400 ❌ │      │ NEXT ➡ │
└────────┘      └────────┘
                    │
                    ▼
        ┌─────────────────────────┐
        │  Check 2:               │
        │  isActive &&            │
        │  freeJobsPosted >= 2 && │
        │  credits < 500?         │
        └───────────┬─────────────┘
                    │
            ┌───────┴───────┐
            │               │
            ▼               ▼
        ┌────────┐      ┌────────┐
        │  YES   │      │   NO   │
        │ 400 ❌ │      │ NEXT ➡ │
        └────────┘      └────────┘
                            │
                            ▼
                ┌─────────────────────────┐
                │  Check 3:               │
                │  freeJobsPosted >= 2 && │
                │  credits < 500?         │
                └───────────┬─────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
                    ▼               ▼
                ┌────────┐      ┌────────┐
                │  YES   │      │   NO   │
                │ 400 ❌ │      │ POST ✅│
                └────────┘      └────────┘
```

---

## 🎨 UI State Diagram

### RecruiterHome Component
```
┌─────────────────────────────────────────┐
│         RECRUITER HOME PAGE             │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│  isActive =   │   │  isActive =   │
│    false      │   │    true       │
└───────┬───────┘   └───────┬───────┘
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│ YELLOW BANNER │   │  NO BANNER    │
│ "Verification │   │  (or green    │
│  Pending"     │   │   verified)   │
└───────────────┘   └───────────────┘
```

### PostJob Component
```
┌─────────────────────────────────────────┐
│           POST JOB PAGE                 │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│ !isActive &&  │   │  isActive &&  │
│ freeJobs >= 1 │   │ freeJobs = 1  │
└───────┬───────┘   └───────┬───────┘
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│  RED BANNER   │   │ GREEN BANNER  │
│  FORM LOCKED  │   │ FORM UNLOCKED │
└───────────────┘   └───────────────┘
```

---

## 📊 State Transition Table

| Current State | Action | Next State | UI Change |
|--------------|--------|------------|-----------|
| New Company | Sign Up | isActive=false, freeJobs=0 | Yellow banner |
| freeJobs=0 | Post Job | freeJobs=1 | Job posted |
| freeJobs=1, !isActive | Try Post | freeJobs=1 | Red banner, locked |
| freeJobs=1, !isActive | Admin Verify | isActive=true | Green banner |
| freeJobs=1, isActive | Post Job | freeJobs=2 | Job posted |
| freeJobs=2 | Try Post | Check credits | Redirect or post |

---

## 🔄 Credit Deduction Logic

```
POST JOB REQUEST
        │
        ▼
┌─────────────────────────┐
│  freeJobsPosted < 2?    │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌────────┐      ┌────────┐
│  YES   │      │   NO   │
└────┬───┘      └────┬───┘
     │               │
     ▼               ▼
┌────────┐      ┌────────┐
│ FREE   │      │ DEDUCT │
│ +1 to  │      │  500   │
│ counter│      │ credits│
└────────┘      └────────┘
```

---

## 🎯 Key Metrics to Track

```
┌─────────────────────────────────────────┐
│         ANALYTICS DASHBOARD             │
├─────────────────────────────────────────┤
│                                         │
│  📊 Companies with 0 free jobs posted   │
│  📊 Companies with 1 free job posted    │
│  📊 Companies with 2 free jobs posted   │
│  📊 Average verification time           │
│  📊 Conversion rate (1st → 2nd job)     │
│  📊 Credit purchase rate after 2 jobs   │
│                                         │
└─────────────────────────────────────────┘
```

---

**Visual Guide Version:** 1.0.0
**Last Updated:** 2024
