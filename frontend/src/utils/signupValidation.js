export const validateSignupForm = (formData) => {
  let errors = {};

  if (!formData.fullname || formData.fullname.length < 3) {
    errors.fullname = "Full name must be at least 3 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber =
      "Enter a valid phone number (10 digits, starting with 6–9).";
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
};
