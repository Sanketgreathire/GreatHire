// GreatHire Injected Script - Authentication Status Checker
// This script runs in the GreatHire website context (has access to httpOnly cookies)
// It checks authentication status and relays messages to extension

console.log('[GreatHire Extension] Injected script loaded');

let lastAuthStatus = null;

// Listen for messages from content script
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GREATHIRE_EXTENSION_REQUEST') {
    console.log('[GreatHire Extension] Request from extension:', event.data.action);
    
    if (event.data.action === 'checkAuth') {
      checkAuthentication();
    } else if (event.data.action === 'uploadProfile') {
      uploadProfile(event.data.profile);
    }
  }
});

// Check authentication by calling /profile endpoint
function checkAuthentication() {
  console.log('[GreatHire Extension] Checking authentication...');
  
  fetch('http://localhost:3000/api/v1/recruiter/profile', {
    method: 'GET',
    credentials: 'include',  // Send httpOnly cookies automatically
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => {
    console.log('[GreatHire Extension] Auth check response:', res.status);
    
    // Only try to parse JSON if content-type is JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json().then(data => ({
        status: res.status,
        data: data
      }));
    } else {
      // If not JSON, treat as error
      return {
        status: res.status,
        data: null
      };
    }
  })
  .then(({ status, data }) => {
    const isAuth = status === 200 && data && data.success;
    
    if (isAuth) {
      console.log('[GreatHire Extension] ✅ User is authenticated');
      lastAuthStatus = true;
    } else {
      console.log('[GreatHire Extension] ❌ User is not authenticated');
      lastAuthStatus = false;
    }
    
    // Send auth status to content script
    window.postMessage({
      type: 'GREATHIRE_AUTH_STATUS',
      authenticated: isAuth,
      timestamp: Date.now()
    }, '*');
  })
  .catch(err => {
    console.error('[GreatHire Extension] Auth check failed:', err.message);
    lastAuthStatus = false;
    window.postMessage({
      type: 'GREATHIRE_AUTH_STATUS',
      authenticated: false,
      timestamp: Date.now()
    }, '*');
  });
}

// Upload a profile to backend
function uploadProfile(profile) {
  console.log('[GreatHire Extension] Uploading profile:', profile);
  
  fetch('http://localhost:3000/api/v1/sourcing/upload-manual', {
    method: 'POST',
    credentials: 'include',  // Send httpOnly cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  })
  .then(res => {
    console.log('[GreatHire Extension] Upload response:', res.status);
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    } else {
      throw new Error('Upload endpoint returned non-JSON response');
    }
  })
  .then(data => {
    console.log('[GreatHire Extension] Upload success:', data);
    window.postMessage({
      type: 'GREATHIRE_UPLOAD_RESPONSE',
      success: true,
      data: data
    }, '*');
  })
  .catch(err => {
    console.error('[GreatHire Extension] Upload failed:', err.message);
    window.postMessage({
      type: 'GREATHIRE_UPLOAD_RESPONSE',
      success: false,
      error: err.message
    }, '*');
  });
}

// Check auth on page load
window.addEventListener('load', () => {
  console.log('[GreatHire Extension] Page loaded, checking authentication...');
  checkAuthentication();
});

// Check auth periodically
setInterval(checkAuthentication, 10000);

console.log('[GreatHire Extension] Injected script ready - will handle authenticated API calls');
