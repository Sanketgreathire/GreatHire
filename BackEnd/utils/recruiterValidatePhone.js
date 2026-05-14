const normalizeInternationalPhone = (value) => {
  if (value == null) return '';
  let phone = String(value).trim();

  // Remove common formatting characters.
  phone = phone.replace(/[\s().-]/g, '');

  // Convert international prefix 00 -> +
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;

  // If the number is digits only, treat it as an international number without the + prefix.
  if (!phone.startsWith('+') && /^\d+$/.test(phone)) phone = `+${phone}`;

  return phone;
};

const isValidInternationalPhone = (value) => {
  const phone = normalizeInternationalPhone(value);
  return /^\+[1-9]\d{5,14}$/.test(phone);
};

const validateRecruiterPhone = (value) => isValidInternationalPhone(value);

export { normalizeInternationalPhone, isValidInternationalPhone, validateRecruiterPhone };
export default validateRecruiterPhone;
