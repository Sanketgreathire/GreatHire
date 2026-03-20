import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode() {
  let code = '';
  for (let i = 0; i < 6; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Starting migration...');

    const users = await User.find({}, { _id: 1, referralCode: 1 }).lean();

    const existingCodes = new Set(users.map(u => u.referralCode).filter(Boolean));

    const operations = [];
    for (const user of users) {
      if (user.referralCode) continue;
      let code;
      do { code = generateCode(); } while (existingCodes.has(code));
      existingCodes.add(code);
      operations.push({ updateOne: { filter: { _id: user._id }, update: { $set: { referralCode: code } } } });
    }

    if (operations.length) await User.bulkWrite(operations);

    console.log('Migration completed');
    console.log(`Users processed: ${users.length} | Referral codes added: ${operations.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
