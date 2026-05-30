import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function setDefaultAISourced() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    // Set isAISourced = false for all users who don't have this field
    const result = await User.updateMany(
      { isAISourced: { $exists: false } },
      { $set: { isAISourced: false } }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} users with isAISourced = false`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setDefaultAISourced();
