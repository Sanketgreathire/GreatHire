/**
 * deduplicationService.js
 * Detects duplicate candidates using email, phone, GitHub URL, LinkedIn URL,
 * and name similarity. Returns existing candidate if duplicate found.
 */
import crypto from "crypto";
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";

/**
 * Build a stable dedup hash from the candidate's primary identifiers.
 * Priority: githubUrl > email[0] > phone[0] > linkedinUrl > fullName
 */
export function buildDedupHash(candidate) {
  // Prioritize GitHub URL for GitHub profiles
  const key =
    candidate.githubUrl?.toLowerCase().replace(/\/$/, '') ||
    candidate.emails?.[0]?.toLowerCase().trim() ||
    candidate.phones?.[0]?.replace(/\D/g, '') ||
    candidate.linkedinUrl?.toLowerCase().replace(/\/$/, '') ||
    candidate.fullName?.toLowerCase().replace(/\s+/g, "") ||
    "";

  if (!key) return "";
  return crypto.createHash("sha256").update(key).digest("hex");
}

/**
 * Check if a candidate already exists for this recruiter.
 * Returns { isDuplicate, existing } where existing is the matched doc or null.
 */
export async function findDuplicate(candidate, recruiterId) {
  const orConditions = [];

  // 1. Email match (exact)
  if (candidate.emails?.length) {
    const cleanEmails = candidate.emails.map(e => e.toLowerCase().trim()).filter(Boolean);
    if (cleanEmails.length > 0) {
      orConditions.push({ emails: { $in: cleanEmails }, createdBy: recruiterId });
    }
  }

  // 2. Phone match (exact)
  if (candidate.phones?.length) {
    const cleanPhones = candidate.phones.map(p => p.replace(/\D/g, '')).filter(p => p.length >= 10);
    if (cleanPhones.length > 0) {
      orConditions.push({ phones: { $in: cleanPhones }, createdBy: recruiterId });
    }
  }

  // 3. GitHub URL match (normalized)
  if (candidate.githubUrl) {
    const normalizedGithub = candidate.githubUrl.toLowerCase().replace(/\/$/, '');
    orConditions.push({ 
      githubUrl: { $regex: new RegExp(normalizedGithub.replace('https://github.com/', ''), 'i') },
      createdBy: recruiterId 
    });
  }

  // 4. LinkedIn URL match (normalized)
  if (candidate.linkedinUrl) {
    const normalizedLinkedin = candidate.linkedinUrl.toLowerCase().replace(/\/$/, '');
    orConditions.push({ 
      linkedinUrl: { $regex: new RegExp(normalizedLinkedin.replace('https://www.linkedin.com/in/', ''), 'i') },
      createdBy: recruiterId 
    });
  }

  // 5. Exact name match (as last resort)
  if (candidate.fullName && candidate.fullName.length > 3) {
    const normalizedName = candidate.fullName.toLowerCase().trim().replace(/\s+/g, ' ');
    orConditions.push({ 
      fullName: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
      createdBy: recruiterId 
    });
  }

  if (!orConditions.length) return { isDuplicate: false, existing: null };

  const existing = await SourcingCandidate.findOne({ $or: orConditions })
    .select("_id fullName emails githubUrl linkedinUrl sourceType createdAt")
    .lean();

  return { isDuplicate: !!existing, existing: existing || null };
}

/**
 * Merge new source info into an existing duplicate candidate's sourceHistory.
 */
export async function mergeSourceHistory(existingId, sourceEntry) {
  await SourcingCandidate.findByIdAndUpdate(existingId, {
    $push: { sourceHistory: sourceEntry },
    $set:  { importedAt: new Date() },
  });
}
