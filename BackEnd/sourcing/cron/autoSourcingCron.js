import cron from 'node-cron';
import { autoSourcingService } from '../services/autoSourcingService.js';
import { AutoSourcingConfig } from '../../models/sourcing/autoSourcingConfig.model.js';
import { Recruiter } from '../../models/recruiter.model.js';
import mongoose from 'mongoose';

/**
 * Auto-Sourcing Cron Job
 * Runs daily to automatically fetch candidates from public sources
 */

let cronJob = null;

/**
 * Start the auto-sourcing cron job
 */
export function startAutoSourcingCron() {
  // Run daily at 3:00 AM
  const schedule = process.env.AUTO_SOURCING_SCHEDULE || '0 3 * * *';
  
  cronJob = cron.schedule(schedule, async () => {
    console.log('🤖 [AUTO-SOURCING] Starting scheduled auto-sourcing job...');
    
    try {
      await runAutoSourcing();
      console.log('✅ [AUTO-SOURCING] Completed successfully');
    } catch (error) {
      console.error('❌ [AUTO-SOURCING] Failed:', error);
    }
  });

  console.log(`✅ Auto-sourcing cron job scheduled: ${schedule}`);
  
  // Run immediately on startup for testing
  console.log('🚀 Running auto-sourcing immediately on startup...');
  setTimeout(() => {
    runAutoSourcing()
      .then(() => console.log('✅ Initial auto-sourcing completed'))
      .catch(err => console.error('❌ Initial auto-sourcing failed:', err));
  }, 10000); // Wait 10 seconds after server starts
}

/**
 * Stop the cron job
 */
export function stopAutoSourcingCron() {
  if (cronJob) {
    cronJob.stop();
    console.log('🛑 Auto-sourcing cron job stopped');
  }
}

/**
 * Main auto-sourcing logic
 */
async function runAutoSourcing() {
  try {
    // First, get all verified recruiters
    const allVerifiedRecruiters = await Recruiter.find({ 'emailId.isVerified': true }).select('_id fullname');
    
    console.log(`📊 Found ${allVerifiedRecruiters.length} verified recruiters in database`);
    
    if (allVerifiedRecruiters.length === 0) {
      console.log('⚠️ No verified recruiters found. Please verify at least one recruiter.');
      return {
        total: 0,
        successful: 0,
        failed: 0,
        totalImported: 0,
        message: 'No verified recruiters found'
      };
    }
    
    // Get configs for recruiters who have auto-sourcing enabled
    const configs = await AutoSourcingConfig.find({ enabled: true }).populate('recruiterId', 'fullname emailId.isVerified');
    
    let recruitersToProcess = [];
    
    if (configs.length > 0) {
      // Use only recruiters with enabled configs
      recruitersToProcess = configs
        .filter(c => c.recruiterId && c.recruiterId.emailId?.isVerified)
        .map(c => c.recruiterId);
      console.log(`✅ Using ${recruitersToProcess.length} recruiters with enabled auto-sourcing configs`);
    } else {
      // No configs exist, create default configs for all verified recruiters
      console.log(`⚠️ No configs found. Creating default configs for all verified recruiters...`);
      
      for (const recruiter of allVerifiedRecruiters) {
        await AutoSourcingConfig.findOneAndUpdate(
          { recruiterId: recruiter._id },
          {
            recruiterId: recruiter._id,
            enabled: true,
            criteria: {
              platforms: ['github', 'linkedin', 'stackoverflow', 'devto'],
              languages: ['JavaScript', 'Python', 'Java'],
              locations: ['India'],
              keywords: ['software developer', 'full stack developer'],
              minRepos: 1,
              minFollowers: 0,
              minExperience: 0,
              maxCandidatesPerRun: 30,
            },
          },
          { upsert: true, new: true }
        );
      }
      
      recruitersToProcess = allVerifiedRecruiters;
      console.log(`✅ Created configs for ${recruitersToProcess.length} recruiters`);
    }

    const results = {
      total: recruitersToProcess.length,
      successful: 0,
      failed: 0,
      totalImported: 0,
    };

    // Process each recruiter
    for (const recruiter of recruitersToProcess) {
      try {
        console.log(`🔍 Auto-sourcing for recruiter: ${recruiter.fullname}`);
        
        // Get search criteria (uses custom config or defaults)
        const criteria = await autoSourcingService.getDefaultCriteria(recruiter._id);
        const config = await AutoSourcingConfig.findOne({ recruiterId: recruiter._id });
        const platforms = config?.criteria?.platforms || ['github', 'stackoverflow', 'devto'];
        
        console.log(`   Search criteria:`, criteria);
        console.log(`   Platforms:`, platforms);
        
        let totalImported = 0;
        let totalSkipped = 0;
        
        // Source from each enabled platform
        for (const platform of platforms) {
          try {
            let result;
            
            switch (platform) {
              case 'github':
                result = await autoSourcingService.sourceFromGitHub(criteria, recruiter._id);
                break;
              case 'linkedin':
                result = await autoSourcingService.sourceFromLinkedIn(criteria, recruiter._id);
                break;
              case 'indeed':
                result = await autoSourcingService.sourceFromIndeed(criteria, recruiter._id);
                break;
              case 'naukri':
                result = await autoSourcingService.sourceFromNaukri(criteria, recruiter._id);
                break;
              case 'stackoverflow':
                result = await autoSourcingService.sourceFromStackOverflow(criteria, recruiter._id);
                break;
              case 'devto':
                result = await autoSourcingService.sourceFromDevTo(criteria, recruiter._id);
                break;
              default:
                console.warn(`Unknown platform: ${platform}`);
                continue;
            }
            
            totalImported += result.imported;
            totalSkipped += result.skipped;
            
            // Rate limiting between platforms
            await sleep(1000);
          } catch (err) {
            console.error(`Failed to source from ${platform}:`, err.message);
          }
        }
        
        // Update stats
        await autoSourcingService.updateStats(recruiter._id, {
          imported: totalImported,
          skipped: totalSkipped,
          details: { imported: [], skipped: [] }
        });
        
        results.successful++;
        results.totalImported += totalImported;
        
        console.log(`✅ Imported ${totalImported} candidates, skipped ${totalSkipped} for ${recruiter.fullname}`);
        
        // Rate limiting between recruiters
        await sleep(2000);
      } catch (err) {
        console.error(`❌ Failed for recruiter ${recruiter.fullname}:`, err.message);
        results.failed++;
      }
    }

    console.log('📊 Auto-sourcing summary:', results);
    return results;
  } catch (error) {
    console.error('Auto-sourcing execution error:', error);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Manual trigger for testing
 */
export async function triggerAutoSourcing() {
  console.log('🚀 Manually triggering auto-sourcing...');
  return await runAutoSourcing();
}
