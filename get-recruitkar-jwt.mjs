/**
 * Gets Recruitkar JWT via Google OAuth
 * Run: node get-recruitkar-jwt.mjs
 * 
 * Opens browser for Google login, captures JWT from Recruitkar
 */
import { exec } from 'child_process';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if we can get the Google OAuth URL from Recruitkar
async function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    mod.get({ hostname: u.hostname, path: u.pathname + u.search, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    }).on('error', reject);
  });
}

console.log('🔍 Checking Recruitkar Google OAuth URL...');

// Try to get the Google OAuth redirect URL
const authRes = await get('https://api.recruitkar.com/api/auth/google/url');
console.log('Google OAuth URL response:', authRes.status, authRes.body.substring(0, 200));

const authRes2 = await get('https://api.recruitkar.com/api/auth/google');
console.log('Google OAuth response:', authRes2.status, authRes2.headers.location || authRes2.body.substring(0, 200));

// Try to find the Google OAuth endpoint
const authRes3 = await get('https://api.recruitkar.com/api/auth/google/redirect');
console.log('Google redirect response:', authRes3.status, authRes3.body.substring(0, 200));

console.log('\n📋 MANUAL STEPS TO GET JWT:');
console.log('1. Open Chrome DevTools (F12)');
console.log('2. Go to https://app.recruitkar.com (or wherever Recruitkar app is)');
console.log('3. Login with Google (tanmai.babdetech@gmail.com)');
console.log('4. In DevTools → Application → Local Storage or Cookies');
console.log('5. Look for "token", "jwt", "accessToken" key');
console.log('6. Copy the JWT value');
console.log('7. Run: node save-recruitkar-jwt.mjs YOUR_JWT_HERE');
