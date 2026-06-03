import axios from "axios";
import { extractGithubUsername } from "../validators/ingestionValidators.js";

const GH_API = "https://api.github.com";

function buildHeaders() {
  const h = {
    "User-Agent": "GreatHire-Sourcing/1.0",
    Accept:       "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) h["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  return h;
}

/**
 * Fetch a GitHub user's public profile + repos and return a raw candidate object.
 * @param {string} githubUrl  - e.g. https://github.com/torvalds
 * @returns {Object} rawCandidate
 */
export async function parseGithubProfile(githubUrl) {
  const username = extractGithubUsername(githubUrl);
  if (!username) throw new Error("Could not extract GitHub username from URL.");

  const headers = buildHeaders();

  // Fetch profile and repos in parallel
  const [profileRes, reposRes] = await Promise.allSettled([
    axios.get(`${GH_API}/users/${username}`,                                    { headers, timeout: 10000 }),
    axios.get(`${GH_API}/users/${username}/repos?per_page=50&sort=updated`,     { headers, timeout: 10000 }),
  ]);

  // Handle profile errors
  if (profileRes.status === "rejected") {
    const status = profileRes.reason?.response?.status;
    if (status === 404) throw new Error(`GitHub user "${username}" not found.`);
    if (status === 403) throw new Error("GitHub API rate limit exceeded. Set GITHUB_TOKEN in .env.");
    throw new Error(`GitHub API error: ${profileRes.reason?.message}`);
  }

  const profile = profileRes.value.data;
  const repos   = reposRes.status === "fulfilled" ? reposRes.value.data : [];

  // Extract skills from repo languages and topics
  const languageCount = {};
  const topicSet      = new Set();

  for (const repo of repos) {
    if (repo.fork) continue; // skip forked repos
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
    if (Array.isArray(repo.topics)) {
      repo.topics.forEach((t) => topicSet.add(t));
    }
  }

  // Sort languages by frequency
  const languages = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang)
    .slice(0, 15);

  const topics = Array.from(topicSet).slice(0, 10);
  const skills = [...new Set([...languages, ...topics])].slice(0, 25);

  // Build repo summary for context
  const topRepos = repos
    .filter((r) => !r.fork && r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => `${r.name} (⭐${r.stargazers_count})`);

  const summary = [
    profile.bio || "",
    topRepos.length ? `Top repos: ${topRepos.join(", ")}` : "",
  ].filter(Boolean).join(" | ");

  return {
    fullName:       profile.name || profile.login,
    emails:         profile.email ? [profile.email.toLowerCase()] : [],
    phones:         [],
    skills,
    designation:    "",
    currentCompany: (profile.company || "").replace(/^@/, "").trim(),
    location:       profile.location || "",
    summary,
    githubUrl:      profile.html_url,
    linkedinUrl:    "",
    portfolioUrl:   profile.blog || "",
    totalExperience: 0,
    education:      [],
    // Store raw GitHub data for future use
    _rawGithub: {
      login:      profile.login,
      avatarUrl:  profile.avatar_url,
      followers:  profile.followers,
      publicRepos: profile.public_repos,
      createdAt:  profile.created_at,
    },
  };
}
