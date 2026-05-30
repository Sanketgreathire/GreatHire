// GreatHire Talent Sourcer - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Check login status
  checkLoginStatus();
  
  // Load stats
  loadStats();
  
  // Extract button click
  document.getElementById('extractBtn').addEventListener('click', extractProfiles);
  
  // Add refresh login button if exists
  const refreshBtn = document.getElementById('refreshLogin');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('Manual refresh triggered');
      checkLoginStatus();
    });
  }
  
  // Auto-refresh login status every 2 seconds
  setInterval(checkLoginStatus, 2000);
});

async function checkLoginStatus() {
  try {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;
    
    // First, check background script for login status
    chrome.runtime.sendMessage({ action: 'checkLogin' }, async (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Extension] Runtime error:', chrome.runtime.lastError);
        statusEl.className = 'status disconnected';
        statusEl.textContent = '❌ Extension Error';
        return;
      }
      
      if (response && response.loggedIn) {
        statusEl.className = 'status connected';
        statusEl.textContent = '✅ Connected to GreatHire';
        document.getElementById('extractBtn').disabled = false;
        
        // Log for debugging
        console.log('[Extension] ✅ Login detected');
      } else {
        statusEl.className = 'status disconnected';
        statusEl.textContent = '⚠️ Please login to GreatHire first';
        document.getElementById('extractBtn').disabled = true;
        
        console.log('[Extension] ❌ Not logged in');
      }
    });
  } catch (error) {
    console.error('[Extension] Login check error:', error);
    document.getElementById('status').className = 'status disconnected';
    document.getElementById('status').textContent = '❌ Error checking login';
  }
}

async function loadStats() {
  try {
    const { stats } = await chrome.storage.local.get(['stats']);
    
    if (stats) {
      document.getElementById('todayCount').textContent = stats.today || 0;
      document.getElementById('totalCount').textContent = stats.total || 0;
    } else {
      document.getElementById('todayCount').textContent = 0;
      document.getElementById('totalCount').textContent = 0;
    }
  } catch (error) {
    console.error('[Extension] Error loading stats:', error);
  }
}

async function extractProfiles() {
  const button = document.getElementById('extractBtn');
  const originalText = button.textContent;
  button.textContent = 'Checking login...';
  button.disabled = true;
  
  try {
    // First check if user is logged in
    const loginStatus = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'checkLogin' }, resolve);
    });
    
    if (!loginStatus.loggedIn) {
      button.textContent = '❌ Please login first';
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
      console.log('[Extension] Extract failed: not logged in');
      return;
    }
    
    button.textContent = 'Getting active tab...';
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      button.textContent = '❌ No active tab';
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
      return;
    }
    
    // Check if tab is on a supported platform
    const supportedSites = ['linkedin.com', 'naukri.com', 'indeed'];
    const isSupported = supportedSites.some(site => tab.url.includes(site));
    
    if (!isSupported) {
      button.textContent = '❌ Not on supported site';
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
      console.log('[Extension] Not on supported site:', tab.url);
      return;
    }
    
    button.textContent = 'Extracting profiles...';
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'extractProfiles' }, async (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Extension] Content script error:', chrome.runtime.lastError);
        button.textContent = '❌ Please refresh the page';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
        return;
      }
      
      if (!response) {
        button.textContent = '❌ No response from page';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
        return;
      }
      
      console.log('[Extension] Response:', response);
      
      if (response.success) {
        if (response.count === 0) {
          button.textContent = '📭 No profiles on this page';
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 3000);
          return;
        }
        
        button.textContent = `Saving ${response.count} profiles...`;
        
        // Send to background script to save
        chrome.runtime.sendMessage({
          action: 'saveProfiles',
          profiles: response.profiles
        }, async (saveResponse) => {
          if (chrome.runtime.lastError) {
            console.error('[Extension] Save error:', chrome.runtime.lastError);
            button.textContent = '❌ Connection error';
            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 2000);
            return;
          }
          
          if (saveResponse && saveResponse.success) {
            button.textContent = `✅ Saved ${response.count} profiles!`;
            
            // Update stats
            const { stats = { today: 0, total: 0 } } = await chrome.storage.local.get(['stats']);
            stats.today = (stats.today || 0) + response.count;
            stats.total = (stats.total || 0) + response.count;
            await chrome.storage.local.set({ stats });
            
            loadStats();
            
            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 2000);
          } else {
            console.error('[Extension] Save failed:', saveResponse?.error);
            button.textContent = `❌ Save failed`;
            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 3000);
          }
        });
      } else {
        console.error('[Extension] Extraction failed:', response.error);
        button.textContent = `❌ ${response.error || 'Extraction failed'}`;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }
    });
  } catch (error) {
    console.error('[Extension] Extract error:', error);
    button.textContent = '❌ Error occurred';
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  }
}
