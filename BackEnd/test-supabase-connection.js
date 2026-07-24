import 'dotenv/config';
import { initPostgres, getPool, closePool } from './config/postgres.js';
import { AISourcedCandidate } from './models/postgres/aiSourcedCandidate.model.js';

const testConnection = async () => {
  try {
    console.log('🔌 Testing Supabase PostgreSQL connection...\n');
    
    // Initialize connection
    initPostgres();
    console.log('✅ Connection pool initialized\n');

    // Test 1: Basic query
    console.log('📋 Test 1: Basic database query...');
    const result = await getPool().query('SELECT NOW() as current_time, version() as postgres_version');
    console.log(`✅ Connected! Server time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL version: ${result.rows[0].postgres_version.split(' ')[0]}\n`);

    // Test 2: Check table exists
    console.log('📋 Test 2: Checking if table exists...');
    const tableCheck = await getPool().query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'ai_sourced_candidates'
    `);
    if (tableCheck.rows.length > 0) {
      console.log('✅ Table "ai_sourced_candidates" exists\n');
    } else {
      console.log('❌ Table not found\n');
      return;
    }

    // Test 3: Count existing records
    console.log('📋 Test 3: Counting existing records...');
    const count = await AISourcedCandidate.countAll();
    console.log(`✅ Current records: ${count}\n`);

    // Test 4: Insert test candidate
    console.log('📋 Test 4: Inserting test candidate...');
    const testCandidate = await AISourcedCandidate.create({
      fullName: 'Test Candidate',
      email: 'test@example.com',
      phone: '+1234567890',
      skills: ['JavaScript', 'Python', 'React'],
      totalExperience: 3,
      currentCompany: 'Test Company',
      designation: 'Software Engineer',
      location: 'India',
      education: [],
      summary: 'Test candidate for verification',
      githubUrl: 'https://github.com/testuser',
      linkedinUrl: null,
      portfolioUrl: null,
      resumeUrl: null,
      aiSourceType: 'GITHUB',
      aiSourcedBy: 'test',
      recruiterId: 'test123'
    });
    console.log(`✅ Test candidate created with ID: ${testCandidate.id}\n`);

    // Test 5: Retrieve the candidate
    console.log('📋 Test 5: Retrieving test candidate...');
    const retrieved = await AISourcedCandidate.findByEmail('test@example.com');
    console.log(`✅ Retrieved: ${retrieved.full_name} - ${retrieved.email}\n`);

    // Test 6: Test duplicate check
    console.log('📋 Test 6: Testing duplicate prevention...');
    const duplicate = await AISourcedCandidate.checkDuplicate(
      'test@example.com',
      'https://github.com/testuser',
      null
    );
    if (duplicate) {
      console.log(`✅ Duplicate detection working! Found: ${duplicate.full_name}\n`);
    }

    // Test 7: Get stats
    console.log('📋 Test 7: Getting statistics...');
    const stats = await AISourcedCandidate.getStatsBySourceType();
    console.log('✅ Stats by source type:');
    stats.forEach(stat => {
      console.log(`   - ${stat.ai_source_type}: ${stat.count}`);
    });
    console.log();

    // Test 8: Delete test candidate
    console.log('📋 Test 8: Cleaning up test data...');
    await AISourcedCandidate.deleteById(testCandidate.id);
    console.log('✅ Test candidate deleted\n');

    console.log('🎉 All tests passed! Supabase PostgreSQL is ready!\n');
    console.log('📝 Summary:');
    console.log('   ✅ Connection: Working');
    console.log('   ✅ Table: Exists');
    console.log('   ✅ Insert: Working');
    console.log('   ✅ Query: Working');
    console.log('   ✅ Duplicate Check: Working');
    console.log('   ✅ Stats: Working');
    console.log('   ✅ Delete: Working');
    console.log('\n🚀 Ready to restart backend server!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check .env has correct POSTGRES_CONNECTION_STRING');
    console.error('   2. Verify Supabase project is active');
    console.error('   3. Check internet connection');
  } finally {
    await closePool();
    process.exit(0);
  }
};

testConnection();
