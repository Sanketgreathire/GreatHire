import mongoose from 'mongoose';
import 'dotenv/config';
import { User } from './models/user.model.js';
import { SourcingCandidate } from './models/sourcing/SourcingCandidate.model.js';

const cleanupAISourcingData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Delete candidates without email AND phone from User collection
    console.log('\n📋 Step 1: Cleaning User collection...');
    const userDeleteResult = await User.deleteMany({
      isAISourced: true,
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' }
      ],
      $and: [
        {
          $or: [
            { phone: { $exists: false } },
            { phone: null },
            { phone: '' }
          ]
        }
      ]
    });
    console.log(`   ❌ Deleted ${userDeleteResult.deletedCount} candidates without email AND phone`);

    // Step 2: Delete candidates without email AND phone from SourcingCandidate collection
    console.log('\n📋 Step 2: Cleaning SourcingCandidate collection...');
    const sourcingDeleteResult = await SourcingCandidate.deleteMany({
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' }
      ],
      $and: [
        {
          $or: [
            { 'contactInfo.phone': { $exists: false } },
            { 'contactInfo.phone': null },
            { 'contactInfo.phone': '' }
          ]
        }
      ]
    });
    console.log(`   ❌ Deleted ${sourcingDeleteResult.deletedCount} candidates without email AND phone`);

    // Step 3: Find and delete duplicate AI-sourced candidates in User collection
    console.log('\n📋 Step 3: Finding duplicates in User collection...');
    const duplicates = await User.aggregate([
      {
        $match: {
          isAISourced: true,
          email: { $exists: true, $ne: null, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$email',
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    let duplicatesDeleted = 0;
    for (const dup of duplicates) {
      // Keep the first one, delete the rest
      const idsToDelete = dup.ids.slice(1);
      await User.deleteMany({ _id: { $in: idsToDelete } });
      duplicatesDeleted += idsToDelete.length;
      console.log(`   🔄 Removed ${idsToDelete.length} duplicates for email: ${dup._id}`);
    }
    console.log(`   ❌ Total duplicates removed from User: ${duplicatesDeleted}`);

    // Step 4: Find and delete duplicate candidates in SourcingCandidate collection
    console.log('\n📋 Step 4: Finding duplicates in SourcingCandidate collection...');
    const sourcingDuplicates = await SourcingCandidate.aggregate([
      {
        $match: {
          email: { $exists: true, $ne: null, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$email',
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    let sourcingDuplicatesDeleted = 0;
    for (const dup of sourcingDuplicates) {
      // Keep the first one, delete the rest
      const idsToDelete = dup.ids.slice(1);
      await SourcingCandidate.deleteMany({ _id: { $in: idsToDelete } });
      sourcingDuplicatesDeleted += idsToDelete.length;
      console.log(`   🔄 Removed ${idsToDelete.length} duplicates for email: ${dup._id}`);
    }
    console.log(`   ❌ Total duplicates removed from SourcingCandidate: ${sourcingDuplicatesDeleted}`);

    // Step 5: Show final counts
    console.log('\n📊 Final Statistics:');
    const userAISourced = await User.countDocuments({ isAISourced: true });
    const sourcingCandidates = await SourcingCandidate.countDocuments();
    const jobSeekers = await User.countDocuments({ isAISourced: false });
    
    console.log(`   👥 Job Seekers: ${jobSeekers}`);
    console.log(`   🤖 AI-Sourced (User collection): ${userAISourced}`);
    console.log(`   🤖 AI-Sourced (SourcingCandidate): ${sourcingCandidates}`);
    console.log(`   📦 Total AI-Sourced: ${userAISourced + sourcingCandidates}`);

    console.log('\n✅ Cleanup completed successfully!');
    console.log(`\n📝 Summary:`);
    console.log(`   - Deleted ${userDeleteResult.deletedCount + sourcingDeleteResult.deletedCount} candidates without contact info`);
    console.log(`   - Deleted ${duplicatesDeleted + sourcingDuplicatesDeleted} duplicate candidates`);
    console.log(`   - Total freed: ${userDeleteResult.deletedCount + sourcingDeleteResult.deletedCount + duplicatesDeleted + sourcingDuplicatesDeleted} records`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

cleanupAISourcingData();
