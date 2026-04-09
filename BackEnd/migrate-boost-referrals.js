import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    const result = await User.updateMany(
      { referralCount: { $gte: 5 }, isProfileBoosted: { $ne: true } },
      { $set: { isProfileBoosted: true } }
    );

    console.log(`Migration complete. Users boosted: ${result.modifiedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
