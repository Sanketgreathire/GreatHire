import 'dotenv/config';
import { initPostgres, closePool } from './config/postgres.js';
import { autoSourcingService } from './sourcing/services/autoSourcingService.js';

const testAutoSourcing = async () => {
  try {
    console.log('🧪 Testing AI Auto-Sourcing to PostgreSQL...\n');
    
    initPostgres();
    
    const criteria = {
      language: 'JavaScript',
      location: 'India',
      minRepos: 1,
      minFollowers: 0
    };
    
    const recruiterId = 'test-recruiter-123';
    
    console.log('🔍 Searching GitHub with criteria:', criteria);
    console.log('📝 Will save to PostgreSQL (Supabase)\n');
    
    const result = await autoSourcingService.sourceFromGitHub(criteria, recruiterId);
    
    console.log('\n📊 Results:');
    console.log(`   ✅ Imported: ${result.imported}`);
    console.log(`   ⏭️  Skipped: ${result.skipped}`);
    
    if (result.details.imported.length > 0) {
      console.log('\n👥 Imported candidates:');
      result.details.imported.slice(0, 5).forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.full_name} - ${c.email}`);
      });
    }
    
    if (result.details.skipped.length > 0) {
      console.log('\n⚠️  Skipped candidates:');
      result.details.skipped.slice(0, 5).forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.profile} - Reason: ${s.reason}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await closePool();
    process.exit(0);
  }
};

testAutoSourcing();
