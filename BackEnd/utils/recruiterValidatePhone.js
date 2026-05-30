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

const validateRecruiterPhone = (value) => {
  const normalizedPhone = normalizeInternationalPhone(value);

  if (!normalizedPhone) {
    return {
      valid: false,
      message: "Phone number is required",
    };
  }

  const isValid = isValidInternationalPhone(normalizedPhone);

  if (!isValid) {
    return {
      valid: false,
      message: "Invalid international phone number",
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
