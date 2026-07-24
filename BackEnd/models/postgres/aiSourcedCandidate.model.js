import { getPool } from '../../config/postgres.js';

export const AISourcedCandidate = {
  async create(candidateData) {
    const {
      fullName, email, phone, skills, totalExperience, currentCompany,
      designation, location, education, summary, githubUrl, linkedinUrl,
      portfolioUrl, resumeUrl, aiSourceType, aiSourcedBy, recruiterId
    } = candidateData;

    const query = `
      INSERT INTO ai_sourced_candidates (
        full_name, email, phone, skills, total_experience, current_company,
        designation, location, education, summary, github_url, linkedin_url,
        portfolio_url, resume_url, ai_source_type, ai_sourced_by, recruiter_id, ai_sourced_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
      RETURNING *
    `;

    const values = [
      fullName, email || null, phone || null, skills || [], totalExperience || 0,
      currentCompany || null, designation || null, location || null,
      JSON.stringify(education || []), summary || null, githubUrl || null,
      linkedinUrl || null, portfolioUrl || null, resumeUrl || null,
      aiSourceType, aiSourcedBy || null, recruiterId || null
    ];

    const result = await getPool().query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM ai_sourced_candidates WHERE email = $1 LIMIT 1';
    const result = await getPool().query(query, [email]);
    return result.rows[0];
  },

  async findByGithub(githubUrl) {
    const query = 'SELECT * FROM ai_sourced_candidates WHERE github_url = $1 LIMIT 1';
    const result = await getPool().query(query, [githubUrl]);
    return result.rows[0];
  },

  async findByLinkedin(linkedinUrl) {
    const query = 'SELECT * FROM ai_sourced_candidates WHERE linkedin_url = $1 LIMIT 1';
    const result = await getPool().query(query, [linkedinUrl]);
    return result.rows[0];
  },

  async checkDuplicate(email, githubUrl, linkedinUrl) {
    const query = `
      SELECT * FROM ai_sourced_candidates 
      WHERE email = $1 OR github_url = $2 OR linkedin_url = $3
      LIMIT 1
    `;
    const result = await getPool().query(query, [email, githubUrl, linkedinUrl]);
    return result.rows[0];
  },

  async countBySourceType(sourceType) {
    const query = 'SELECT COUNT(*) as count FROM ai_sourced_candidates WHERE ai_source_type = $1';
    const result = await getPool().query(query, [sourceType]);
    return parseInt(result.rows[0].count);
  },

  async countAll() {
    const query = 'SELECT COUNT(*) as count FROM ai_sourced_candidates';
    const result = await getPool().query(query);
    return parseInt(result.rows[0].count);
  },

  async getStatsBySourceType() {
    const query = `
      SELECT ai_source_type, COUNT(*) as count 
      FROM ai_sourced_candidates 
      GROUP BY ai_source_type
    `;
    const result = await getPool().query(query);
    return result.rows;
  },

  async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT * FROM ai_sourced_candidates 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await getPool().query(query, [limit, offset]);
    return result.rows;
  },

  async deleteById(id) {
    const query = 'DELETE FROM ai_sourced_candidates WHERE id = $1 RETURNING *';
    const result = await getPool().query(query, [id]);
    return result.rows[0];
  },

  async deleteWithoutContact() {
    const query = 'DELETE FROM ai_sourced_candidates WHERE email IS NULL AND phone IS NULL RETURNING *';
    const result = await getPool().query(query);
    return result.rowCount;
  }
};
