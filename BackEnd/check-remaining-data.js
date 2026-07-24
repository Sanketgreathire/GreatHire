import mongoose from 'mongoose';
import 'dotenv/config';
import { SourcingCandidate } from './models/sourcing/SourcingCandidate.model.js';

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check total count
    const total = await SourcingCandidate.countDocuments();
    console.log(`📊 Total SourcingCandidate records: ${total}`);

    // Check if any have emails
    const withEmails = await SourcingCandidate.countDocuments({
      emails: { $exists: true, $ne: [], $ne: null }
    });
    console.log(`📧 Records with emails array: ${withEmails}`);

    // Check if any have phones
    const withPhones = await SourcingCandidate.countDocuments({
      phones: { $exists: true, $ne: [], $ne: null }
    });
    console.log(`📱 Records with phones array: ${withPhones}`);

    // Sample one record to see structure
    const sample = await SourcingCandidate.findOne().limit(1);
    if (sample) {
      console.log('\n📄 Sample record structure:');
      console.log(JSON.stringify({
        fullName: sample.fullName,
        emails: sample.emails,
        phones: sample.phones,
        skills: sample.skills?.slice(0, 3)
      }, null, 2));
    }

    console.log('\n💡 MongoDB Atlas may have automatic backups.');
    console.log('   Check: Atlas Console → Backup → Continuous Backup');
    console.log('   You can restore to a point-in-time before the deletion.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkData();
