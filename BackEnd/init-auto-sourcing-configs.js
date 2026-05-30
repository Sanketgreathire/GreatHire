import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './utils/db.js';
import { Recruiter } from './models/recruiter.model.js';
import { AutoSourcingConfig } from './models/sourcing/autoSourcingConfig.model.js';

/**
 * Initialize Auto-Sourcing Configs
 * Creates default auto-sourcing configuration for all existing verified recruiters
 */

async function initializeConfigs() {
  try {
    console.log('🚀 Initializing auto-sourcing configs for existing recruiters...\n');
    
    await connectDB();
    
    // Get all verified recruiters
    const recruiters = await Recruiter.find({ 'emailId.isVerified': true }).select('_id fullname');
    
    console.log(`📊 Found ${recruiters.length} verified recruiters\n`);
    
    let created = 0;
    let existing = 0;
    
    for (const recruiter of recruiters) {
      try {
        // Check if config already exists
        const existingConfig = await AutoSourcingConfig.findOne({ recruiterId: recruiter._id });
        
        if (existingConfig) {
          console.log(`⏭️  Config already exists for: ${recruiter.fullname}`);
          existing++;
          continue;
        }
        
        // Create default config
        await AutoSourcingConfig.create({
          recruiterId: recruiter._id,
          enabled: true,
          criteria: {
            platforms: ['github', 'linkedin', 'stackoverflow', 'devto'],
            languages: ['JavaScript', 'Python', 'Java'],
            locations: ['India'],
            minRepos: 5,
            minFollowers: 10,
            maxCandidatesPerRun: 30,
          },
        });
        
        console.log(`✅ Created config for: ${recruiter.fullname}`);
        created++;
      } catch (err) {
        console.error(`❌ Failed for ${recruiter.fullname}:`, err.message);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Total recruiters: ${recruiters.length}`);
    console.log(`   Configs created: ${created}`);
    console.log(`   Already existing: ${existing}`);
    console.log('\n✅ Initialization completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

initializeConfigs();
