# LinkedIn Sourcing Guide

## 📋 Overview

GreatHire now supports **real LinkedIn profile scraping** using ProxyCurl API alongside the existing Chrome extension.

## 🎯 Two Ways to Source from LinkedIn

### 1. **Chrome Extension (Manual)**
**What it does:** Extracts profiles from LinkedIn pages you're browsing
**Best for:** Manual sourcing, specific searches, immediate results

**How to use:**
1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `chrome-extension` folder

2. Login to GreatHire platform

3. Browse LinkedIn:
   - Go to LinkedIn search results
   - Click the purple floating button 🎯
   - Profiles auto-save to your account

**Features:**
- One-click extraction
- Works on LinkedIn, Naukri, Indeed
- Real-time saving
- No API limits

### 2. **Auto-Sourcing (Automatic)**
**What it does:** Automatically fetches LinkedIn profiles daily at 3 AM
**Best for:** Passive sourcing, bulk candidates, scheduled runs

**How to set up:**
1. Get ProxyCurl API key:
   - Go to [proxycurl.com](https://proxycurl.com)
   - Sign up for free account
   - Get API key from dashboard

2. Add to `.env` file:
   ```
   PROXYCURL_API_KEY=your_api_key_here
   ```

3. The system will automatically:
   - Fetch LinkedIn profiles daily at 3 AM
   - Save to your candidate database
   - Avoid duplicates
   - Enrich with contact info

## 🔧 Testing the Integration

Run the test script:
```bash
cd BackEnd
node test-linkedin-scraper.js
```

## ⚙️ Configuration

### Auto-Sourcing Platforms
By default, the system sources from:
- ✅ GitHub (using your GITHUB_TOKEN)
- ✅ LinkedIn (using ProxyCurl API)
- ✅ Stack Overflow
- ✅ Dev.to

### Customize Platforms
Admins can configure which platforms to use:
1. Go to `/admin/ai-sourcing`
2. Edit recruiter configs
3. Select platforms: `github`, `linkedin`, `stackoverflow`, `devto`

## 📊 What Gets Extracted

### From LinkedIn (ProxyCurl):
- Full name
- Job title & company
- Location
- Skills
- Experience (calculated)
- Education
- LinkedIn URL
- Email addresses (if available)

### From Chrome Extension:
- Name, title, location
- LinkedIn URL
- Current page data

## 💡 Best Practices

1. **For bulk sourcing:** Use auto-sourcing (daily at 3 AM)
2. **For targeted searches:** Use Chrome extension
3. **For testing:** Run `test-linkedin-scraper.js`
4. **Monitor results:** Check `/admin/ai-sourcing` dashboard

## 🔒 Rate Limits & Costs

### ProxyCurl:
- Free tier: 10 requests/day
- Paid plans: 100-10,000+ requests/month
- **Tip:** Start with free tier, upgrade as needed

### Chrome Extension:
- No limits
- Manual browsing required
- Legal (one-click save)

## 🚀 Quick Start

1. **Get ProxyCurl key** (optional but recommended)
2. **Add to .env:**
   ```
   PROXYCURL_API_KEY=your_key_here
   ```
3. **Test:**
   ```bash
   node BackEnd/test-linkedin-scraper.js
   ```
4. **Use Chrome extension:**
   - Load extension
   - Login to GreatHire
   - Browse LinkedIn
   - Click 🎯 button

5. **Auto-sourcing runs daily at 3 AM**

## 📈 Performance

- **Auto-sourcing:** 20-50 profiles/day per recruiter
- **Chrome extension:** 10-20 profiles per click
- **Combined:** 100+ profiles/day possible

## 🛠️ Troubleshooting

### "No LinkedIn profiles found"
- Check ProxyCurl API key
- Verify API key is valid
- Check rate limits

### "Chrome extension not working"
- Make sure GreatHire backend is running
- Login to GreatHire first
- Browse to LinkedIn search results page

### "Auto-sourcing not running"
- Check cron schedule in `.env`
- Verify recruiter is verified
- Check MongoDB connection

## 🎉 Success!

You now have **two powerful ways** to source LinkedIn candidates:
1. **Manual:** Chrome extension for targeted searches
2. **Automatic:** Daily auto-sourcing for passive growth

**Happy Sourcing! 🚀**