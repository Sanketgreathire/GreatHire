import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './utils/db.js';
import { Recruiter } from './models/recruiter.model.js';

/**
 * Verify All Recruiters
 * Quick script to verify all recruiters for testing auto-sourcing
 */

async function verifyAllRecruiters() {
  try {
    console.log('🚀 Verifying all recruiters...\n');
    
    await connectDB();
    
    // Check current state
    const total = await Recruiter.countDocuments();
    const verified = await Recruiter.countDocuments({ 'emailId.isVerified': true });
    const unverified = await Recruiter.countDocuments({ 'emailId.isVerified': { $ne: true } });
    
    console.log(`📊 Current state:`);
    console.log(`   Total: ${total}`);
    console.log(`   Verified: ${verified}`);
    console.log(`   Unverified: ${unverified}\n`);
    
    // Verify all recruiters (set emailId.isVerified to true for all)
    const result = await Recruiter.updateMany(
      { $or: [{ 'emailId.isVerified': { $ne: true } }, { 'emailId.isVerified': { $exists: false } }] },
      { $set: { 'emailId.isVerified': true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} recruiters`);
    
    const verifiedCount = await Recruiter.countDocuments({ 'emailId.isVerified': true });
    console.log(`📊 Total verified recruiters: ${verifiedCount}\n`);
    
    console.log('✅ Done! Now run: npm run init:auto-sourcing');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

verifyAllRecruiters();
