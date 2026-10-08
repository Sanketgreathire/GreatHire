// Country calling code → allowed national (significant) number lengths.
// Longest-prefix match decides the country when several codes could fit.
// Codes not listed here fall back to a loose 10-15 digit check so that
// numbers from other countries are not blocked.
const CALLING_CODE_NSN_LENGTHS = {
  "1": [10], // USA / Canada / Caribbean (NANP)
  "7": [10], // Russia / Kazakhstan
  "20": [10], // Egypt
  "27": [9], // South Africa
  "30": [10], // Greece
  "31": [9], // Netherlands
  "33": [9], // France
  "34": [9], // Spain
  "36": [9], // Hungary
  "39": [9, 10], // Italy
  "40": [9], // Romania
  "41": [9], // Switzerland
  "43": [10, 11], // Austria
  "44": [10], // United Kingdom
  "45": [8], // Denmark
  "46": [7, 8, 9], // Sweden
  "47": [8], // Norway
  "48": [9], // Poland
  "49": [10, 11], // Germany
  "51": [9], // Peru
  "52": [10], // Mexico
  "54": [10], // Argentina
  "55": [10, 11], // Brazil
  "56": [9], // Chile
  "57": [10], // Colombia
  "58": [10], // Venezuela
  "60": [9, 10], // Malaysia
  "61": [9], // Australia
  "62": [9, 10, 11], // Indonesia
  "63": [10], // Philippines
  "64": [8, 9], // New Zealand
  "65": [8], // Singapore
  "66": [9], // Thailand
  "81": [10], // Japan
  "82": [10], // South Korea
  "84": [9], // Vietnam
  "86": [11], // China
  "90": [10], // Turkey
  "91": [10], // India
  "92": [10], // Pakistan
  "93": [9], // Afghanistan
  "94": [9], // Sri Lanka
  "95": [7, 9, 10], // Myanmar
  "98": [10], // Iran
  "212": [9], // Morocco
  "213": [9], // Algeria
  "216": [8], // Tunisia
  "218": [9], // Libya
  "220": [7], // Gambia
  "233": [9], // Ghana
  "234": [10], // Nigeria
  "237": [9], // Cameroon
  "254": [9], // Kenya
  "255": [9], // Tanzania
  "260": [9], // Zambia
  "263": [9], // Zimbabwe
  "351": [9], // Portugal
  "353": [9], // Ireland
  "358": [5, 6, 7, 8, 9, 10], // Finland
  "380": [9], // Ukraine
  "381": [9], // Serbia
  "382": [8], // Montenegro
  "385": [8, 9], // Croatia
  "386": [8], // Slovenia
  "387": [8], // Bosnia and Herzegovina
  "389": [8], // North Macedonia
  "420": [9], // Czech Republic
  "421": [9], // Slovakia
  "850": [8], // North Korea
  "855": [8, 9], // Cambodia
  "856": [8], // Laos
  "880": [10], // Bangladesh
  "886": [9, 10], // Taiwan
  "960": [7], // Maldives
  "961": [7, 8], // Lebanon
  "962": [9], // Jordan
  "963": [9], // Syria
  "964": [10], // Iraq
  "965": [8], // Kuwait
  "966": [9], // Saudi Arabia
  "968": [8], // Oman
  "970": [9], // Palestine
  "971": [9], // United Arab Emirates
  "972": [9], // Israel
  "973": [8], // Bahrain
  "974": [8], // Qatar
  "975": [8], // Bhutan
  "976": [8], // Mongolia
  "977": [10], // Nepal
  "992": [9], // Tajikistan
  "993": [8], // Turkmenistan
  "994": [9], // Azerbaijan
  "995": [9], // Georgia
  "998": [9], // Uzbekistan
};

const CODE_KEYS = Object.keys(CALLING_CODE_NSN_LENGTHS).sort(
  (a, b) => b.length - a.length
);

// ITU reserves these prefixes; they are not assignable to any country.
const UNASSIGNED_CALLING_CODES = ["991", "999"];

const normalizeInternationalPhone = (value) => {
  if (value == null) return "";

  let phone = String(value).trim();

  // Remove formatting chars
  phone = phone.replace(/[\s().-]/g, "");

  // Convert 00 prefix → +
  if (phone.startsWith("00")) {
    phone = `+${phone.slice(2)}`;
  }

  // Add + if only digits
  if (!phone.startsWith("+") && /^\d+$/.test(phone)) {
    phone = `+${phone}`;
  }

  return phone;
};

const isValidInternationalPhone = (value) => {
  const phone = normalizeInternationalPhone(value);

  return /^\+[1-9]\d{5,14}$/.test(phone);
};

const matchCallingCode = (e164) => {
  for (const code of CODE_KEYS) {
    if (e164.startsWith(`+${code}`)) {
      return { code, nsn: e164.slice(1 + code.length) };
    }
  }
  return null;
};

const validateRecruiterPhone = (value) => {
  const raw = String(value == null ? "" : value).replace(/[\s().-]/g, "");

  if (!raw) {
    return {
      valid: false,
      message: "Phone number is required",
    };
  }

  // Bare 10-digit Indian mobile (with or without trunk 0) → treat as +91.
  // Numbers entered with a leading + are never touched here, so callers who
  // intend another country (e.g. +90..., +98...) are judged by their code.
  let normalizedPhone;
  if (/^0?[6-9]\d{9}$/.test(raw)) {
    normalizedPhone = `+91${raw.replace(/^0/, "")}`;
  } else {
    normalizedPhone = normalizeInternationalPhone(value);
  }

  if (!/^\+[1-9]\d{5,14}$/.test(normalizedPhone)) {
    return {
      valid: false,
      message: "Invalid international phone number",
    };
  }

  const matched = matchCallingCode(normalizedPhone);

  if (UNASSIGNED_CALLING_CODES.some((c) => normalizedPhone.startsWith(`+${c}`))) {
    return {
      valid: false,
      message: "Invalid phone number for this country code",
    };
  }

  if (!matched) {
    // Unknown calling code → accept only plausible lengths (10-15 digits).
    const digits = normalizedPhone.slice(1);
    if (digits.length < 10) {
      return {
        valid: false,
        message: "Invalid phone number for this country code",
      };
    }
    return { valid: true, phone: normalizedPhone };
  }

  const { code, nsn } = matched;

  if (!nsn || nsn.startsWith("0")) {
    return {
      valid: false,
      message: "Invalid phone number for this country code",
    };
  }

  const allowedLengths = CALLING_CODE_NSN_LENGTHS[code];
  if (!allowedLengths.includes(nsn.length)) {
    return {
      valid: false,
      message: "Invalid phone number for this country code",
    };
  }

  // Indian numbers collected here are mobiles (see userValidator message).
  if (code === "91" && !/^[6-9]\d{9}$/.test(nsn)) {
    return {
      valid: false,
      message: "Enter a valid Indian mobile number (e.g. +91 9876543210)",
    };
  }

  return {
    valid: true,
    phone: normalizedPhone,
  };
};

export {
  normalizeInternationalPhone,
  isValidInternationalPhone,
  validateRecruiterPhone,
};

export default validateRecruiterPhone;
