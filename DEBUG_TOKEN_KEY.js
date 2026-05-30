// Copy-paste this into Chrome DevTools Console while logged into GreatHire
// This will show you ALL localStorage keys and their values

console.log('=== GreatHire Storage Debug ===\n');

// Check localStorage
console.log('📦 LocalStorage Keys:');
const localStorageKeys = Object.keys(localStorage);
console.log(`Total: ${localStorageKeys.length} keys\n`);

localStorageKeys.forEach(key => {
  const value = localStorage.getItem(key);
  const preview = value.length > 100 ? value.substring(0, 100) + '...' : value;
  
  // Highlight JWT-like tokens (long strings starting with eyJ or containing 'token')
  const isToken = value.length > 50 || key.toLowerCase().includes('token') || key.toLowerCase().includes('auth');
  const marker = isToken ? '🔐 TOKEN-LIKE:' : '  ';
  
  console.log(`${marker} ${key}: ${preview}`);
  if (isToken) {
    console.log(`   Full length: ${value.length} characters`);
  }
});

// Check sessionStorage
console.log('\n\n📦 SessionStorage Keys:');
const sessionStorageKeys = Object.keys(sessionStorage);
console.log(`Total: ${sessionStorageKeys.length} keys\n`);

sessionStorageKeys.forEach(key => {
  const value = sessionStorage.getItem(key);
  const preview = value.length > 100 ? value.substring(0, 100) + '...' : value;
  
  const isToken = value.length > 50 || key.toLowerCase().includes('token') || key.toLowerCase().includes('auth');
  const marker = isToken ? '🔐 TOKEN-LIKE:' : '  ';
  
  console.log(`${marker} ${key}: ${preview}`);
  if (isToken) {
    console.log(`   Full length: ${value.length} characters`);
  }
});

// Check cookies
console.log('\n\n🍪 Cookies:');
if (document.cookie) {
  console.log(document.cookie);
} else {
  console.log('No cookies found');
}

// Show actual token value if found
console.log('\n\n=== Specific Checks ===');
const token = localStorage.getItem('token');
if (token) {
  console.log('✅ localStorage["token"] EXISTS:');
  console.log('Length:', token.length);
  console.log('First 50 chars:', token.substring(0, 50));
  console.log('Last 20 chars:', token.substring(token.length - 20));
} else {
  console.log('❌ localStorage["token"] DOES NOT EXIST');
}

// Copy to clipboard helper
console.log('\n\n=== Helper Functions ===');
console.log('Copy actual token to clipboard:');
console.log('Token key found? ' + (token ? 'YES' : 'NO'));
