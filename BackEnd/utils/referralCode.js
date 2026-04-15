import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode() {
  let code = "";
  for (let i = 0; i < 6; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

export async function createUniqueReferralCode() {
  let code;
  let exists = true;
  while (exists) {
    code = generateCode();
    const inUsers = await User.findOne({ referralCode: code });
    const inRecruiters = await Recruiter.findOne({ referralCode: code });
    exists = inUsers || inRecruiters;
  }
  return code;
}
