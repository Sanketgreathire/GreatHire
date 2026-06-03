// GreatHire Content Script - Runs on GreatHire website
// Injects script and relays messages between extension and frontend context

console.log('[GreatHire Extension] Content script loaded on GreatHire website');

// Inject the injected script into the page context
function injectScript() {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function() {
      console.log('[GreatHire Extension] ✅ Injected script loaded and executed');
      this.remove();
    };
    script.onerror = function() {
      console.error('[GreatHire Extension] ❌ Failed to load injected script');
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
    console.log('[GreatHire Extension] Injected script tag added to page');
  } catch (error) {
    console.error('[GreatHire Extension] Failed to inject script:', error);
  }
}

// Listen for messages from the injected script (running in page context)
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  // AUTH STATUS MESSAGE
  if (event.data && event.data.type === 'GREATHIRE_AUTH_STATUS') {
    console.log('[GreatHire Extension] Auth status from frontend:', event.data.authenticated);
    
    // Relay to background script
    chrome.runtime.sendMessage({
      action: 'setAuthToken',
      authenticated: event.data.authenticated,
      timestamp: event.data.timestamp
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[GreatHire Extension] ❌ Error sending auth status:', chrome.runtime.lastError);
      } else if (response && response.success) {
        console.log('[GreatHire Extension] ✅ Auth status relayed to extension');
      }
    });
  }
  
  // UPLOAD RESPONSE MESSAGE
  if (event.data && event.data.type === 'GREATHIRE_UPLOAD_RESPONSE') {
    console.log('[GreatHire Extension] Upload response from frontend:', event.data);
    
    // Relay to background script
    chrome.runtime.sendMessage({
      action: 'uploadResponse',
      success: event.data.success,
      data: event.data.data,
      error: event.data.error
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[GreatHire Extension] Error relaying upload response:', chrome.runtime.lastError);
      }
    });
  }
});

// Inject the script on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectScript);
} else {
  injectScript();
}

console.log('[GreatHire Extension] Content script ready - waiting for messages');
