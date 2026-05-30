import { ContactExtractorService } from './BackEnd/sourcing/services/contactExtractorService.js';

console.log('🧪 Testing Contact Extractor Service\n');

// Test 1: Email Extraction
console.log('📧 Test 1: Email Extraction');
const testText1 = `
  Contact me at john.doe@example.com or reach out via work email: john@company.com
  Also available at noreply@test.com (this should be filtered)
`;
const emails = ContactExtractorService.extractEmails(testText1);
console.log('Extracted emails:', emails);
console.log('✅ Expected: 2 valid emails (filtered noreply)\n');

// Test 2: Phone Number Extraction (Multiple Formats)
console.log('📱 Test 2: Phone Number Extraction');
const testText2 = `
  Indian: +91-98765-43210, 9876543210, +91 98765 43210
  US: (555) 123-4567, 555-123-4567
  International: +44 7911 123456
  Contact: Call me at 9123456789
`;
const phones = ContactExtractorService.extractPhones(testText2);
console.log('Extracted phones:', phones);
console.log('✅ Expected: Multiple phone numbers in normalized format\n');

// Test 3: Social Links Extraction
console.log('🔗 Test 3: Social Links Extraction');
const testText3 = `
  GitHub: https://github.com/johndoe
  LinkedIn: linkedin.com/in/john-doe
  Twitter: @johndoe
  Portfolio: johndoe.dev
`;
const socialLinks = ContactExtractorService.extractSocialLinks(testText3);
console.log('Extracted social links:', socialLinks);
console.log('✅ Expected: GitHub, LinkedIn, Twitter, Portfolio URLs\n');

// Test 4: Location Extraction
console.log('📍 Test 4: Location Extraction');
const testText4 = `
  Based in Bangalore, India
  📍 Mumbai, Maharashtra
  Located in San Francisco, CA
`;
const location1 = ContactExtractorService.extractLocation('Based in Bangalore, India');
const location2 = ContactExtractorService.extractLocation('📍 Mumbai, Maharashtra');
console.log('Location 1:', location1);
console.log('Location 2:', location2);
console.log('✅ Expected: Bangalore, India and Mumbai, Maharashtra\n');

// Test 5: Profile Overview Generation
console.log('📝 Test 5: Profile Overview Generation');
const sampleProfile = {
  fullName: 'Rahul Sharma',
  location: 'Bangalore, India',
  designation: 'Senior Full Stack Developer',
  company: 'Tech Solutions Pvt Ltd',
  totalExperience: 5,
  skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
  education: [
    { degree: 'B.Tech in Computer Science', institution: 'IIT Delhi', year: '2018' }
  ],
  emails: ['rahul.sharma@email.com'],
  phones: ['+919876543210'],
  bio: 'Passionate about building scalable web applications.',
};

const overview = ContactExtractorService.generateProfileOverview(sampleProfile);
console.log('Generated Overview:');
console.log(overview);
console.log('\n✅ Expected: Comprehensive profile summary with all details\n');

// Test 6: Profile Enrichment
console.log('🔧 Test 6: Profile Enrichment');
const incompleteProfile = {
  fullName: 'Priya Patel',
  bio: 'Software Engineer | Contact: priya@email.com | Phone: +91-9123456789 | GitHub: github.com/priyapatel',
  skills: ['Python', 'Django', 'PostgreSQL'],
};

const enrichedProfile = ContactExtractorService.enrichProfile(incompleteProfile);
console.log('Enriched Profile:');
console.log(JSON.stringify(enrichedProfile, null, 2));
console.log('\n✅ Expected: Profile with extracted emails, phones, and social links\n');

// Test 7: Phone Normalization
console.log('🔢 Test 7: Phone Normalization');
const testPhones = [
  '9876543210',
  '+91-98765-43210',
  '91 9876543210',
  '(555) 123-4567',
  '+44 7911 123456',
];

console.log('Original → Normalized:');
testPhones.forEach(phone => {
  const normalized = ContactExtractorService.normalizePhone(phone, 'IN');
  console.log(`${phone} → ${normalized}`);
});
console.log('✅ Expected: All phones normalized with country codes\n');

console.log('✨ All tests completed!');
