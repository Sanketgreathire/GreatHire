import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { Recruiter } from '../models/recruiter.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
for (const file of ['.env', '.env.local', '.env.production']) {
  const p = path.join(root, file);
  if (fs.existsSync(p)) dotenv.config({ path: p, override: false });
}

const normalizeInternationalPhone = (value, countryCode = '') => {
  if (value == null) return '';
  let phone = String(value).trim();
  phone = phone.replace(/[\s().-]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (!phone.startsWith('+') && /^\d+$/.test(phone)) {
    const cc = String(countryCode || '').trim().replace(/[\s().-]/g, '');
    if (cc) phone = `${cc}${phone}`;
    if (!phone.startsWith('+')) phone = `+${phone}`;
  }
  return phone;
};

const isValidInternationalPhone = (value) => /^\+[1-9]\d{5,14}$/.test(String(value || '').trim());

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DB_URL;
if (!uri) {
  console.error('No MongoDB URI found in environment');
  process.exit(1);
}

await mongoose.connect(uri);

const recruiters = await Recruiter.find({ 'phoneNumber.number': { $exists: true, $ne: null } }).lean(false);
let updated = 0;
let unresolved = 0;

for (const recruiter of recruiters) {
  const pn = recruiter.phoneNumber;
  if (!pn) continue;

  const rawNumber = typeof pn === 'string' ? pn : pn.number;
  const countryCode = typeof pn === 'object' && pn.countryCode ? pn.countryCode : '';
  const normalized = normalizeInternationalPhone(rawNumber, countryCode);

  if (normalized && normalized !== rawNumber && isValidInternationalPhone(normalized)) {
    if (typeof pn === 'string') {
      recruiter.phoneNumber = { number: normalized };
    } else {
      recruiter.phoneNumber.number = normalized;
    }
    await recruiter.save();
    updated += 1;
  } else if (!isValidInternationalPhone(rawNumber)) {
    unresolved += 1;
  }
}

await mongoose.disconnect();
console.log(JSON.stringify({ total: recruiters.length, updated, unresolved }));
