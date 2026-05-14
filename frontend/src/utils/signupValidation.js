export const validateSignupForm = (formData) => {
  const errors = {};

  if (!formData.fullname || formData.fullname.length < 3) {
    errors.fullname = "Full name must be at least 3 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  // Accept 10-digit numbers or E.164 format with country code
  const phoneRegex = /^(\+\d{6,15}|\d{10})$/;
  if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Enter a valid 10-digit mobile number or include country code (e.g. +919876543210).";
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
};
