import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Gemini-based JD Matching Service
 * Fallback when AI microservice is unavailable
 */
export class GeminiJdMatcher {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Score candidates against job description
   * @param {string} jobDescription - The job description
   * @param {Array} candidates - Array of candidate profiles
   * @returns {Array} Scored candidates with match percentage
   */
  async scoreCandidates(jobDescription, candidates) {
    try {
      const results = [];

      for (const candidate of candidates) {
        const score = await this.scoreCandidate(jobDescription, candidate);
        results.push({
          candidate_id: candidate.id,
          score: score.percentage / 100, // Convert to 0-1 scale
          reasons: score.reasons,
          percentage: score.percentage
        });
      }

      return results;

    } catch (error) {
      console.error('Gemini JD matching error:', error);
      throw error;
    }
  }

  /**
   * Score a single candidate against JD
   */
  async scoreCandidate(jobDescription, candidate) {
    try {
      const prompt = `You are an expert technical recruiter. Score this candidate's match to the job description on a scale of 0-100.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
Name: ${candidate.fullName}
Designation: ${candidate.designation}
Skills: ${candidate.skills?.join(', ') || 'Not specified'}
Experience: ${candidate.experience} years
Location: ${candidate.location}
Company: ${candidate.company}
Summary: ${candidate.summary}

Analyze the candidate and provide:
1. A match score from 0-100 (where 100 is perfect match)
2. Top 3 reasons for the score (strengths or gaps)

Respond in this exact JSON format:
{
  "score": <number 0-100>,
  "reasons": ["reason 1", "reason 2", "reason 3"]
}

Be realistic and critical. Only give 80+ for truly excellent matches.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('Could not parse Gemini response, using default score');
        return { percentage: 50, reasons: ['Unable to analyze match'] };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        percentage: Math.min(100, Math.max(0, parsed.score)),
        reasons: parsed.reasons || []
      };

    } catch (error) {
      console.error('Error scoring candidate:', error);
      return { percentage: 50, reasons: ['Error analyzing match'] };
    }
  }

  /**
   * Batch score with rate limiting
   */
  async scoreBatch(jobDescription, candidates, delayMs = 1000) {
    const results = [];

    for (let i = 0; i < candidates.length; i++) {
      try {
        const score = await this.scoreCandidate(jobDescription, candidates[i]);
        results.push({
          candidate_id: candidates[i].id,
          score: score.percentage / 100,
          reasons: score.reasons,
          percentage: score.percentage
        });

        // Rate limiting between requests
        if (i < candidates.length - 1) {
          await this.sleep(delayMs);
        }
      } catch (error) {
        console.error(`Error scoring candidate ${candidates[i].id}:`, error);
        results.push({
          candidate_id: candidates[i].id,
          score: 0.5,
          reasons: ['Error during analysis'],
          percentage: 50
        });
      }
    }

    return results;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
