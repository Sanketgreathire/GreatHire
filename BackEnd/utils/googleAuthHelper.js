import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanStr = (s, defaultVal = "") => {
  if (!s) return defaultVal;
  return s.replace(/^["']|["']$/g, "").trim();
};

/**
 * Resolves Google Service Account credentials safely from:
 * 1. Base64-encoded environment variable (GOOGLE_SERVICE_ACCOUNT_BASE64 or GOOGLE_SERVICE_ACCOUNT_HASH)
 * 2. Encoded or standard JSON key file (config/google-service-account.json or custom path)
 * 3. Split environment variables (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY)
 * 
 * @returns {Object} Parsed service account credentials object
 */
export const getServiceAccountCredentials = () => {
  // 1. Check Base64 / Hash environment variables (highest security, zero files needed)
  const base64Env = cleanStr(
    process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 ||
    process.env.GOOGLE_SERVICE_ACCOUNT_HASH ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64
  );

  if (base64Env) {
    try {
      const jsonStr = Buffer.from(base64Env, "base64").toString("utf8");
      const creds = JSON.parse(jsonStr);
      if (creds.client_email && (creds.private_key || creds.private_key_id)) {
        return creds;
      }
    } catch (err) {
      console.error("[GoogleAuthHelper] Failed to decode GOOGLE_SERVICE_ACCOUNT_BASE64:", err.message);
    }
  }

  // 2. Check JSON file (support both encoded wrapper and standard format)
  const keyPathEnv = cleanStr(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH);
  const candidatePaths = [
    keyPathEnv ? path.resolve(keyPathEnv) : null,
    keyPathEnv ? path.resolve(__dirname, "..", keyPathEnv) : null,
    path.resolve(__dirname, "../config/google-service-account.json"),
    path.resolve(process.cwd(), "config/google-service-account.json"),
    path.resolve(__dirname, "../config/credentials/great-hire-ea29d88103ac.json"),
  ].filter(Boolean);

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf8").trim();
        let parsed = null;
        try {
          parsed = JSON.parse(raw);
        } catch (_) {
          // May be a raw base64 string in file
          const decoded = Buffer.from(raw, "base64").toString("utf8");
          parsed = JSON.parse(decoded);
        }

        if (parsed) {
          // If wrapped as encoded payload
          if (parsed.encoded || parsed.data || parsed.encoded_credentials) {
            const encodedPayload = parsed.encoded || parsed.data || parsed.encoded_credentials;
            const decodedJson = Buffer.from(encodedPayload, "base64").toString("utf8");
            return JSON.parse(decodedJson);
          }
          // Standard service account JSON
          if (parsed.client_email && parsed.private_key) {
            return parsed;
          }
        }
      } catch (fileErr) {
        console.warn(`[GoogleAuthHelper] Could not read/parse key file at ${p}:`, fileErr.message);
      }
    }
  }

  // 3. Check individual credentials environment variables
  const clientEmail = cleanStr(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/^["']|["']$/g, "")
    : null;

  if (clientEmail && privateKey) {
    return {
      client_email: clientEmail,
      private_key: privateKey,
    };
  }

  return null;
};

/**
 * Creates an authorized GoogleAuth instance using the safely loaded credentials.
 * 
 * @param {string[]} scopes Array of OAuth2 scopes
 * @returns {google.auth.GoogleAuth}
 */
export const getGoogleAuth = (scopes = []) => {
  const credentials = getServiceAccountCredentials();

  if (!credentials) {
    throw new Error(
      "No valid Google Service Account credentials found. Please set GOOGLE_SERVICE_ACCOUNT_BASE64 in .env"
    );
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes,
  });
};
