/**
 * Migration Script: Add freeJobsPosted field to existing companies
 * 
 * This script adds the freeJobsPosted field to all existing companies
 * and sets appropriate values based on their current state.
 * 
 * Run this script ONCE after deploying the new code.
 */

import mongoose from 'mongoose';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateCompanies = async () => {
  try {
    console.log('🚀 Starting migration: Add freeJobsPosted field...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Get all companies
    const companies = await Company.find({});
    console.log(`📊 Found ${companies.length} companies to migrate`);

    let updated = 0;
    let skipped = 0;

    for (const company of companies) {
      // Skip if freeJobsPosted already exists
      if (company.freeJobsPosted !== undefined) {
        skipped++;
        continue;
      }

      // Count jobs posted by this company
      const jobCount = await Job.countDocuments({ company: company._id });

      // Set freeJobsPosted based on job count
      let freeJobsPosted = 0;
      if (jobCount >= 2) {
        freeJobsPosted = 2; // Already used both free jobs
      } else if (jobCount === 1) {
        freeJobsPosted = 1; // Used 1 free job
      } else {
        freeJobsPosted = 0; // No jobs posted yet
      }

      // Update company
      company.freeJobsPosted = freeJobsPosted;
      await company.save();

      updated++;
      console.log(`✅ Updated company: ${company.companyName} (freeJobsPosted: ${freeJobsPosted})`);
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Updated: ${updated} companies`);
    console.log(`   ⏭️  Skipped: ${skipped} companies (already migrated)`);
    console.log(`   📊 Total: ${companies.length} companies`);
    console.log('\n✅ Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateCompanies();
