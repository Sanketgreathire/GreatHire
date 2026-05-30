import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function migrateSourcingCandidates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const sourcingCandidates = db.collection('sourcingcandidates');
    const users = db.collection('users');

    // Count existing sourcing candidates
    const totalSourcing = await sourcingCandidates.countDocuments();
    console.log(`\n📊 Found ${totalSourcing} candidates in SourcingCandidate collection`);

    if (totalSourcing === 0) {
      console.log('⚠️ No candidates to migrate');
      await mongoose.disconnect();
      return;
    }

    console.log('\n🔄 Starting migration...');

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Process in batches
    const batchSize = 100;
    const cursor = sourcingCandidates.find({});

    while (await cursor.hasNext()) {
      const batch = [];
      for (let i = 0; i < batchSize && await cursor.hasNext(); i++) {
        batch.push(await cursor.next());
      }

      for (const candidate of batch) {
        try {
          // Check if user already exists by email
          if (!candidate.emails || candidate.emails.length === 0) {
            skipped++;
            continue;
          }

          const existingUser = await users.findOne({
            'emailId.email': candidate.emails[0]
          });

          if (existingUser) {
            skipped++;
            continue;
          }

          // Map source type
          let aiSourceType = 'API_IMPORT';
          if (candidate.sourceType === 'GITHUB_PROFILE') aiSourceType = 'GITHUB';
          else if (candidate.sourceType === 'LINKEDIN_PROFILE') aiSourceType = 'LINKEDIN';

          // Create user document
          const userDoc = {
            fullname: candidate.fullName || 'Unknown',
            emailId: {
              email: candidate.emails[0],
              isVerified: false,
            },
            phoneNumber: candidate.phones && candidate.phones.length > 0 ? {
              number: candidate.phones[0],
              isVerified: false,
            } : undefined,
            role: 'student',
            address: {
              city: candidate.location || '',
            },
            profile: {
              skills: candidate.normalizedSkills || candidate.skills || [],
              bio: candidate.summary || '',
              hasExperience: (candidate.totalExperience || 0) > 0,
              experiences: candidate.currentCompany ? [{
                companyName: candidate.currentCompany,
                jobProfile: candidate.designation || '',
                currentlyWorking: true,
              }] : [],
            },
            // AI Sourcing fields
            isAISourced: true,
            aiSourceType: aiSourceType,
            aiSourcedAt: candidate.createdAt || new Date(),
            aiSourcedBy: candidate.createdBy,
            githubUrl: candidate.githubUrl || '',
            linkedinUrl: candidate.linkedinUrl || '',
            createdAt: candidate.createdAt || new Date(),
            updatedAt: candidate.updatedAt || new Date(),
          };

          await users.insertOne(userDoc);
          imported++;

          if (imported % 100 === 0) {
            console.log(`   ✅ Migrated ${imported} candidates...`);
          }
        } catch (err) {
          errors++;
          if (errors <= 5) {
            console.error(`   ❌ Error migrating ${candidate.fullName}:`, err.message);
          }
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log('─────────────────────────');
    console.log(`✅ Imported: ${imported}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);

    // Verify counts
    const aiSourcedCount = await users.countDocuments({ isAISourced: true });
    console.log(`\n✅ Total AI Sourced in User collection: ${aiSourcedCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

migrateSourcingCandidates();
