// GreatHire Talent Sourcer - Content Script
// Extracts candidate data from LinkedIn, Naukri, Indeed

console.log('GreatHire Talent Sourcer content script loaded on', window.location.hostname);

// Detect current platform
function detectPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes('linkedin.com')) return 'linkedin';
  if (hostname.includes('naukri.com')) return 'naukri';
  if (hostname.includes('indeed')) return 'indeed';
  return 'unknown';
}

// Extract LinkedIn profile data with better selectors for current LinkedIn UI
function extractLinkedInProfile() {
  const profiles = [];
  
  console.log('[GreatHire] Starting LinkedIn extraction...');
  console.log('[GreatHire] Current URL:', window.location.href);
  
  // Only try to reveal contact info on single profile pages, not search results
  if (window.location.href.includes('/in/') && !window.location.href.includes('/search/')) {
    tryRevealContactInfo();
  }
  
  // Find all LinkedIn profile links on the page
  const profileLinks = document.querySelectorAll('a[href*="/in/"]');
  console.log('[GreatHire] Found LinkedIn profile links:', profileLinks.length);
  
  if (profileLinks.length > 0) {
    const processedProfiles = new Set();
    
    profileLinks.forEach((link, idx) => {
      try {
        const profileUrl = link.href;
        if (!profileUrl || profileUrl.includes('javascript:') || processedProfiles.has(profileUrl)) {
          return;
        }
        processedProfiles.add(profileUrl);
        
        // Get parent container - LinkedIn uses specific classes
        let container = link.closest('.entity-result__item') || 
                       link.closest('.reusable-search__result-container') ||
                       link.closest('li.reusable-search__result-container') ||
                       link.closest('.search-results__result-item') ||
                       link.closest('li') || 
                       link.parentElement;
        
        if (!container) return;
        
        // Extract name - LinkedIn puts name in the link or nearby span
        let name = '';
        const nameSpan = link.querySelector('span[aria-hidden="true"]');
        if (nameSpan) {
          name = nameSpan.textContent?.trim() || '';
        } else {
          name = link.textContent?.trim() || '';
        }
        
        // Clean up name (remove extra whitespace, "View profile" text, etc.)
        name = name.replace(/View.*profile/gi, '').replace(/\s+/g, ' ').trim();
        
        // Extract designation/title - usually in a div with specific class
        let designation = '';
        const titleEl = container.querySelector('.entity-result__primary-subtitle') ||
                       container.querySelector('.entity-result__summary') ||
                       container.querySelector('[class*="subtitle"]');
        if (titleEl) {
          designation = titleEl.textContent?.trim() || '';
        }
        
        // Extract location
        let location = '';
        const locationEl = container.querySelector('.entity-result__secondary-subtitle') ||
                          container.querySelector('[class*="location"]');
        if (locationEl) {
          location = locationEl.textContent?.trim() || '';
        }
        
        if (name && name.length > 2 && !name.toLowerCase().includes('linkedin')) {
          const profile = {
            fullName: name,
            designation: designation,
            location: location,
            linkedinUrl: profileUrl,
            emails: extractEmailsFromPage(),
            phones: extractPhonesFromPage(),
            platform: 'linkedin'
          };
          profiles.push(profile);
          console.log('[GreatHire] ✅ Extracted:', name, '|', designation);
        }
      } catch (e) {
        console.error('[GreatHire] Error processing profile link:', e.message);
      }
    });
  }
  
  // If no profiles found, try single profile page
  if (profiles.length === 0) {
    console.log('[GreatHire] No search results found, trying single profile extraction...');
    
    const nameEl = document.querySelector(
      'h1[data-test-profile-name], ' +
      'h1.text-heading-xlarge, ' +
      '.pv-text-details__left-panel h1'
    );
    
    const headlineEl = document.querySelector(
      '[data-test-profile-headline], ' +
      '.text-body-medium.break-words'
    );
    
    if (nameEl) {
      const name = nameEl.textContent?.trim() || nameEl.innerText?.trim();
      const designation = headlineEl?.textContent?.trim() || '';
      
      if (name && name.length > 2) {
        const profile = {
          fullName: name,
          designation: designation,
          location: '',
          linkedinUrl: window.location.href,
          emails: extractEmailsFromPage(),
          phones: extractPhonesFromPage(),
          platform: 'linkedin'
        };
        profiles.push(profile);
        console.log('[GreatHire] ✅ Extracted single profile:', name);
      }
    } else {
      console.log('[GreatHire] ❌ Could not find profile name element on this page');
    }
  }
  
  console.log('[GreatHire] Total profiles extracted:', profiles.length);
  return profiles;
}

// Try to reveal contact information by clicking "Contact info" or similar
function tryRevealContactInfo() {
  try {
    // Only run on profile pages, not search results
    if (!window.location.href.includes('/in/') || window.location.href.includes('/search/')) {
      return;
    }
    
    // Common LinkedIn contact info button selectors
    const contactButtonSelectors = [
      'button[aria-label*="Contact info"]',
      'button[aria-label*="contact info"]',
      'a[href*="/overlay/contact-info"]'
    ];
    
    for (const selector of contactButtonSelectors) {
      const buttons = document.querySelectorAll(selector);
      for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
        
        if (text.includes('contact') || ariaLabel.includes('contact')) {
          console.log('[GreatHire Extension] Clicking contact info button');
          btn.click();
          return;
        }
      }
    }
  } catch (e) {
    // Silently fail - contact info reveal is optional
    console.log('[GreatHire Extension] Could not reveal contact info (this is normal on search pages)');
  }
}

// Extract emails from page content
function extractEmailsFromPage() {
  const emails = [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  try {
    // Check entire page text
    const textContent = document.body.innerText;
    const matches = textContent.match(emailRegex);
    
    if (matches) {
      matches.forEach(email => {
        const cleanEmail = email.toLowerCase();
        if (!cleanEmail.includes('linkedin.com') && 
            !cleanEmail.includes('example.com') &&
            !cleanEmail.includes('noreply') &&
            !cleanEmail.includes('no-reply')) {
          emails.push(cleanEmail);
        }
      });
    }
    
    // Check contact info sections specifically
    const contactSelectors = [
      '[data-section="contactInfo"]',
      '.pv-contact-info',
      '[data-test="profile-contact-section"]',
      '.pvs-list__outer-container',
      '[data-test="contact-info"]'
    ];
    
    for (const selector of contactSelectors) {
      const contactSection = document.querySelector(selector);
      if (contactSection) {
        const sectionText = contactSection.innerText;
        const contactEmails = sectionText.match(emailRegex);
        if (contactEmails) {
          contactEmails.forEach(email => {
            const cleanEmail = email.toLowerCase();
            if (!cleanEmail.includes('linkedin.com') && !cleanEmail.includes('example.com')) {
              emails.push(cleanEmail);
            }
          });
        }
      }
    }
    
    // Try to find email in links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      const email = link.href.replace('mailto:', '').split('?')[0].toLowerCase();
      if (email && !email.includes('example')) {
        emails.push(email);
      }
    });
    
  } catch (e) {
    console.error('Error extracting emails:', e);
  }
  
  return [...new Set(emails)]; // Remove duplicates
}

// Extract phone numbers from page content
function extractPhonesFromPage() {
  const phones = [];
  // Improved regex for various phone formats
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}(?:[-.\s]?\d{1,4})?/g;
  const linkedinPhoneRegex = /\+?\d{1,3}\s?\d{6,14}/g; // LinkedIn phone format
  
  try {
    const textContent = document.body.innerText;
    
    // Try LinkedIn phone format first (more accurate)
    const linkedinMatches = textContent.match(linkedinPhoneRegex);
    if (linkedinMatches) {
      linkedinMatches.forEach(phone => {
        const cleaned = phone.replace(/[^0-9+]/g, '');
        if (cleaned.length >= 10 && cleaned.length <= 15) {
          phones.push(cleaned);
        }
      });
    }
    
    // Then try general phone format
    const matches = textContent.match(phoneRegex);
    if (matches) {
      matches.forEach(phone => {
        const cleaned = phone.replace(/[^0-9+]/g, '');
        if (cleaned.length >= 10 && cleaned.length <= 15) {
          phones.push(cleaned);
        }
      });
    }
    
    // Check contact sections
    const contactSelectors = [
      '[data-section="contactInfo"]',
      '.pv-contact-info',
      '[data-test="profile-contact-section"]',
      '[data-test="contact-info"]'
    ];
    
    for (const selector of contactSelectors) {
      const contactSection = document.querySelector(selector);
      if (contactSection) {
        const sectionText = contactSection.innerText;
        
        const linkedinPhones = sectionText.match(linkedinPhoneRegex);
        if (linkedinPhones) {
          linkedinPhones.forEach(phone => {
            const cleaned = phone.replace(/[^0-9+]/g, '');
            if (cleaned.length >= 10 && cleaned.length <= 15) {
              phones.push(cleaned);
            }
          });
        }
        
        const contactPhones = sectionText.match(phoneRegex);
        if (contactPhones) {
          contactPhones.forEach(phone => {
            const cleaned = phone.replace(/[^0-9+]/g, '');
            if (cleaned.length >= 10 && cleaned.length <= 15) {
              phones.push(cleaned);
            }
          });
        }
      }
    }
    
    // Try to find phone links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      const phone = link.href.replace('tel:', '').replace(/[^0-9+]/g, '');
      if (phone.length >= 10 && phone.length <= 15) {
        phones.push(phone);
      }
    });
    
  } catch (e) {
    console.error('Error extracting phones:', e);
  }
  
  return [...new Set(phones)]; // Remove duplicates
}

// Extract Naukri profile data
function extractNaukriProfile() {
  const profiles = [];
  
  console.log('Attempting to extract Naukri profiles...');
  
  // Search results page
  const searchResults = document.querySelectorAll(
    '.srp-jobtuple-wrapper, ' +
    'article.jobTuple, ' +
    '.jobTuple, ' +
    '[data-impression-id]'
  );
  
  console.log('Found Naukri results:', searchResults.length);
  
  searchResults.forEach(result => {
    try {
      const nameEl = result.querySelector('.title, .jobTupleHeader .title, h2.jobTitle');
      const companyEl = result.querySelector('.companyInfo .company, .comp-name, .companyName');
      const locationEl = result.querySelector('.location, .locWdth, .jobLocation');
      const expEl = result.querySelector('.experience, .expwdth');
      const skillsEl = result.querySelector('.tags, .skill-tags');
      
      if (nameEl && nameEl.textContent.trim()) {
        profiles.push({
          fullName: nameEl.textContent.trim(),
          company: companyEl?.textContent.trim() || '',
          location: locationEl?.textContent.trim() || '',
          totalExperience: expEl?.textContent.trim() || '',
          skills: skillsEl?.textContent.trim().split(',').map(s => s.trim()).filter(s => s) || [],
          platform: 'naukri'
        });
        console.log('Extracted Naukri profile:', nameEl.textContent.trim());
      }
    } catch (e) {
      console.error('Error extracting Naukri profile:', e);
    }
  });
  
  return profiles;
}

// Extract Indeed profile data
function extractIndeedProfile() {
  const profiles = [];
  
  console.log('Attempting to extract Indeed profiles...');
  
  const searchResults = document.querySelectorAll(
    '.job_seen_beacon, ' +
    '.result, ' +
    'a.jcs-JobTitle, ' +
    '[data-job-id]'
  );
  
  console.log('Found Indeed results:', searchResults.length);
  
  searchResults.forEach(result => {
    try {
      const titleEl = result.querySelector('.jobTitle, h2.jobTitle a, a.jcs-JobTitle');
      const companyEl = result.querySelector('.companyName, [data-company-name]');
      const locationEl = result.querySelector('.companyLocation, [data-location]');
      const summaryEl = result.querySelector('.job-snippet, [data-job-snippet]');
      
      if (titleEl && titleEl.textContent.trim()) {
        profiles.push({
          designation: titleEl.textContent.trim(),
          company: companyEl?.textContent.trim() || '',
          location: locationEl?.textContent.trim() || '',
          bio: summaryEl?.textContent.trim() || '',
          platform: 'indeed'
        });
        console.log('Extracted Indeed profile:', titleEl.textContent.trim());
      }
    } catch (e) {
      console.error('Error extracting Indeed profile:', e);
    }
  });
  
  return profiles;
}

// Main extraction function
function extractProfiles() {
  const platform = detectPlatform();
  let profiles = [];
  
  console.log('[GreatHire] ========== EXTRACTION STARTED ==========');
  console.log('[GreatHire] Platform:', platform);
  console.log('[GreatHire] Current URL:', window.location.href);
  console.log('[GreatHire] Page title:', document.title);
  
  // Show page type for debugging
  if (platform === 'linkedin') {
    if (window.location.href.includes('/search/results/people')) {
      console.log('[GreatHire] 📌 Page type: LinkedIn People Search - extraction should work');
    } else if (window.location.href.includes('/in/')) {
      console.log('[GreatHire] 📌 Page type: LinkedIn Profile - extraction should work');
    } else if (window.location.href.includes('/jobs/')) {
      console.log('[GreatHire] ❌ Page type: LinkedIn Jobs - extraction NOT supported');
    } else if (window.location.href.includes('/feed/')) {
      console.log('[GreatHire] ❌ Page type: LinkedIn Feed - extraction NOT supported');
    } else {
      console.log('[GreatHire] ❓ Page type: LinkedIn (other) - trying anyway');
    }
  }
  
  switch (platform) {
    case 'linkedin':
      profiles = extractLinkedInProfile();
      break;
    case 'naukri':
      profiles = extractNaukriProfile();
      break;
    case 'indeed':
      profiles = extractIndeedProfile();
      break;
    default:
      console.log('[GreatHire] ❌ Platform not supported');
  }
  
  console.log('[GreatHire] ========== EXTRACTION COMPLETED ==========');
  console.log('[GreatHire] Total profiles found:', profiles.length);
  
  if (profiles.length === 0) {
    console.log('[GreatHire] ⚠️ DEBUG: No profiles extracted. Check selectors match current page structure.');
  } else {
    profiles.forEach((p, i) => {
      console.log(`[GreatHire] Profile ${i+1}:`, p.fullName, '|', p.designation);
    });
  }
  
  return profiles;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractProfiles') {
    try {
      const profiles = extractProfiles();
      console.log('Sending response with', profiles.length, 'profiles');
      sendResponse({ success: true, profiles, count: profiles.length });
    } catch (error) {
      console.error('Message handler error:', error);
      sendResponse({ success: false, error: error.message, count: 0, profiles: [] });
    }
  }
  return true;
});

// Add floating button to page
function addFloatingButton() {
  if (document.getElementById('greathire-float-btn')) {
    console.log('Floating button already exists');
    return;
  }
  
  console.log('Adding floating button...');
  
  const button = document.createElement('div');
  button.id = 'greathire-float-btn';
  button.innerHTML = `
    <div class="gh-btn-content">
      <span class="gh-icon">🎯</span>
      <span class="gh-text">Extract</span>
    </div>
  `;
  
  button.addEventListener('click', async () => {
    console.log('Button clicked, extracting profiles...');
    const profiles = extractProfiles();
    
    if (profiles.length === 0) {
      console.warn('No profiles found');
      const platform = detectPlatform();
      
      let message = 'No profiles found on this page.';
      
      if (platform === 'linkedin') {
        // Check if on jobs page
        if (window.location.href.includes('/jobs/') || window.location.href.includes('/jobs?')) {
          message = '❌ This is the Jobs page. Go to LinkedIn People Search:\n\n1. Click Search (magnifying glass)\n2. Search for a job title (e.g., "Software Engineer")\n3. Click "People" filter\n4. Then use Extract button';
        } else {
          message = '📍 Make sure you are on:\n• LinkedIn People Search Results\n• Or a candidate profile page\n\nTry searching for "Software Engineer" in LinkedIn Search and filter by People.';
        }
      }
      
      alert(message);
      return;
    }
    
    button.innerHTML = '<div class="gh-btn-content"><span class="gh-icon">⏳</span><span class="gh-text">Saving...</span></div>';
    
    // Send to background script
    chrome.runtime.sendMessage({
      action: 'saveProfiles',
      profiles: profiles
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Runtime error:', chrome.runtime.lastError);
        button.innerHTML = '<div class="gh-btn-content"><span class="gh-icon">❌</span><span class="gh-text">Error</span></div>';
      } else if (response && response.success) {
        button.innerHTML = `<div class="gh-btn-content"><span class="gh-icon">✅</span><span class="gh-text">Saved</span></div>`;
        setTimeout(() => {
          button.innerHTML = '<div class="gh-btn-content"><span class="gh-icon">🎯</span><span class="gh-text">Extract</span></div>';
        }, 2000);
      } else {
        console.error('Save failed:', response?.error);
        button.innerHTML = '<div class="gh-btn-content"><span class="gh-icon">❌</span><span class="gh-text">Failed</span></div>';
      }
      
      setTimeout(() => {
        if (button.innerHTML.includes('Failed') || button.innerHTML.includes('Error')) {
          button.innerHTML = '<div class="gh-btn-content"><span class="gh-icon">🎯</span><span class="gh-text">Extract</span></div>';
        }
      }, 3000);
    });
  });
  
  document.body.appendChild(button);
  console.log('Floating button added');
}

// Add button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFloatingButton);
} else {
  addFloatingButton();
}

// Try to add button on dynamic page changes
const observer = new MutationObserver(() => {
  if (!document.getElementById('greathire-float-btn')) {
    addFloatingButton();
  }
});

observer.observe(document.body, { childList: true, subtree: false });
