import https from 'https';
import http from 'http';
import fs from 'fs';

// Minimal .env loader (avoids requiring the `dotenv` package at repo root)
const envPath = new URL('./BackEnd/.env', import.meta.url);
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (match) process.env[match[1]] ??= match[2];
}

const RK_EMAIL = process.env.RECRUITKAR_EMAIL;
const RK_PASSWORD = process.env.RECRUITKAR_PASSWORD;
const RK_API_KEY = process.env.RECRUITKAR_API_KEY;

async function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const mod = urlObj.protocol === 'https:' ? https : http;
    const opts = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    if (body) {
      opts.headers['Content-Length'] = Buffer.byteLength(body);
    }
    const req = mod.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// Test 1: Login with email/password
console.log('\n=== Test 1: Login ===');
const loginBody = JSON.stringify({ email: RK_EMAIL, password: RK_PASSWORD });
const loginRes = await request('https://api.recruitkar.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, loginBody);
console.log('Status:', loginRes.status);
console.log('Set-Cookie:', loginRes.headers['set-cookie']);
console.log('Body:', loginRes.body);

// Test 2: Try API key as Bearer on jobs
console.log('\n=== Test 2: Jobs with API key ===');
const jobsRes = await request('https://api.recruitkar.com/api/jobs', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${RK_API_KEY}`, 'x-api-key': RK_API_KEY }
});
console.log('Status:', jobsRes.status);
console.log('Body:', jobsRes.body.substring(0, 500));

// Test 3: POST job with API key
console.log('\n=== Test 3: POST Job ===');
const jobBody = JSON.stringify({
  title: 'React Developer',
  description: 'We need a React developer with 3 years experience',
  location: 'Hyderabad',
  skills: ['React', 'JavaScript', 'Node.js'],
  experience: '2-5'
});
const postJobRes = await request('https://api.recruitkar.com/api/jobs', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RK_API_KEY}`,
    'x-api-key': RK_API_KEY
  }
}, jobBody);
console.log('Status:', postJobRes.status);
console.log('Body:', postJobRes.body.substring(0, 500));
