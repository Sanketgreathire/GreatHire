import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkCounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    const oldCount = await db.collection('sourcingcandidates').countDocuments();
    const newCount = await db.collection('users').countDocuments({ isAISourced: true });
    const jobSeekers = await db.collection('users').countDocuments({ isAISourced: false });

    console.log('\n📊 Counts:');
    console.log('─────────────────────────');
    console.log(`Old SourcingCandidate collection: ${oldCount}`);
    console.log(`New User collection (AI sourced): ${newCount}`);
    console.log(`Total AI Sourced: ${oldCount + newCount}`);
    console.log(`Job Seekers: ${jobSeekers}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCounts();
