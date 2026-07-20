/**
 * Save Recruitkar JWT to .env
 * Usage: node save-recruitkar-jwt.mjs YOUR_JWT_TOKEN_HERE
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const token = process.argv[2];

if (!token) {
  console.log('Usage: node save-recruitkar-jwt.mjs YOUR_JWT_TOKEN');
  console.log('\nHow to get JWT from browser:');
  console.log('1. Open https://recruitkar.com in Chrome');
  console.log('2. Login with Google (tanmai.babdetech@gmail.com)');
  console.log('3. Press F12 → Application tab → Local Storage → https://recruitkar.com');
  console.log('4. Find key: "token" or "accessToken" or "jwt"');
  console.log('5. Copy the value and run: node save-recruitkar-jwt.mjs PASTE_TOKEN_HERE');
  process.exit(0);
}

// Test the token
console.log('🔐 Testing token...');
const testResult = await new Promise((resolve) => {
  const req = https.request({
    hostname: 'api.recruitkar.com',
    path: '/api/jobs',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => resolve({ status: res.statusCode, body: d }));
  });
  req.on('error', () => resolve({ status: 0, body: 'connection error' }));
  req.end();
});

console.log('Token test status:', testResult.status);
console.log('Response:', testResult.body.substring(0, 200));

if (testResult.status === 401) {
  console.error('❌ Token is invalid or expired. Please get a fresh token from browser.');
  process.exit(1);
}

// Save to .env
const envPath = path.join(__dirname, 'BackEnd', '.env');
let envContent = fs.readFileSync(envPath, 'utf8');
envContent = envContent.replace(/RECRUITKAR_JWT=.*/, `RECRUITKAR_JWT=${token}`);
fs.writeFileSync(envPath, envContent);

console.log('✅ JWT saved to BackEnd/.env');
console.log('🔄 Restart backend: cd BackEnd && npm run dev');
