import { SourcingCandidate } from '../../models/sourcing/sourcingCandidate.model.js';
import { AutoSourcingConfig } from '../../models/sourcing/autoSourcingConfig.model.js';
import { GitHubScraper } from '../scrapers/githubScraper.js';
import { LinkedInScraper } from '../scrapers/linkedinScraper.js';
import { IndeedScraper } from '../scrapers/indeedScraper.js';
import { NaukriScraper } from '../scrapers/naukriScraper.js';
import { StackOverflowScraper } from '../scrapers/stackoverflowScraper.js';
import { DevToScraper } from '../scrapers/devtoScraper.js';
import { buildDedupHash, findDuplicate } from './deduplicationService.js';
import { normalizeSkills } from './normalizationService.js';
import { ContactExtractorService } from './contactExtractorService.js';

/**
 * Auto-Sourcing Service
 * Automatically fetches and imports candidates from multiple platforms
 */
class AutoSourcingService {
  constructor() {
    this.githubScraper = new GitHubScraper();
    this.linkedinScraper = new LinkedInScraper();
    this.indeedScraper = new IndeedScraper();
    this.naukriScraper = new NaukriScraper();
    this.stackoverflowScraper = new StackOverflowScraper();
    this.devtoScraper = new DevToScraper();
  }

  /**
   * Auto-source candidates from GitHub
   */
  async sourceFromGitHub(criteria, recruiterId) {
    try {
      console.log('🤖 Starting GitHub auto-sourcing...', criteria);
      
      // Get current page from config
      const config = await AutoSourcingConfig.findOne({ recruiterId });
      const currentPage = config?.stats?.platformPages?.github || 1;
      
      console.log(`   Fetching page ${currentPage} from GitHub...`);
      
      const profiles = await this.githubScraper.searchDevelopers(criteria, 30, currentPage);
      console.log(`✅ Found ${profiles.length} GitHub profiles`);
      
      if (profiles.length === 0) {
        console.log('⚠️ No profiles found from GitHub. Resetting to page 1.');
        // Reset to page 1 if no results
        await AutoSourcingConfig.findOneAndUpdate(
          { recruiterId },
          { $set: { 'stats.platformPages.github': 1 } }
        );
      } else {
        // Increment page for next run
        await AutoSourcingConfig.findOneAndUpdate(
          { recruiterId },
          { $inc: { 'stats.platformPages.github': 1 } }
        );
      }

      return await this.importProfiles(profiles, recruiterId, 'GITHUB_PROFILE');
    } catch (error) {
      console.error('GitHub auto-sourcing error:', error);
      throw error;
    }
  }

  /**
   * Auto-source candidates from LinkedIn
   * @param {Object} criteria - Search criteria
   * @param {String} recruiterId - Recruiter who owns these candidates
   */
  async sourceFromLinkedIn(criteria, recruiterId) {
    try {
      console.log('💼 Starting LinkedIn auto-sourcing...', criteria);
      
      const profiles = await this.linkedinScraper.searchProfiles(criteria, 20);
      console.log(`✅ Found ${profiles.length} LinkedIn profiles`);

      return await this.importProfiles(profiles, recruiterId, 'LINKEDIN_PROFILE');
    } catch (error) {
      console.error('LinkedIn auto-sourcing error:', error);
      throw error;
    }
  }

  /**
   * Auto-source candidates from Indeed
   * @param {Object} criteria - Search criteria
   * @param {String} recruiterId - Recruiter who owns these candidates
   */
  async sourceFromIndeed(criteria, recruiterId) {
    try {
      console.log('📋 Starting Indeed auto-sourcing...', criteria);
      
      const profiles = await this.indeedScraper.searchResumes(criteria, 20);
      console.log(`✅ Found ${profiles.length} Indeed profiles`);

      return await this.importProfiles(profiles, recruiterId, 'PUBLIC_PROFILE');
    } catch (error) {
      console.error('Indeed auto-sourcing error:', error);
      return { success: true, imported: 0, skipped: 0, details: { imported: [], skipped: [] } };
    }
  }

  /**
   * Auto-source candidates from Naukri
   * @param {Object} criteria - Search criteria
   * @param {String} recruiterId - Recruiter who owns these candidates
   */
  async sourceFromNaukri(criteria, recruiterId) {
    try {
      console.log('🇮🇳 Starting Naukri auto-sourcing...', criteria);
      
      const profiles = await this.naukriScraper.searchProfiles(criteria, 20);
      console.log(`✅ Found ${profiles.length} Naukri profiles`);

      return await this.importProfiles(profiles, recruiterId, 'PUBLIC_PROFILE');
    } catch (error) {
      console.error('Naukri auto-sourcing error:', error);
      return { success: true, imported: 0, skipped: 0, details: { imported: [], skipped: [] } };
    }
  }

  /**
   * Auto-source candidates from Stack Overflow
   */
  async sourceFromStackOverflow(criteria, recruiterId) {
    try {
      console.log('📚 Starting Stack Overflow auto-sourcing...', criteria);
      
      const profiles = await this.stackoverflowScraper.searchDevelopers(criteria, 30);
      console.log(`✅ Found ${profiles.length} Stack Overflow profiles`);

      return await this.importProfiles(profiles, recruiterId, 'PUBLIC_PROFILE');
    } catch (error) {
      console.error('Stack Overflow auto-sourcing error:', error);
      return { success: true, imported: 0, skipped: 0, details: { imported: [], skipped: [] } };
    }
  }

  /**
   * Auto-source candidates from Dev.to
   */
  async sourceFromDevTo(criteria, recruiterId) {
    try {
      console.log('✍️ Starting Dev.to auto-sourcing...', criteria);
      
      const profiles = await this.devtoScraper.searchDevelopers(criteria, 30);
      console.log(`✅ Found ${profiles.length} Dev.to profiles`);

      return await this.importProfiles(profiles, recruiterId, 'PUBLIC_PROFILE');
    } catch (error) {
      console.error('Dev.to auto-sourcing error:', error);
      return { success: true, imported: 0, skipped: 0, details: { imported: [], skipped: [] } };
    }
  }

  /**
   * Generic profile import function
   * @param {Array} profiles - Profiles to import
   * @param {String} recruiterId - Recruiter ID
   * @param {String} sourceType - Source type
   */
  async importProfiles(profiles, recruiterId, sourceType) {
    const imported = [];
    const skipped = [];

    console.log(`   Processing ${profiles.length} profiles for import...`);

    for (const profile of profiles) {
      try {
        // Enrich profile with contact extractor
        const enrichedProfile = ContactExtractorService.enrichProfile(profile);

        // Check for duplicates
        const { isDuplicate, existing } = await findDuplicate({
          emails: enrichedProfile.emails,
          phones: enrichedProfile.phones,
          githubUrl: enrichedProfile.githubUrl,
          linkedinUrl: enrichedProfile.linkedinUrl,
        }, recruiterId);

        if (isDuplicate) {
          console.log(`   ⏭️ Skipping duplicate: ${enrichedProfile.fullName} (already exists as ${existing?.fullName})`);
          skipped.push({ profile: enrichedProfile.fullName, reason: 'duplicate' });
          continue;
        }

        // Check if profile has minimum required data
        if (!enrichedProfile.fullName || enrichedProfile.fullName === 'Unknown') {
          console.log(`   ⚠️ Skipping: No valid name`);
          skipped.push({ profile: 'Unknown', reason: 'no name' });
          continue;
        }

        // Normalize skills
        const normalizedSkills = normalizeSkills(enrichedProfile.skills);

        // Create candidate
        const candidate = await SourcingCandidate.create({
          fullName: enrichedProfile.fullName,
          emails: enrichedProfile.emails,
          phones: enrichedProfile.phones,
          githubUrl: enrichedProfile.githubUrl || '',
          linkedinUrl: enrichedProfile.linkedinUrl || '',
          portfolioUrl: enrichedProfile.portfolioUrl || '',
          location: enrichedProfile.location,
          currentCompany: enrichedProfile.company,
          designation: enrichedProfile.designation,
          totalExperience: enrichedProfile.totalExperience || 0,
          skills: enrichedProfile.skills,
          normalizedSkills,
          summary: enrichedProfile.summary,
          education: enrichedProfile.education || [],
          sourceType,
          sourceUrl: enrichedProfile.linkedinUrl || enrichedProfile.githubUrl || '',
          createdBy: recruiterId,
          createdByModel: 'Recruiter',
          ingestionStatus: 'COMPLETED',
          embeddingStatus: 'PENDING',
          dedupHash: buildDedupHash({
            emails: enrichedProfile.emails,
            phones: enrichedProfile.phones,
            githubUrl: enrichedProfile.githubUrl,
            linkedinUrl: enrichedProfile.linkedinUrl,
          }),
        });

        console.log(`   ✅ Imported: ${enrichedProfile.fullName} (${enrichedProfile.skills?.length || 0} skills, ${enrichedProfile.phones?.length || 0} phones)`);
        imported.push(candidate);
      } catch (err) {
        console.error(`   ❌ Failed to import ${profile.fullName}:`, err.message);
        skipped.push({ profile: profile.fullName, reason: err.message });
      }
    }

    console.log(`   📊 Import summary: ${imported.length} imported, ${skipped.length} skipped`);

    return {
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      details: { imported, skipped },
    };
  }

  /**
   * Get search criteria for a recruiter
   * Uses custom config if available, otherwise returns defaults
   * Rotates through different languages to get diverse candidates
   */
  async getDefaultCriteria(recruiterId) {
    try {
      // Try to get custom config
      const config = await AutoSourcingConfig.findOne({ recruiterId });
      
      if (config && config.enabled) {
        // Rotate through languages to get variety
        const languages = config.criteria.languages || ['JavaScript', 'Python', 'Java'];
        const totalRuns = config.stats.totalRuns || 0;
        const languageIndex = totalRuns % languages.length;
        
        return {
          language: languages[languageIndex],
          location: config.criteria.locations[0] || 'India',
          minRepos: config.criteria.minRepos,
          minFollowers: config.criteria.minFollowers,
        };
      }
    } catch (err) {
      console.warn('Failed to fetch config, using defaults:', err.message);
    }
    
    // Default criteria - rotate through popular languages
    const languages = ['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust'];
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
    
    return {
      language: randomLanguage,
      location: 'India',
      minRepos: 1,
      minFollowers: 0,
    };
  }

  /**
   * Update stats after sourcing run
   */
  async updateStats(recruiterId, result) {
    try {
      await AutoSourcingConfig.findOneAndUpdate(
        { recruiterId },
        {
          $set: {
            'stats.lastRunAt': new Date(),
            'stats.lastRunResult': {
              imported: result.imported,
              skipped: result.skipped,
              errors: result.details?.skipped?.length || 0,
            },
          },
          $inc: {
            'stats.totalRuns': 1,
            'stats.totalImported': result.imported,
            'stats.totalSkipped': result.skipped,
          },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Failed to update stats:', err.message);
    }
  }
}

export const autoSourcingService = new AutoSourcingService();
