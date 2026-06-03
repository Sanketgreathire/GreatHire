import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

const SKILL_PATTERNS = [
  /\b(javascript|typescript|react|vue|angular|node\.js|python|java|c\+\+|c#|sql|mongodb|postgresql|redis|docker|kubernetes|aws|azure|gcp|git|agile|scrum|rest|api|html|css|bootstrap|tailwind|jquery|webpack|eslint|jest|cypress|selenium|testing|automation|devops|microservices|graphql|elasticsearch|firebase|supabase|express|django|flask|spring|rails|laravel|symfony|next\.js|nuxt|gatsby|svelte|solid\.js|alpine\.js|blazor|flutter|react native|swift|kotlin|ios|android|mobile|web|full stack|frontend|backend|frontend|backend|database|nosql|mysql|oracle|mariadb|sqlite|cassandra|dynamodb|firestore|bigtable|spanner|cockroachdb|neo4j|arangodb|influxdb|prometheus|grafana|kibana|logstash|filebeat|metricbeat|heartbeat|apm|new relic|datadog|splunk|sumo logic|papertrail|loggly|sentry|bugsnag|rollbar|honeybadger|raygun|overops|dynatrace|appdynamics|new relic|datadog|splunk|sumo logic|papertrail|loggly|sentry|bugsnag|rollbar|honeybadger|raygun|overops|dynatrace|appdynamics)\b/gi
];

const DESIGNATION_PATTERNS = [
  /\b(software engineer|senior software engineer|lead software engineer|principal engineer|staff engineer|architect|solutions architect|technical architect|cloud architect|devops architect|security architect|data architect|full stack engineer|backend engineer|frontend engineer|mobile engineer|ios engineer|android engineer|web engineer|ui engineer|ux engineer|test engineer|quality engineer|automation engineer|performance engineer|security engineer|devops engineer|site reliability engineer|infrastructure engineer|platform engineer|cloud engineer|backend developer|frontend developer|full stack developer|web developer|mobile developer|software developer|programmer|coder|software consultant|technology consultant|it consultant|systems analyst|business analyst|data analyst|business intelligence analyst|data scientist|machine learning engineer|ai engineer|deep learning engineer|nlp engineer|computer vision engineer|research scientist|research engineer|algorithm engineer|data engineer|big data engineer|data warehouse engineer|etl engineer|analytics engineer|reporting engineer|dashboard engineer|visualization engineer|database administrator|database engineer|dba|mysql admin|postgresql admin|mongodb admin|redis admin|elasticsearch admin|search engineer|information retrieval engineer|search architect|search developer|full stack search engineer|search optimization engineer|seo specialist|sem specialist|digital marketer|marketing manager|product manager|program manager|project manager|scrum master|agile coach|release manager|engineering manager|team lead|tech lead|lead developer|senior developer|junior developer|intern|trainee|apprentice|associate|assistant|coordinator|specialist|expert|guru|ninja|rockstar|superstar|champion|advocate|evangelist|ambassador|influencer|thought leader|visionary|pioneer|innovator|creator|maker|designer|architect|engineer|developer|programmer|analyst|consultant|manager|director|vp|vice president|c level|ceo|cto|cfo|coo|cmo|cpo|cio|cso|cdo|cro|ciso|chief technology officer|chief executive officer|chief financial officer|chief operating officer|chief marketing officer|chief product officer|chief information officer|chief security officer|chief data officer|chief revenue officer|chief information security officer|chief digital officer|chief innovation officer|chief transformation officer|chief growth officer|chief people officer|chief happiness officer|chief sustainability officer|chief diversity officer|chief inclusion officer|chief belonging officer|chief ethics officer|chief compliance officer|chief risk officer|chief audit officer|chief quality officer|chief legal officer|chief administrative officer|chief strategy officer|chief operating officer|chief revenue officer|chief commercial officer|chief business officer|chief customer officer|chief experience officer|chief design officer|chief creative officer|chief brand officer|chief communications officer|chief content officer|chief marketing officer|chief product officer|chief technology officer|chief information officer|chief security officer|chief data officer|chief analytics officer|chief insights officer|chief research officer|chief development officer|chief engineering officer|chief innovation officer|chief transformation officer|chief digital officer|chief cloud officer|chief ai officer|chief machine learning officer|chief data science officer|chief platform officer|chief infrastructure officer|chief devops officer|chief reliability officer|chief security officer|chief privacy officer|chief compliance officer|chief risk officer|chief audit officer|chief quality officer|chief legal officer|chief administrative officer|chief strategy officer)\b/gi
];

const EXPERIENCE_PATTERNS = [
  /(\d+)\+?\s*(?:years?|yrs?)?\s*(?:of\s*)?(?:experience|exp)/gi,
  /(?:experience|exp)\s*(\d+)\+?\s*(?:years?|yrs?)/gi,
  /(\d+)\s*[-–]\s*(\d+)\s*(?:years?|yrs?)?\s*(?:of\s*)?(?:experience|exp)/gi,
  /\b(entry level|junior|jr|associate|intern|trainee|apprentice|mid level|mid|intermediate|senior|sr|lead|principal|staff|head|chief|director|manager|vp|vice president)\b/gi
];

const LOCATION_PATTERNS = [
  /\b(?:remote|wfh|work from home|hybrid|onsite|office|in-office|in person|on site|on-site|telecommute|telework|virtual|distributed|location independent|anywhere)\b/gi,
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)\b/g,
  /\b(usa|united states|uk|united kingdom|canada|australia|germany|france|india|singapore|japan|china|brazil|mexico|spain|italy|netherlands|sweden|denmark|norway|finland|ireland|belgium|austria|switzerland|poland|czech republic|hungary|romania|bulgaria|greece|portugal|turkey|israel|uae|saudi arabia|south africa|egypt|nigeria|kenya|ghana|tanzania|uganda|zimbabwe|zambia|botswana|namibia|mozambique|angola|senegal|mali|burkina faso|niger|chad|sudan|ethiopia|somalia|eritrea|djibouti|madagascar|mauritius|seychelles|comoros|cape verde|guinea|guinea-bissau|sierra leone|liberia|ivory coast|togo|benin|cameroon|central african republic|congo|democratic republic of congo|rwanda|burundi|tanzania|malawi|zambia|zimbabwe|botswana|namibia|south africa|lesotho|eswatini|mozambique|madagascar|mauritius|seychelles|comoros|somalia|djibouti|eritrea|ethiopia|kenya|uganda|tanzania|rwanda|burundi|south sudan|sudan|chad|niger|nigeria|cameroon|central african republic|equatorial guinea|gabon|republic of congo|democratic republic of congo|angola|namibia|botswana|south africa|zimbabwe|mozambique|madagascar|mauritius|seychelles|comoros|somalia|djibouti|eritrea|ethiopia|kenya|uganda|tanzania|rwanda|burundi|south sudan|sudan|chad|niger|nigeria|cameroon|central african republic|equatorial guinea|gabon|republic of congo|democratic republic of congo|angola|namibia|botswana|south africa|zimbabwe|mozambique|madagascar|mauritius|seychelles|comoros)\b/gi
];

const INDUSTRY_PATTERNS = [
  /\b(technology|software|it|information technology|fintech|healthcare|finance|banking|insurance|retail|ecommerce|education|e-learning|edtech|media|entertainment|gaming|sports|travel|hospitality|transportation|logistics|automotive|manufacturing|energy|utilities|telecommunications|real estate|construction|agriculture|food|beverage|consumer goods|fashion|beauty|pharmaceutical|biotechnology|aerospace|defense|government|non profit|consulting|legal|accounting|human resources|marketing|advertising|public relations|research|development|startup|enterprise|small business|smb|sme|corporation|multinational|global|local|regional|national|international)\b/gi
];

const SENIORITY_PATTERNS = [
  /\b(junior|jr|entry level|intern|trainee|apprentice|associate|assistant|coordinator|specialist)\b/gi,
  /\b(senior|sr|lead|principal|staff|head|chief|director|manager|vp|vice president)\b/gi,
  /\b(mid|mid-level|intermediate|experienced|professional)\b/gi
];

export async function parseQueryIntent(message, recruiterMemory = {}) {
  const text = message.toLowerCase().trim();
  const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);

  let intent = {
    type: 'search',
    confidence: 0.5,
    skills: [],
    designation: '',
    location: '',
    experience: '',
    industry: '',
    seniority: '',
    rawQuery: text
  };

  if (aiAvailable) {
    try {
      const aiIntent = await parseWithAI(text, recruiterMemory);
      if (aiIntent && aiIntent.confidence > 0.6) {
        intent = { ...intent, ...aiIntent };
      }
    } catch (error) {
      console.warn('AI intent parsing failed, falling back to regex:', error.message);
    }
  }

  if (intent.skills.length === 0) {
    const skills = extractSkills(text);
    if (skills.length > 0) {
      intent.skills = skills;
    }
  }

  if (!intent.designation) {
    intent.designation = extractDesignation(text);
  }

  if (!intent.experience) {
    intent.experience = extractExperience(text);
  }

  if (!intent.location) {
    intent.location = extractLocation(text);
  }

  if (!intent.industry) {
    intent.industry = extractIndustry(text);
  }

  if (!intent.seniority) {
    intent.seniority = extractSeniority(text);
  }

  intent.type = determineQueryType(text, intent);
  intent.confidence = calculateIntentConfidence(intent, text);

  return intent;
}

function extractSkills(text) {
  const skills = new Set();
  
  SKILL_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(skill => skills.add(skill.toLowerCase()));
    }
  });

  return Array.from(skills);
}

function extractDesignation(text) {
  const matches = text.match(DESIGNATION_PATTERNS[0]);
  return matches ? matches[0] : '';
}

function extractExperience(text) {
  const expMatch = text.match(EXPERIENCE_PATTERNS[0]);
  if (expMatch) return expMatch[0];
  
  const rangeMatch = text.match(EXPERIENCE_PATTERNS[2]);
  if (rangeMatch) return `${rangeMatch[1]}-${rangeMatch[2]} years`;
  
  const seniorityMatch = text.match(EXPERIENCE_PATTERNS[3]);
  if (seniorityMatch) return seniorityMatch[0];
  
  return '';
}

function extractLocation(text) {
  const remoteMatch = text.match(LOCATION_PATTERNS[0]);
  if (remoteMatch) return remoteMatch[0];
  
  const cityMatch = text.match(LOCATION_PATTERNS[1]);
  if (cityMatch) return cityMatch[0];
  
  const countryMatch = text.match(LOCATION_PATTERNS[2]);
  if (countryMatch) return countryMatch[0];
  
  return '';
}

function extractIndustry(text) {
  const matches = text.match(INDUSTRY_PATTERNS[0]);
  return matches ? matches[0] : '';
}

function extractSeniority(text) {
  const seniorMatch = text.match(SENIORITY_PATTERNS[1]);
  if (seniorMatch) return seniorMatch[0];
  
  const midMatch = text.match(SENIORITY_PATTERNS[2]);
  if (midMatch) return midMatch[0];
  
  const juniorMatch = text.match(SENIORITY_PATTERNS[0]);
  if (juniorMatch) return juniorMatch[0];
  
  return '';
}

function determineQueryType(text, intent) {
  if (text.includes('find') || text.includes('search') || text.includes('look for')) {
    return 'search';
  }
  
  if (text.includes('recommend') || text.includes('suggest') || text.includes('show me')) {
    return 'recommendation';
  }
  
  if (text.includes('similar to') || text.includes('like')) {
    return 'similarity';
  }
  
  if (text.includes('hidden gem') || text.includes('underrated') || text.includes('overlooked')) {
    return 'discovery';
  }
  
  if (intent.skills.length > 0 || intent.designation) {
    return 'search';
  }
  
  return 'general';
}

function calculateIntentConfidence(intent, text) {
  let confidence = 0.3;
  
  if (intent.skills.length > 0) confidence += 0.2;
  if (intent.designation) confidence += 0.15;
  if (intent.experience) confidence += 0.1;
  if (intent.location) confidence += 0.1;
  if (intent.industry) confidence += 0.05;
  if (intent.seniority) confidence += 0.1;
  
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 3) confidence += 0.1;
  if (wordCount >= 6) confidence += 0.1;
  
  return Math.min(1, confidence);
}

async function parseWithAI(text, recruiterMemory) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const response = await axios.default.post(
      `${AI_BASE_URL}/extract/intent`,
      { 
        text,
        context: {
          previousSearches: recruiterMemory.searchHistory?.slice(-5) || [],
          preferredSkills: recruiterMemory.preferences?.skills || [],
          preferredIndustries: recruiterMemory.preferences?.industries || []
        }
      },
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
    console.warn('AI intent parsing service error:', error.message);
    return null;
  }
}
