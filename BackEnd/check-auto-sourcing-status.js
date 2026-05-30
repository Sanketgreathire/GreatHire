import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './utils/db.js';
import { Recruiter } from './models/recruiter.model.js';
import { AutoSourcingConfig } from './models/sourcing/autoSourcingConfig.model.js';
import { SourcingCandidate } from './models/sourcing/sourcingCandidate.model.js';

/**
 * Check Auto-Sourcing Status
 * Shows current state of recruiters and configs
 */

async function checkStatus() {
  try {
    console.log('🔍 Checking Auto-Sourcing Status...\n');
    
    await connectDB();
    
    // Check recruiters
    const allRecruiters = await Recruiter.find().select('_id fullname emailId');
    const verifiedRecruiters = allRecruiters.filter(r => r.emailId?.isVerified);
    
    console.log('📊 RECRUITERS:');
    console.log(`   Total: ${allRecruiters.length}`);
    console.log(`   Verified: ${verifiedRecruiters.length}`);
    console.log(`   Unverified: ${allRecruiters.length - verifiedRecruiters.length}\n`);
    
    if (allRecruiters.length === 0) {
      console.log('⚠️  No recruiters found in database!');
      console.log('   Please create at least one recruiter account.\n');
    } else {
      console.log('   Recruiter List:');
      allRecruiters.forEach(r => {
        console.log(`   - ${r.fullname} (${r.emailId?.email || 'no email'}) - ${r.emailId?.isVerified ? '✅ Verified' : '❌ Not Verified'}`);
      });
      console.log('');
    }
    
    // Check configs
    const configs = await AutoSourcingConfig.find().populate('recruiterId', 'fullname');
    const enabledConfigs = configs.filter(c => c.enabled);
    
    console.log('⚙️  AUTO-SOURCING CONFIGS:');
    console.log(`   Total: ${configs.length}`);
    console.log(`   Enabled: ${enabledConfigs.length}`);
    console.log(`   Disabled: ${configs.length - enabledConfigs.length}\n`);
    
    if (configs.length === 0) {
      console.log('⚠️  No configs found!');
      console.log('   Run: npm run init:auto-sourcing\n');
    } else {
      console.log('   Config List:');
      configs.forEach(c => {
        console.log(`   - ${c.recruiterId?.fullname || 'Unknown'} - ${c.enabled ? '✅ Enabled' : '❌ Disabled'}`);
        console.log(`     Languages: ${c.criteria.languages.join(', ')}`);
        console.log(`     Locations: ${c.criteria.locations.join(', ')}`);
        console.log(`     Stats: ${c.stats.totalRuns} runs, ${c.stats.totalImported} imported`);
      });
      console.log('');
    }
    
    // Check sourced candidates
    const totalCandidates = await SourcingCandidate.countDocuments();
    const githubCandidates = await SourcingCandidate.countDocuments({ sourceType: 'GITHUB_PROFILE' });
    
    console.log('👥 SOURCED CANDIDATES:');
    console.log(`   Total: ${totalCandidates}`);
    console.log(`   GitHub Profiles: ${githubCandidates}`);
    console.log(`   Other Sources: ${totalCandidates - githubCandidates}\n`);
    
    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    if (verifiedRecruiters.length === 0) {
      console.log('   1. ⚠️  Verify at least one recruiter in admin panel');
    } else {
      console.log('   1. ✅ You have verified recruiters');
    }
    
    if (configs.length === 0) {
      console.log('   2. ⚠️  Run: npm run init:auto-sourcing');
    } else if (enabledConfigs.length === 0) {
      console.log('   2. ⚠️  Enable auto-sourcing for at least one recruiter');
    } else {
      console.log('   2. ✅ Auto-sourcing configs are ready');
    }
    
    if (process.env.GITHUB_TOKEN) {
      console.log('   3. ✅ GitHub token is configured');
    } else {
      console.log('   3. ⚠️  Add GITHUB_TOKEN to .env for higher rate limits');
    }
    
    console.log('\n✅ Status check complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Status check failed:', error);
    process.exit(1);
  }
}

checkStatus();
