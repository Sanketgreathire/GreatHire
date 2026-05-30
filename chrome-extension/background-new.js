// GreatHire Talent Sourcer - Background Script
console.log('[Background] Service worker initialized');

let authStatus = {
  isAuthenticated: false,
  lastChecked: null
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Message:', request.action);
  
  if (request.action === 'setAuthToken') {
    authStatus.isAuthenticated = request.authenticated || false;
    authStatus.lastChecked = new Date().toISOString();
    chrome.storage.local.set(authStatus);
    console.log('[Background] Auth updated:', authStatus.isAuthenticated ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED');
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'checkLogin') {
    sendResponse({
      loggedIn: authStatus.isAuthenticated,
      lastChecked: authStatus.lastChecked
    });
    return true;
  }
  
  if (request.action === 'uploadResponse') {
    console.log('[Background] Upload:', request.success ? 'SUCCESS' : 'FAILED');
    sendResponse({ success: true });
    return true;
  }
});

console.log('[Background] Service worker ready');

chrome.runtime.onInstalled.addListener(() => {
  console.log('GreatHire Extension installed');
});
