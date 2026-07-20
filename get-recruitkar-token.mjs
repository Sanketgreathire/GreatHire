/**
 * Run this script after resetting the Recruitkar password:
 * node get-recruitkar-token.mjs
 * 
 * It will login, get the JWT, and save it to BackEnd/.env
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, 'BackEnd', '.env');

function readEnvVar(name) {
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1] : '';
}

const EMAIL = readEnvVar('RECRUITKAR_EMAIL');
const PASSWORD = readEnvVar('RECRUITKAR_PASSWORD'); // set this in BackEnd/.env after password reset

async function post(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

console.log('🔐 Logging into Recruitkar...');
const res = await post('https://api.recruitkar.com/api/auth/login', { email: EMAIL, password: PASSWORD });

console.log('Status:', res.status);
console.log('Response:', JSON.stringify(res.body, null, 2));

const token = res.body?.token || res.body?.accessToken || res.body?.jwt || res.body?.data?.token;

if (!token) {
  console.error('❌ No token in response. Check credentials.');
  process.exit(1);
}

console.log('\n✅ Got JWT token:', token.substring(0, 50) + '...');

// Save to .env
let envContent = fs.readFileSync(envPath, 'utf8');

if (envContent.includes('RECRUITKAR_JWT=')) {
  envContent = envContent.replace(/RECRUITKAR_JWT=.*/, `RECRUITKAR_JWT=${token}`);
} else {
  envContent += `\nRECRUITKAR_JWT=${token}`;
}

if (envContent.includes('RECRUITKAR_PASSWORD=')) {
  envContent = envContent.replace(/RECRUITKAR_PASSWORD=.*/, `RECRUITKAR_PASSWORD=${PASSWORD}`);
}

fs.writeFileSync(envPath, envContent);
console.log('✅ JWT saved to BackEnd/.env');
console.log('🔄 Restart your backend server to apply changes.');
