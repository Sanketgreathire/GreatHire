// Comprehensive token finder - check ALL possible locations
console.log('🔍 COMPREHENSIVE TOKEN SEARCH\n');

// Check sessionStorage
console.log('=== SessionStorage ===');
const sessionKeys = Object.keys(sessionStorage);
console.log(`Total keys: ${sessionKeys.length}`);
sessionKeys.forEach(key => {
  const val = sessionStorage.getItem(key);
  console.log(`${key}: ${val.substring(0, 100)}`);
});

// Check all localStorage keys again
console.log('\n=== LocalStorage (ALL KEYS) ===');
const localKeys = Object.keys(localStorage);
localKeys.forEach(key => {
  const val = localStorage.getItem(key);
  const preview = val.length > 100 ? val.substring(0, 100) : val;
  console.log(`${key}: ${preview}`);
});

// Check cookies
console.log('\n=== Cookies ===');
const cookies = document.cookie.split(';');
cookies.forEach(c => {
  console.log(c.trim());
});

// Check for token in API responses (intercepted)
console.log('\n=== Checking window object for token ===');
if (window.authToken) console.log('window.authToken:', window.authToken);
if (window.token) console.log('window.token:', window.token);
if (window.__AUTH__) console.log('window.__AUTH__:', window.__AUTH__);

// Check axios/fetch default headers
console.log('\n=== Checking for Authorization header ===');
// This won't show the actual header but might show something
console.log('Look for Authorization in Network tab when making API calls');
