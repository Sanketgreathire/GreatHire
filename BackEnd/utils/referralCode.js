import { User } from "../models/user.model.js";

function generateReferralCode(name) {
  const base = name.replace(/\s+/g, "").toUpperCase().slice(0, 5);
  const random = Math.floor(1000 + Math.random() * 9000);
  return base + random;
}

export async function createUniqueReferralCode(name) {
  let code;
  let exists = true;
  while (exists) {
    code = generateReferralCode(name);
    exists = await User.findOne({ referralCode: code });
  }
  return code;
}
