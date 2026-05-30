# Enhanced Contact Extraction & Profile Overview

## Overview

The auto-sourcing system now includes advanced contact extraction and profile overview generation capabilities. This enhancement automatically extracts phone numbers, emails, and other contact information from candidate profiles and generates comprehensive profile summaries.

## Features

### 1. Phone Number Extraction

Automatically extracts phone numbers from multiple sources:

- **GitHub profiles**: Bio, README files, profile repositories
- **LinkedIn profiles**: Contact sections, summaries
- **Resume text**: Any text content in resumes
- **Public profiles**: Dev.to, Stack Overflow, etc.

#### Supported Formats

- **Indian**: `+91-XXXXX-XXXXX`, `9876543210`, `+91 98765 43210`
- **US**: `(555) 123-4567`, `555-123-4567`
- **UK**: `+44 7911 123456`
- **International**: `+XX-XXX-XXX-XXXX`

#### Phone Normalization

All extracted phone numbers are automatically normalized:
- Adds country codes if missing
- Removes formatting characters
- Validates length (10-15 digits)
- Removes duplicates

### 2. Email Extraction

Enhanced email extraction with filtering:

- Extracts emails from bio, README, and profile text
- Filters out fake emails (`noreply@`, `example.com`, `test.com`)
- Removes duplicates
- Validates email format

### 3. Profile Overview Generation

Automatically generates comprehensive profile summaries including:

- **Basic Information**: Name, location, current role
- **Professional Details**: Company, designation, experience
- **Technical Skills**: Top 5 skills highlighted
- **Education**: Degree and institution
- **GitHub Activity**: Repository count, followers, notable projects
- **Contact Availability**: Indicates if contact info is available

#### Example Overview

```
Rahul Sharma is a developer based in Bangalore, India. Currently working as Senior Full Stack Developer at Tech Solutions Pvt Ltd. Has 5+ years of professional experience. Skilled in JavaScript, React, Node.js, MongoDB, AWS. Holds B.Tech in Computer Science from IIT Delhi. Has 50 public repositories with 200 followers. Notable projects: awesome-project (150⭐), web-app (80⭐). Contact information available.
```

### 4. Automatic Designation Inference

The system intelligently infers job designations based on:

- Repository names and descriptions
- Programming languages used
- Project types and technologies

**Detected Roles**:
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Mobile Developer
- DevOps Engineer
- Machine Learning Engineer
- Data Engineer

### 5. Experience Estimation

Automatically estimates years of experience based on:

- GitHub account age
- Oldest repository date
- Activity patterns
- Adds 1-2 years (assuming coding before GitHub)

## Usage

### Automatic Extraction (Default)

The contact extraction runs automatically during auto-sourcing:

```bash
# Runs daily at 3:00 AM
npm run dev

# Manual trigger
npm run test:auto-sourcing
```

### Manual Profile Enrichment

You can also manually enrich existing profiles:

```javascript
import { ContactExtractorService } from './BackEnd/sourcing/services/contactExtractorService.js';

// Enrich a profile
const profile = {
  fullName: 'John Doe',
  bio: 'Software Engineer | Email: john@email.com | Phone: +91-9876543210',
  skills: ['JavaScript', 'React', 'Node.js'],
};

const enrichedProfile = ContactExtractorService.enrichProfile(profile);
console.log(enrichedProfile);
// Output includes extracted emails, phones, and generated overview
```

### Extract Contact Info from Text

```javascript
// Extract emails
const emails = ContactExtractorService.extractEmails(text);

// Extract phone numbers
const phones = ContactExtractorService.extractPhones(text);

// Extract social links
const socialLinks = ContactExtractorService.extractSocialLinks(text);

// Extract location
const location = ContactExtractorService.extractLocation(text);
```

## Testing

Run the test suite to verify functionality:

```bash
node test-contact-extractor.js
```

**Test Coverage**:
- ✅ Email extraction and filtering
- ✅ Phone number extraction (multiple formats)
- ✅ Phone normalization with country codes
- ✅ Social links extraction (GitHub, LinkedIn, Twitter, Portfolio)
- ✅ Location extraction
- ✅ Profile overview generation
- ✅ Profile enrichment

## Database Schema

The `SourcingCandidate` model now stores:

```javascript
{
  fullName: String,
  emails: [String],        // ✨ Enhanced extraction
  phones: [String],        // ✨ NEW: Phone numbers
  githubUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  location: String,
  currentCompany: String,
  designation: String,     // ✨ Auto-inferred
  totalExperience: Number, // ✨ Auto-estimated
  skills: [String],
  summary: String,         // ✨ Auto-generated overview
  education: [Object],
  // ... other fields
}
```

## API Endpoints

### Get Candidate with Full Profile

```http
GET /api/v1/sourcing/candidates/:id
```

**Response**:
```json
{
  "success": true,
  "candidate": {
    "fullName": "Rahul Sharma",
    "emails": ["rahul@email.com"],
    "phones": ["+919876543210"],
    "designation": "Senior Full Stack Developer",
    "totalExperience": 5,
    "summary": "Rahul Sharma is a developer based in Bangalore...",
    "skills": ["JavaScript", "React", "Node.js"],
    // ... other fields
  }
}
```

## Configuration

### GitHub Token (Recommended)

Add to `.env` for better rate limits:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

**Benefits**:
- 5000 requests/hour (vs 60 without token)
- Access to private profile emails
- Faster README fetching

### Auto-Sourcing Config

Configure per recruiter:

```javascript
{
  enabled: true,
  criteria: {
    languages: ['JavaScript', 'Python', 'Java'],
    locations: ['India', 'USA'],
    minRepos: 1,
    minFollowers: 0
  }
}
```

## Best Practices

### 1. Privacy Compliance

- Only extract publicly available information
- Respect robots.txt and rate limits
- Store contact info securely
- Provide opt-out mechanisms

### 2. Data Quality

- Validate extracted phone numbers
- Verify email deliverability
- Cross-reference multiple sources
- Update profiles periodically

### 3. Performance

- Use rate limiting for API calls
- Cache frequently accessed profiles
- Batch process large imports
- Monitor extraction success rates

## Troubleshooting

### No Phone Numbers Extracted

**Possible Causes**:
- Profile doesn't contain phone numbers
- Phone numbers in unsupported format
- Text encoding issues

**Solution**:
- Check source text manually
- Add custom regex patterns
- Verify text encoding (UTF-8)

### Incorrect Designation

**Possible Causes**:
- Limited repository information
- Generic project names
- Multiple technology stacks

**Solution**:
- Manual review and correction
- Improve inference logic
- Add more keyword patterns

### Missing Contact Info

**Possible Causes**:
- Private profile settings
- No README in profile repo
- Rate limit exceeded

**Solution**:
- Add GitHub token for better access
- Check rate limit status
- Retry after cooldown period

## Future Enhancements

- [ ] Extract work history from GitHub contributions
- [ ] Detect certifications from profile
- [ ] Extract salary expectations from bio
- [ ] Multi-language support for profiles
- [ ] AI-powered profile summarization
- [ ] Sentiment analysis of bio/README
- [ ] Skill level assessment from projects
- [ ] Automated profile scoring

## Support

For issues or questions:
1. Check logs: `npm run dev` (backend console)
2. Run tests: `node test-contact-extractor.js`
3. Review documentation: `AUTO_SOURCING_FEATURE.md`
4. Open GitHub issue with details

## License

Part of the GreatHire Auto-Sourcing System
