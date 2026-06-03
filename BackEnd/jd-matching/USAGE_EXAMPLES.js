/**
 * USAGE_EXAMPLES.js
 * Example code for using the JD Matching Engine APIs
 * 
 * Copy and adapt these examples for your application
 */

// ============================================================================
// 1. PARSE A JOB DESCRIPTION
// ============================================================================

async function parseJobDescription() {
  const jobDescriptionText = `
    We are looking for a Senior Full Stack Engineer to join our growing team.
    
    Position: Senior Full Stack Engineer
    Location: Bangalore (Remote-friendly)
    
    About the Role:
    Build scalable web applications used by millions. You'll work with modern
    technologies and collaborate with talented engineers in a fast-paced startup
    environment.
    
    Requirements (Must-have):
    - 5-8 years of experience in full-stack development
    - Strong proficiency in React.js and Node.js
    - Experience with MongoDB and SQL databases
    - Docker and containerization knowledge
    - REST API design and GraphQL
    
    Preferred Skills:
    - TypeScript expertise
    - Kubernetes orchestration
    - AWS or GCP cloud experience
    - Experience with Elasticsearch
    - CI/CD pipeline setup
    
    Qualifications:
    - Bachelor's degree in Computer Science or equivalent
    - Experience in SaaS product development
    - Previous startup experience preferred
    
    Why Join Us:
    - Competitive salary: ₹18-24 LPA
    - Stock options
    - Flexible work arrangements
    - Health insurance
  `;

  try {
    const response = await fetch('http://localhost:8000/api/v1/jd-matching/parse-jd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_JWT_TOKEN}`
      },
      body: JSON.stringify({
        rawText: jobDescriptionText,
        jobId: '65f1234567890abcdef123'  // Optional: link to job in DB
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Parsed JD:', data.parsedData);
      // Output:
      // {
      //   requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'Docker', 'REST API', 'GraphQL'],
      //   preferredSkills: ['TypeScript', 'Kubernetes', 'AWS', 'Elasticsearch', 'CI/CD'],
      //   designation: 'Senior Full Stack Engineer',
      //   minExperience: 5,
      //   maxExperience: 8,
      //   seniorityLevel: 'senior',
      //   domain: 'saas',
      //   location: 'Bangalore',
      //   educationReq: 'Bachelors',
      //   ...
      // }
      return data.parsedData;
    }
  } catch (error) {
    console.error('❌ Parse error:', error);
  }
}

// ============================================================================
// 2. TRIGGER CANDIDATE MATCHING (ASYNC)
// ============================================================================

async function triggerMatching(jobId) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/match-candidates/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YOUR_JWT_TOKEN}`
        }
      }
    );

    const data = await response.json();
    
    if (data.success && data.queued) {
      console.log('⏳ Matching queued for background processing');
      console.log(`Poll URL: ${data.pollUrl}`);
      return data;
    } else if (data.success) {
      console.log('✅ Synchronous matching completed:', data.stats);
      return data;
    }
  } catch (error) {
    console.error('❌ Matching trigger error:', error);
  }
}

// ============================================================================
// 3. POLL FOR MATCH RESULTS
// ============================================================================

async function waitForMatches(jobId, maxWaitMs = 120000) {
  const startTime = Date.now();
  let pollCount = 0;

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/jd-matching/${jobId}/matches`,
        {
          headers: { 'Authorization': `Bearer ${YOUR_JWT_TOKEN}` }
        }
      );

      const data = await response.json();
      pollCount++;

      if (data.matches && data.matches.length > 0) {
        console.log(`✅ Matches received after ${pollCount} polls`);
        return data;
      }

      console.log(`⏳ Poll #${pollCount}: No matches yet, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));  // Wait 2s
    } catch (error) {
      console.error('❌ Poll error:', error);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error(`Matching timeout after ${maxWaitMs}ms`);
}

// ============================================================================
// 4. GET AI RECOMMENDATIONS
// ============================================================================

async function getRecommendations(jobId) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/${jobId}/recommendations`,
      {
        headers: { 'Authorization': `Bearer ${YOUR_JWT_TOKEN}` }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log('📊 AI Recommendations:');
      console.log(`  🥇 Top Candidates: ${data.topCandidates?.length || 0}`);
      console.log(`  💎 Hidden Gems: ${data.hiddenGems?.length || 0}`);
      console.log(`  🔄 Adjacent Skills: ${data.adjacentSkills?.length || 0}`);
      console.log(`  🚀 High Potential: ${data.highPotential?.length || 0}`);
      
      // Print top candidate
      if (data.topCandidates?.length > 0) {
        const top = data.topCandidates[0];
        console.log(`\n🌟 Top Match: ${top.fullName}`);
        console.log(`   Match Score: ${top.matchScore}/100`);
        console.log(`   Skills: ${top.matchedSkills.join(', ')}`);
        console.log(`   Contact: ${top.contact.email}`);
      }
      
      return data;
    }
  } catch (error) {
    console.error('❌ Recommendations error:', error);
  }
}

// ============================================================================
// 5. GET FILTERED MATCHES
// ============================================================================

async function getFilteredMatches(jobId, options = {}) {
  const {
    tier = 'TOP_MATCH',              // TOP_MATCH, STRONG_MATCH, etc.
    category = 'TOP_CANDIDATE',      // TOP_CANDIDATE, HIDDEN_GEM, etc.
    minScore = 70,
    page = 1,
    limit = 20
  } = options;

  const params = new URLSearchParams({
    tier,
    category,
    minScore,
    page,
    limit
  });

  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/${jobId}/matches?${params}`,
      {
        headers: { 'Authorization': `Bearer ${YOUR_JWT_TOKEN}` }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Found ${data.pagination.total} matches`);
      
      data.matches.forEach((match, idx) => {
        console.log(`\n${idx + 1}. ${match.candidateId.fullName}`);
        console.log(`   Score: ${match.matchScore}/100 (${match.tier})`);
        console.log(`   Skills: ${match.matchedSkills.join(', ')}`);
        console.log(`   Experience: ${match.candidateId.totalExperience} years`);
        console.log(`   Missing: ${match.missingSkills.join(', ') || 'None'}`);
      });

      return data;
    }
  } catch (error) {
    console.error('❌ Get matches error:', error);
  }
}

// ============================================================================
// 6. SUBMIT RECRUITER FEEDBACK
// ============================================================================

async function submitFeedback(matchId, status, note = '') {
  const validStatuses = ['SHORTLISTED', 'REJECTED', 'CONTACTED', 'HIRED', 'ON_HOLD'];
  
  if (!validStatuses.includes(status)) {
    console.error(`❌ Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/feedback/${matchId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUR_JWT_TOKEN}`
        },
        body: JSON.stringify({
          status,
          note,
          metadata: {
            interviewRound: 1,
            interviewDate: new Date().toISOString().split('T')[0],
            feedback: note
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Feedback recorded: ${status}`);
      return data.match;
    }
  } catch (error) {
    console.error('❌ Feedback submission error:', error);
  }
}

// ============================================================================
// 7. BATCH UPDATE FEEDBACK
// ============================================================================

async function batchUpdateFeedback(updates) {
  // updates: [
  //   { matchId: "...", status: "SHORTLISTED", note: "..." },
  //   { matchId: "...", status: "REJECTED", note: "..." },
  //   ...
  // ]

  try {
    const response = await fetch(
      'http://localhost:8000/api/v1/jd-matching/feedback/batch',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUR_JWT_TOKEN}`
        },
        body: JSON.stringify({ updates })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Batch update: ${data.updated} successful, ${data.failed} failed`);
      return data;
    }
  } catch (error) {
    console.error('❌ Batch feedback error:', error);
  }
}

// ============================================================================
// 8. GET FEEDBACK ANALYTICS
// ============================================================================

async function getFeedbackAnalytics(jobId) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/${jobId}/feedback-analytics`,
      {
        headers: { 'Authorization': `Bearer ${YOUR_JWT_TOKEN}` }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      const a = data.analytics;
      console.log('📈 Feedback Analytics:');
      console.log(`  Total Candidates: ${a.total}`);
      console.log(`  Shortlisted: ${a.byStatus.shortlisted} (${(a.byStatus.shortlisted/a.total*100).toFixed(1)}%)`);
      console.log(`  Contacted: ${a.byStatus.contacted} (${(a.byStatus.contacted/a.total*100).toFixed(1)}%)`);
      console.log(`  Hired: ${a.byStatus.hired} (${(a.byStatus.hired/a.total*100).toFixed(1)}%)`);
      console.log(`\nConversion Rates:`);
      console.log(`  Shortlist → Contact: ${(a.conversionRates.shortlistToContacted*100).toFixed(1)}%`);
      console.log(`  Contact → Hire: ${(a.conversionRates.contactedToHired*100).toFixed(1)}%`);
      console.log(`  Overall: ${(a.conversionRates.overallConversion*100).toFixed(1)}%`);
      console.log(`\nAverage Scores:`);
      console.log(`  Hired: ${a.scoreAnalysis.hiredAvgScore}/100`);
      console.log(`  Rejected: ${a.scoreAnalysis.rejectedAvgScore}/100`);
      console.log(`  Shortlisted: ${a.scoreAnalysis.shortlistedAvgScore}/100`);

      return data;
    }
  } catch (error) {
    console.error('❌ Analytics error:', error);
  }
}

// ============================================================================
// 9. GET RECRUITER INSIGHTS
// ============================================================================

async function getRecruiterInsights(jobId) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/${jobId}/recruiter-insights`,
      {
        headers: { 'Authorization': `Bearer ${YOUR_JWT_TOKEN}` }
      }
    );

    const data = await response.json();
    
    if (data.success && data.insights.length > 0) {
      console.log('💡 AI Recruiter Insights:');
      data.insights.forEach((insight, idx) => {
        console.log(`\n${idx + 1}. ${insight.message}`);
        if (insight.avgHireScore) console.log(`   → Recommended Score Threshold: ${insight.avgHireScore}`);
        if (insight.preferredExperience) console.log(`   → Preferred Experience: ${insight.preferredExperience} years`);
        if (insight.preferredSkills) console.log(`   → Preferred Skills: ${insight.preferredSkills.join(', ')}`);
      });
    } else {
      console.log('ℹ️ No insights available (need more hiring history)');
    }

    return data;
  } catch (error) {
    console.error('❌ Insights error:', error);
  }
}

// ============================================================================
// 10. CANDIDATE INTERACTION HISTORY
// ============================================================================

async function getCandidateHistory(candidateId) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/jd-matching/candidate/${candidateId}/history`,
      {
        headers: { 'Authorization': `Bearer ${YOUR_JWT_TOKEN}` }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      const h = data.history;
      console.log(`📋 Candidate Interaction History:`);
      console.log(`  Total Jobs Applied: ${h.total}`);
      console.log(`  Hired: ${h.hired}`);
      console.log(`  Rejected: ${h.rejected}`);
      console.log(`  Shortlisted: ${h.shortlisted}`);
      console.log(`  Contacted: ${h.contacted}`);

      console.log(`\nInteraction Details:`);
      h.byJob.forEach((job, idx) => {
        console.log(`  ${idx + 1}. Score: ${job.matchScore} - Status: ${job.status}`);
      });

      return data;
    }
  } catch (error) {
    console.error('❌ History error:', error);
  }
}

// ============================================================================
// COMPLETE WORKFLOW EXAMPLE
// ============================================================================

async function completeMatchingWorkflow() {
  console.log('🚀 Starting complete JD matching workflow\n');

  const jobId = '65f1234567890abcdef123';  // Your job ID

  try {
    // Step 1: Get parsed JD
    console.log('Step 1️⃣ : Getting parsed JD...');
    const parsedJd = await parseJobDescription();
    console.log('✅ JD parsed\n');

    // Step 2: Trigger matching
    console.log('Step 2️⃣ : Triggering candidate matching...');
    const matchResult = await triggerMatching(jobId);
    console.log('✅ Matching triggered\n');

    // Step 3: Wait for results (if async)
    if (matchResult.queued) {
      console.log('Step 3️⃣ : Waiting for background processing...');
      const matchesData = await waitForMatches(jobId);
      console.log(`✅ Got ${matchesData.matches.length} matches\n`);
    }

    // Step 4: Get AI recommendations
    console.log('Step 4️⃣ : Getting AI recommendations...');
    await getRecommendations(jobId);
    console.log('✅ Recommendations retrieved\n');

    // Step 5: Get feedback analytics
    console.log('Step 5️⃣ : Getting feedback analytics...');
    await getFeedbackAnalytics(jobId);
    console.log('✅ Analytics retrieved\n');

    // Step 6: Get recruiter insights
    console.log('Step 6️⃣ : Getting recruiter insights...');
    await getRecruiterInsights(jobId);
    console.log('✅ Insights retrieved\n');

    console.log('🎉 Workflow completed successfully!');
  } catch (error) {
    console.error('❌ Workflow error:', error);
  }
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

// Uncomment to run:
// await completeMatchingWorkflow();

export {
  parseJobDescription,
  triggerMatching,
  waitForMatches,
  getRecommendations,
  getFilteredMatches,
  submitFeedback,
  batchUpdateFeedback,
  getFeedbackAnalytics,
  getRecruiterInsights,
  getCandidateHistory,
  completeMatchingWorkflow
};
