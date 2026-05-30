import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkSourceTypes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    const oldBySource = await db.collection('sourcingcandidates').aggregate([
      { $group: { _id: "$sourceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    const newBySource = await db.collection('users').aggregate([
      { $match: { isAISourced: true } },
      { $group: { _id: "$aiSourceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    console.log('\n📊 Old SourcingCandidate collection source types:');
    oldBySource.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count}`);
    });

    console.log('\n📊 New User collection source types:');
    newBySource.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSourceTypes();
