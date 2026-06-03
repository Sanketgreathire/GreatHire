import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './utils/db.js';
import { triggerAutoSourcing } from './sourcing/cron/autoSourcingCron.js';

/**
 * Test Auto-Sourcing
 * Run this script to manually test the auto-sourcing feature
 */

async function testAutoSourcing() {
  try {
    console.log('🚀 Testing Auto-Sourcing Feature...\n');
    
    await connectDB();
    
    const results = await triggerAutoSourcing();
    
    console.log('\n✅ Test completed successfully!');
    console.log('Results:', JSON.stringify(results, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAutoSourcing();
