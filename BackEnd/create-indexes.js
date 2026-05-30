import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    console.log('\n📊 Creating indexes for fast queries...');

    // Create index on isAISourced for fast filtering
    await usersCollection.createIndex({ isAISourced: 1 });
    console.log('✅ Created index: isAISourced');

    // Create index on aiSourceType for fast grouping
    await usersCollection.createIndex({ aiSourceType: 1 });
    console.log('✅ Created index: aiSourceType');

    // Compound index for AI sourced queries
    await usersCollection.createIndex({ isAISourced: 1, aiSourceType: 1 });
    console.log('✅ Created compound index: isAISourced + aiSourceType');

    console.log('\n✅ All indexes created successfully!');
    console.log('\n📈 Query performance should be much faster now.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createIndexes();
