// GreatHire Talent Sourcer - Background Script
console.log('[Background] Service worker initialized');

let authStatus = {
  isAuthenticated: false,
  lastChecked: null
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setAuthToken') {
    authStatus.isAuthenticated = request.authenticated || false;
    authStatus.lastChecked = new Date().toISOString();
    chrome.storage.local.set(authStatus);
    console.log('[Background] Auth:', authStatus.isAuthenticated ? '✅ YES' : '❌ NO');
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

  if (request.action === 'saveProfiles') {
    console.log('[Background] Saving', request.profiles?.length || 0, 'profiles');
    
    // Upload each profile to backend
    const profiles = request.profiles || [];
    let savedCount = 0;
    let errorCount = 0;

    profiles.forEach((profile, idx) => {
      // Map extension fields to backend expected format
      const uploadData = {
        fullName: profile.fullName || profile.designation || 'Unknown',
        designation: profile.designation || '',
        currentCompany: profile.company || '',
        location: profile.location || '',
        summary: profile.bio || '',
        linkedinUrl: profile.linkedinUrl || '',
        emails: profile.emails && Array.isArray(profile.emails) ? profile.emails : (profile.emails ? [profile.emails] : []),
        phones: profile.phones && Array.isArray(profile.phones) ? profile.phones : (profile.phones ? [profile.phones] : []),
        skills: profile.skills && Array.isArray(profile.skills) ? profile.skills : [],
        totalExperience: profile.totalExperience || 0,
        platform: 'chrome_extension'
      };

      console.log('[Background] Uploading profile:', uploadData.fullName);

      // Send to GreatHire backend (which requires authenticated cookies)
      fetch('http://localhost:3000/api/v1/sourcing/upload-manual', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData)
      })
      .then(res => {
        console.log('[Background] Upload response status:', res.status);
        if (res.status === 201 || res.status === 200) {
          return res.json();
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      })
      .then(data => {
        if (data.success) {
          console.log('[Background] ✅ Profile uploaded:', uploadData.fullName);
          savedCount++;
        } else {
          console.error('[Background] ❌ Upload failed:', data.message);
          errorCount++;
        }

        // Send response after all uploads complete
        if (savedCount + errorCount === profiles.length) {
          sendResponse({
            success: errorCount === 0,
            saved: savedCount,
            failed: errorCount,
            message: `Saved ${savedCount} profiles` + (errorCount > 0 ? `, ${errorCount} failed` : '')
          });
        }
      })
      .catch(err => {
        console.error('[Background] Upload error for', uploadData.fullName, ':', err);
        errorCount++;

        if (savedCount + errorCount === profiles.length) {
          sendResponse({
            success: false,
            saved: savedCount,
            failed: errorCount,
            message: err.message
          });
        }
      });
    });

    if (profiles.length === 0) {
      sendResponse({ success: false, message: 'No profiles to save' });
    }

    return true; // Keep channel open for async response
  }
});

console.log('[Background] Service worker ready');
