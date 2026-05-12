import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validateRecruiterPhone = (phone) => {
  if (!phone) return { valid: false, message: "Phone number is required." };

  // Normalize: accept E.164 (+919876543210) or raw digits (919876543210)
  const e164 = phone.startsWith("+") ? phone : "+" + phone;

  // Quick format check before parsing
  if (!/^\+\d{6,15}$/.test(e164)) {
    return { valid: false, message: "Invalid international phone number format." };
  }

  const parsed = parsePhoneNumberFromString(e164);

  if (!parsed || !parsed.isValid()) {
    return { valid: false, message: "Invalid phone number for the selected country." };
  }

  const { country, nationalNumber } = parsed;

  // India-specific extra rules
  if (country === "IN") {
    if (!/^[6-9]\d{9}$/.test(nationalNumber)) {
      return { valid: false, message: "Indian mobile numbers must start with 6, 7, 8, or 9." };
    }
    if (/^(\d)\1+$/.test(nationalNumber)) {
      return { valid: false, message: "Phone number cannot be all repeated digits." };
    }
    const blocked = ["1234567890", "9876543210", "9999999999", "0000000000"];
    if (blocked.includes(nationalNumber)) {
      return { valid: false, message: "Please enter a real phone number." };
    }
  }

  return { valid: true, message: null };
};
