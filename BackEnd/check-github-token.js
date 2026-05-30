import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Checking GitHub Token...\n');

if (process.env.GITHUB_TOKEN) {
  const token = process.env.GITHUB_TOKEN;
  const masked = token.substring(0, 7) + '...' + token.substring(token.length - 4);
  console.log('✅ GitHub token found:', masked);
  console.log('✅ Token length:', token.length, 'characters');
  console.log('\n✅ Token is loaded correctly!');
} else {
  console.log('❌ No GitHub token found!');
  console.log('\n📝 To fix:');
  console.log('1. Add to BackEnd/.env:');
  console.log('   GITHUB_TOKEN=ghp_your_token_here');
  console.log('2. Restart the server');
}
