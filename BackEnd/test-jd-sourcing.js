import { JdSourcingService } from './sourcing/services/jdSourcingService.js';

/**
 * Test JD-Based Sourcing
 * Run with: node BackEnd/test-jd-sourcing.js
 */
async function testJdSourcing() {
  console.log('🧪 Testing JD-Based Sourcing...\n');

  const jdSourcing = new JdSourcingService();

  // Test filters
  const filters = {
    skills: 'JavaScript, React',
    location: 'Bangalore',
    designation: 'Frontend Developer',
    minExp: 2,
    maxExp: 5,
    jobDescription: `
We are looking for a Frontend Developer with strong React.js experience.
Requirements:
- 3+ years of experience with React
- Strong JavaScript/TypeScript skills
- Experience with modern frontend tools (Webpack, Vite)
- Good understanding of REST APIs
- Bangalore location preferred
    `.trim()
  };

  try {
    console.log('📋 Test Filters:', JSON.stringify(filters, null, 2));
    console.log('\n⏳ Sourcing and scoring candidates...\n');

    const result = await jdSourcing.sourceAndScore(filters, 5);

    console.log('✅ Results:');
    console.log(`   Mode: ${result.mode}`);
    console.log(`   Total: ${result.total} candidates`);
    console.log();

    if (result.candidates.length > 0) {
      console.log('🎯 Top Candidates:\n');
      result.candidates.slice(0, 5).forEach((c, i) => {
        console.log(`${i + 1}. ${c.fullName} - ${c.matchScore}% match`);
        console.log(`   Designation: ${c.designation}`);
        console.log(`   Skills: ${c.skills?.join(', ') || 'N/A'}`);
        console.log(`   Location: ${c.location || 'N/A'}`);
        console.log(`   Experience: ${c.totalExperience || 0} years`);
        if (c.matchReasons?.length > 0) {
          console.log(`   Match Reasons:`);
          c.matchReasons.forEach(r => console.log(`      - ${r}`));
        }
        console.log();
      });
    } else {
      console.log('⚠️  No candidates found');
    }

    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run test
testJdSourcing();
