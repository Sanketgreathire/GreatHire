import dotenv from 'dotenv';
dotenv.config();

import { LinkedInScraper } from './sourcing/scrapers/linkedinScraper.js';

async function testLinkedInScraper() {
  console.log('🔍 Testing LinkedIn Scraper with ProxyCurl...\n');
  
  const scraper = new LinkedInScraper();
  
  if (!process.env.PROXYCURL_API_KEY) {
    console.log('❌ PROXYCURL_API_KEY not found in .env file');
    console.log('💡 Add your ProxyCurl API key to .env:');
    console.log('   PROXYCURL_API_KEY=your_api_key_here');
    return;
  }
  
  console.log('✅ PROXYCURL_API_KEY found');
  
  const criteria = {
    keywords: 'software developer',
    location: 'India',
    language: 'JavaScript'
  };
  
  console.log('📋 Search criteria:', criteria);
  console.log('⏳ Searching LinkedIn profiles...\n');
  
  try {
    const profiles = await scraper.searchProfiles(criteria, 5);
    
    if (profiles.length === 0) {
      console.log('⚠️ No profiles found. Possible issues:');
      console.log('   - Invalid API key');
      console.log('   - Rate limit reached');
      console.log('   - No matching profiles');
    } else {
      console.log(`✅ Found ${profiles.length} LinkedIn profiles:\n`);
      
      profiles.forEach((profile, index) => {
        console.log(`👤 Profile ${index + 1}:`);
        console.log(`   Name: ${profile.fullName}`);
        console.log(`   Title: ${profile.designation}`);
        console.log(`   Location: ${profile.location}`);
        console.log(`   Company: ${profile.company}`);
        console.log(`   Experience: ${profile.totalExperience} years`);
        console.log(`   Skills: ${profile.skills?.slice(0, 5).join(', ')}...`);
        console.log(`   LinkedIn URL: ${profile.linkedinUrl || 'Not available'}`);
        console.log(`   Emails: ${profile.emails?.join(', ') || 'None'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLinkedInScraper();