export const validateSignupForm = (formData) => {
  const errors = {};

  if (!formData.fullname || formData.fullname.length < 3) {
    errors.fullname = "Full name must be at least 3 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  // E.164 format: + followed by 6–15 digits (covers all countries)
  const e164Regex = /^\+\d{6,15}$/;
  if (!formData.phoneNumber || !e164Regex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Enter a valid phone number with country code (e.g. +919876543210).";
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
