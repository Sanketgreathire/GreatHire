import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const MONGO_URI = process.env.MONGODB_URI;

async function checkAISourced() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const totalUsers = await User.countDocuments();
    const aiSourcedTrue = await User.countDocuments({ isAISourced: true });
    const aiSourcedFalse = await User.countDocuments({ isAISourced: false });
    const aiSourcedNull = await User.countDocuments({ isAISourced: null });
    const aiSourcedNotExists = await User.countDocuments({ isAISourced: { $exists: false } });

    console.log('\n📊 AI Sourced Statistics:');
    console.log('─────────────────────────');
    console.log(`Total Users: ${totalUsers}`);
    console.log(`isAISourced = true: ${aiSourcedTrue}`);
    console.log(`isAISourced = false: ${aiSourcedFalse}`);
    console.log(`isAISourced = null: ${aiSourcedNull}`);
    console.log(`isAISourced not exists: ${aiSourcedNotExists}`);

    // Sample AI sourced users
    const sampleAI = await User.find({ isAISourced: true }).limit(3).lean();
    console.log('\n🤖 Sample AI Sourced Users:');
    sampleAI.forEach(u => {
      console.log(`  - ${u.fullname} (${u.emailId?.email}) - Source: ${u.aiSourceType}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAISourced();
