import axios from 'axios';
import crypto from 'crypto';
import { SourcingCandidate } from '../../models/sourcing/SourcingCandidate.model.js';
import { AISourcedCandidate } from '../../models/sourcing/aiSourcedCandidate.model.js';

const RK_BASE = 'https://api.recruitkar.com/v1';
const RK_KEY = process.env.RECRUITKAR_API_KEY;

const rk = axios.create({
  baseURL: RK_BASE,
  headers: { Authorization: `Bearer ${RK_KEY}`, 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildFilters({ skills, location, designation, minExp, maxExp }) {
  const conditions = [];

  if (skills?.trim()) {
    const list = skills.split(',').map(s => s.trim()).filter(Boolean);
    conditions.push(list.length === 1
      ? { field: 'skills', type: '(.)', value: list[0] }
      : { field: 'skills', type: 'in', value: list });
  }
  if (location?.trim())
    conditions.push({ field: 'location', type: '(.)', value: location.trim() });
  if (designation?.trim())
    conditions.push({ field: 'title', type: '(.)', value: designation.trim() });
  if (minExp)
    conditions.push({ field: 'years_experience', type: '=>', value: parseInt(minExp) });
  if (maxExp)
    conditions.push({ field: 'years_experience', type: '=<', value: parseInt(maxExp) });

  if (!conditions.length) return null;
  if (conditions.length === 1) return conditions[0];
  return { op: 'and', conditions };
}

function scoreProfile(p, { skills, location, designation, minExp, maxExp }) {
  let score = 40;
  const reasons = [];
  const skillList = skills ? skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
  const pSkills = (p.skills || []).map(s => s.toLowerCase());
  const pTitle = (p.headline || p.current_experience?.title || '').toLowerCase();
  const pLoc = (p.location || '').toLowerCase();

  if (skillList.length > 0 && pSkills.length > 0) {
    const matched = skillList.filter(s => pSkills.some(ps => ps.includes(s) || s.includes(ps)));
    score += Math.round((matched.length / skillList.length) * 35);
    if (matched.length) reasons.push(`Skills: ${matched.join(', ')}`);
  } else if (!skillList.length) score += 20;

  if (designation?.trim() && pTitle.includes(designation.trim().toLowerCase())) {
    score += 15; reasons.push(`Title: ${p.current_experience?.title || p.headline}`);
  }
  if (location?.trim() && pLoc.includes(location.trim().toLowerCase())) {
    score += 10; reasons.push(`Location: ${p.location}`);
  }
  const exp = p.years_experience || 0;
  if (minExp || maxExp) {
    if ((!minExp || exp >= parseInt(minExp)) && (!maxExp || exp <= parseInt(maxExp))) {
      score += 10; reasons.push(`Experience: ${exp}y`);
    }
  } else score += 5;

  return { score: Math.min(score, 100), reasons };
}

function dedupHash(linkedinUrl, emails = [], phones = []) {
  const key = linkedinUrl || emails[0] || phones[0] || '';
  return key ? crypto.createHash('sha256').update(key.toLowerCase().trim()).digest('hex') : '';
}

function hasContactInfo(profile) {
  const emails = (profile?.emails || []).filter(Boolean);
  const phones = (profile?.phones || []).filter(Boolean);
  return emails.length > 0 || phones.length > 0;
}

function normalize(p, scoreData) {
  const exp = p.current_experience;
  return {
    _id: p.id,
    fullName: p.name || 'Unknown',
    designation: exp?.title || p.headline || '',
    currentCompany: exp?.company || '',
    location: p.location || '',
    skills: p.skills || [],
    totalExperience: p.years_experience || 0,
    emails: [],
    phones: [],
    linkedinUrl: p.linkedin_url || '',
    profilePhoto: p.profile_picture_url || '',
    summary: p.summary || p.headline || '',
    education: p.education?.[0]
      ? [p.education[0].degree, p.education[0].institution, p.education[0].end_date].filter(Boolean).join(' · ')
      : '',
    allEducation: p.education || [],
    pastExperience: p.past_experience || [],
    matchScore: scoreData?.score ?? null,
    matchReasons: scoreData?.reasons || [],
    source: 'recruitkar',
    rkId: p.id,
  };
}

/**
 * Save/upsert a Recruitkar profile into SourcingCandidate collection
 */
async function saveToDb(profile, recruiterId) {
  try {
    const emails = (profile.emails || []).filter(Boolean);
    const phones = (profile.phones || []).filter(Boolean);

    if (!emails.length && !phones.length) {
      return null;
    }

    const hash = dedupHash(profile.linkedinUrl, emails, phones);

    const educationArr = (profile.allEducation || []).map(e => ({
      degree: [e.degree, e.field_of_study].filter(Boolean).join(' · ') || '',
      institution: e.institution || '',
      year: e.end_date || '',
    }));

    const doc = {
      fullName: profile.fullName,
      emails,
      phones,
      skills: profile.skills || [],
      totalExperience: profile.totalExperience || 0,
      currentCompany: profile.currentCompany || '',
      designation: profile.designation || '',
      location: profile.location || '',
      education: educationArr,
      summary: profile.summary || '',
      linkedinUrl: profile.linkedinUrl || '',
      profilePhoto: profile.profilePhoto || '',
      pastExperience: profile.pastExperience || [],
      rkId: profile.rkId || '',
      sourceType: 'API_IMPORT',
      sourceUrl: profile.linkedinUrl || '',
      createdBy: recruiterId,
      ingestionStatus: 'COMPLETED',
      embeddingStatus: 'PENDING',
      ...(hash && { dedupHash: hash }),
    };

    const legacyDoc = {
      fullName: profile.fullName,
      email: emails[0] || null,
      phone: phones[0] || null,
      skills: profile.skills || [],
      totalExperience: profile.totalExperience || 0,
      currentCompany: profile.currentCompany || '',
      designation: profile.designation || '',
      location: profile.location || '',
      education: educationArr,
      summary: profile.summary || '',
      githubUrl: profile.githubUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      portfolioUrl: profile.profilePhoto || '',
      aiSourceType: 'API_IMPORT',
      aiSourcedBy: recruiterId,
      recruiterId,
    };

    const query = profile.linkedinUrl
      ? { linkedinUrl: profile.linkedinUrl }
      : (hash ? { dedupHash: hash } : { fullName: profile.fullName, recruiterId });

    const [saved] = await Promise.all([
      SourcingCandidate.findOneAndUpdate(
        { $or: [
          { linkedinUrl: profile.linkedinUrl },
          ...(hash ? [{ dedupHash: hash }] : []),
        ] },
        { $set: { ...doc, createdBy: recruiterId } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ),
      AISourcedCandidate.findOneAndUpdate(
        profile.linkedinUrl
          ? { linkedinUrl: profile.linkedinUrl, recruiterId }
          : { email: legacyDoc.email || null, recruiterId },
        { $set: legacyDoc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ),
    ]);

    return saved?._id?.toString() || null;
  } catch (err) {
    console.warn('saveToDb error:', err.message);
    return null;
  }
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/v1/sourcing/recruitkar-search
 * Search Recruitkar + auto-save all results to DB
 */
export const recruitkarSearch = async (req, res) => {
  try {
    const { skills, location, designation, minExp, maxExp, jobDescription, cursor } = req.body;
    const recruiterId = req.id;
    const requestedSearchCount = req.body.searchCount ?? req.body.candidateSearchCount ?? req.body.limit;
    const parsedSearchCount = Number.parseInt(requestedSearchCount, 10);
    const searchCount = Number.isFinite(parsedSearchCount) && parsedSearchCount > 0
      ? Math.min(parsedSearchCount, 100)
      : 25;

    if (!skills && !location && !designation && !jobDescription) {
      return res.status(400).json({ success: false, message: 'At least one filter is required.' });
    }

    const filters = buildFilters({ skills, location, designation, minExp, maxExp });
    if (!filters) return res.status(400).json({ success: false, message: 'Could not build filters.' });

    const payload = { filters, limit: searchCount };
    if (cursor) payload.cursor = cursor;

    const { data } = await rk.post('/person/search', payload);

    const candidates = (data.profiles || []).map(p =>
      normalize(p, scoreProfile(p, { skills, location, designation, minExp, maxExp }))
    ).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const candidatesWithContact = candidates.filter(hasContactInfo);

    // Auto-save only profiles that have at least one contact detail in background (non-blocking)
    Promise.all(candidatesWithContact.map(async c => {
      const dbId = await saveToDb(c, recruiterId);
      if (dbId) c.dbId = dbId; // attach DB id for reference
    })).catch(err => console.warn('Background save error:', err.message));

    return res.json({
      success: true,
      candidates,
      total: data.total_count || candidates.length,
      nextCursor: data.next_cursor || null,
      source: 'recruitkar',
      mode: 'filter_matched',
      requestedSearchCount: searchCount,
    });
  } catch (err) {
    console.error('recruitkarSearch:', err.response?.data || err.message);
    if (err.response?.data?.error?.code === 'INSUFFICIENT_CREDITS')
      return res.status(402).json({ success: false, message: 'Recruitkar credits exhausted.' });
    return res.status(500).json({ success: false, message: 'Search failed.', error: err.message });
  }
};

/**
 * POST /api/v1/sourcing/recruitkar-contact
 * Fetch email + phone for a LinkedIn URL (3 credits) and save to DB
 */
export const recruitkarContact = async (req, res) => {
  try {
    const { linkedin_url, profile } = req.body;
    const recruiterId = req.id;

    if (!linkedin_url) return res.status(400).json({ success: false, message: 'linkedin_url required.' });

    const { data } = await rk.post('/person/contact', { linkedin_urls: [linkedin_url] });
    const contact = data?.[0]?.matches?.[0]?.person_data?.contact;

    if (!contact) return res.json({ success: false, message: 'No contact found.' });

    const emails = [
      ...(contact.business_emails || []).map(e => e.email),
      ...(contact.personal_emails || []).map(e => e.email),
    ].filter(Boolean);
    const phones = (contact.phone_numbers || []).filter(Boolean);

    // Upsert (not just update) so candidates that had no contact info at search
    // time — and were therefore never saved — get saved now that we have it.
    await saveToDb({ ...(profile || {}), linkedinUrl: linkedin_url, emails, phones }, recruiterId);

    return res.json({ success: true, emails, phones });
  } catch (err) {
    console.error('recruitkarContact:', err.response?.data || err.message);
    return res.status(500).json({ success: false, message: 'Contact fetch failed.', error: err.message });
  }
};

/**
 * POST /api/v1/sourcing/recruitkar-preview
 * Count matches without fetching profiles (1 credit)
 */
export const recruitkarPreview = async (req, res) => {
  try {
    const filters = buildFilters(req.body);
    if (!filters) return res.status(400).json({ success: false, message: 'No filters.' });
    const { data } = await rk.post('/person/preview', { filters });
    return res.json({ success: true, matchCount: data.match_count });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Preview failed.', error: err.message });
  }
};
