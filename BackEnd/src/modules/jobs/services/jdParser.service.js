import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

const SKILL_PATTERNS = [
  /\b(javascript|typescript|react|vue|angular|node\.js|python|java|c\+\+|c#|sql|mongodb|postgresql|redis|docker|kubernetes|aws|azure|gcp|git|agile|scrum|rest|api|html|css|bootstrap|tailwind|jquery|webpack|eslint|jest|cypress|selenium|testing|automation|devops|microservices|graphql|elasticsearch|firebase|supabage)\b/gi
];

const DESIGNATION_PATTERNS = [
  /\b(software engineer|senior software engineer|lead software engineer|principal engineer|staff engineer|architect|solutions architect|technical architect|cloud architect|devops architect|security architect|data architect|full stack engineer|backend engineer|frontend engineer|mobile engineer|ios engineer|android engineer|web engineer|ui engineer|ux engineer|test engineer|quality engineer|automation engineer|performance engineer|security engineer|devops engineer|site reliability engineer|infrastructure engineer|platform engineer|cloud engineer|backend developer|frontend developer|full stack developer|web developer|mobile developer|software developer|programmer|coder|software consultant|technology consultant|it consultant|systems analyst|business analyst|data analyst|business intelligence analyst|data scientist|machine learning engineer|ai engineer|deep learning engineer|nlp engineer|computer vision engineer|research scientist|research engineer|algorithm engineer|data engineer|big data engineer|data warehouse engineer|etl engineer|analytics engineer|reporting engineer|dashboard engineer|visualization engineer|database administrator|database engineer|dba|mysql admin|postgresql admin|mongodb admin|redis admin|elasticsearch admin|search engineer|information retrieval engineer|search architect|search developer|full stack search engineer|search optimization engineer|seo specialist|sem specialist|digital marketer|marketing manager|product manager|program manager|project manager|scrum master|agile coach|release manager|engineering manager|team lead|tech lead|lead developer|senior developer|junior developer|intern|trainee|apprentice|associate|assistant|coordinator|specialist|expert|guru|ninja|rockstar|superstar|champion|advocate|evangelist|ambassador|influencer|thought leader|visionary|pioneer|innovator|creator|maker|designer|architect|engineer|developer|programmer|analyst|consultant|manager|director|vp|vice president|c level|ceo|cto|cfo|coo|cmo|cpo|cio|cso|cdo|cro|ciso|chief technology officer|chief executive officer|chief financial officer|chief operating officer|chief marketing officer|chief product officer|chief information officer|chief security officer|chief data officer|chief revenue officer|chief information security officer|chief digital officer|chief innovation officer|chief transformation officer|chief growth officer|chief people officer|chief happiness officer|chief sustainability officer|chief diversity officer|chief inclusion officer|chief belonging officer|chief ethics officer|chief compliance officer|chief risk officer|chief audit officer|chief quality officer|chief legal officer|chief administrative officer|chief strategy officer)\b/gi
];

const EXPERIENCE_PATTERNS = [
  /(\d+)\+?\s*(?:years?|yrs?)?\s*(?:of\s*)?(?:experience|exp)/gi,
  /(?:experience|exp)\s*(\d+)\+?\s*(?:years?|yrs?)/gi,
  /(\d+)\s*[-–]\s*(\d+)\s*(?:years?|yrs?)?\s*(?:of\s*)?(?:experience|exp)/gi
];

const LOCATION_PATTERNS = [
  /\b(?:remote|wfh|work from home|hybrid|onsite|office|in-office|in person|on site|on-site|telecommute|telework|virtual|distributed|location independent|anywhere)\b/gi,
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)\b/g,
  /\b(usa|united states|uk|united kingdom|canada|australia|germany|france|india|singapore|japan|china|brazil|mexico|spain|italy|netherlands|sweden|denmark|norway|finland|ireland|belgium|austria|switzerland|poland|czech republic|hungary|romania|bulgaria|greece|portugal|turkey|israel|uae|saudi arabia|south africa|egypt|nigeria|kenya|ghana|tanzania|uganda|zimbabwe|zambia|botswana|namibia|mozambique|angola|senegal|mali|burkina faso|niger|chad|sudan|ethiopia|somalia|eritrea|djibouti|madagascar|mauritius|seychelles|comoros|cape verde|guinea|guinea-bissau|sierra leone|liberia|ivory coast|togo|benin|cameroon|central african republic|congo|democratic republic of congo|rwanda|burundi|tanzania|malawi|zambia|zimbabwe|botswana|namibia|south africa|lesotho|eswatini|mozambique|madagascar|mauritius|seychelles|comoros|somalia|djibouti|eritrea|ethiopia|kenya|uganda|tanzania|rwanda|burundi|south sudan|sudan|chad|niger|nigeria|cameroon|central african republic|equatorial guinea|gabon|republic of congo|democratic republic of congo|angola|namibia|botswana|south africa|zimbabwe|mozambique|madagascar|mauritius|seychelles|comoros|somalia|djibouti|eritrea|ethiopia|kenya|uganda|tanzania|rwanda|burundi|south sudan|sudan|chad|niger|nigeria|cameroon|central african republic|equatorial guinea|gabon|republic of congo|democratic republic of congo|angola|namibia|botswana|south africa|zimbabwe|mozambique|madagascar|mauritius|seychelles|comoros|somalia|djibouti|eritrea|ethiopia|kenya|uganda|tanzania|rwanda|burundi|south sudan|sudan|chad|niger|nigeria|cameroon|central african republic|equatorial guinea|gabon|republic of congo|democratic republic of congo|angola|namibia|botswana|south africa|zimbabwe|mozambique|madagascar|mauritius|seychelles|comoros)\b/gi
];

const SENIORITY_PATTERNS = [
  /\b(junior|jr|entry level|intern|trainee|apprentice|associate|assistant|coordinator|specialist)\b/gi,
  /\b(senior|sr|lead|principal|staff|head|chief|director|manager|vp|vice president)\b/gi,
  /\b(mid|mid-level|intermediate|experienced|professional)\b/gi
];

export async function parseJobDescription(jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string') {
    throw new Error('Job description must be a non-empty string');
  }

  const text = jobDescription.trim();
  const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);

  let skills = [];
  let designation = '';
  let experience = '';
  let location = '';
  let seniority = '';

  if (aiAvailable) {
    try {
      const { embedText } = await import("../../../sourcing/ai/aiServiceClient.js");
      const embedding = await embedText(text);
      
      const extractedData = await extractWithAI(text);
      skills = extractedData.skills || [];
      designation = extractedData.designation || '';
      experience = extractedData.experience || '';
      location = extractedData.location || '';
      seniority = extractedData.seniority || '';
    } catch (error) {
      console.warn('AI extraction failed, falling back to regex:', error.message);
    }
  }

  if (skills.length === 0) {
    let allSkills = new Set();
    SKILL_PATTERNS.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(skill => allSkills.add(skill.toLowerCase()));
      }
    });
    skills = Array.from(allSkills);
  }

  if (!designation) {
    const designationMatch = text.match(DESIGNATION_PATTERNS[0]);
    if (designationMatch) {
      designation = designationMatch[0];
    }
  }

  if (!experience) {
    const expMatch = text.match(EXPERIENCE_PATTERNS[0]);
    if (expMatch) {
      experience = expMatch[0];
    }
    const rangeMatch = text.match(EXPERIENCE_PATTERNS[2]);
    if (rangeMatch) {
      experience = `${rangeMatch[1]}-${rangeMatch[2]} years`;
    }
  }

  if (!location) {
    const remoteMatch = text.match(LOCATION_PATTERNS[0]);
    if (remoteMatch) {
      location = remoteMatch[0];
    }
    
    const cityMatch = text.match(LOCATION_PATTERNS[1]);
    if (cityMatch) {
      location = cityMatch[0];
    }
  }

  if (!seniority) {
    const juniorMatch = text.match(SENIORITY_PATTERNS[0]);
    const seniorMatch = text.match(SENIORITY_PATTERNS[1]);
    const midMatch = text.match(SENIORITY_PATTERNS[2]);
    
    if (seniorMatch && seniorMatch[0]) {
      seniority = seniorMatch[0];
    } else if (midMatch && midMatch[0]) {
      seniority = midMatch[0];
    } else if (juniorMatch && juniorMatch[0]) {
      seniority = juniorMatch[0];
    }
  }

  return {
    skills: skills.length > 0 ? skills : [],
    designation: designation || '',
    experience: experience || '',
    location: location || '',
    seniority: seniority || '',
    rawText: text,
    parsedWith: aiAvailable ? 'ai' : 'regex'
  };
}

async function extractWithAI(text) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const response = await axios.default.post(
      `${AI_BASE_URL}/extract/jd`,
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );
    
    return response.data;
  } catch (error) {
    console.warn('AI extraction service error:', error.message);
    return {};
  }
}
