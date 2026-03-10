// utils/slugify.js
export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces → hyphens
    .replace(/[^\w-]+/g, "")     // remove special chars
    .replace(/--+/g, "-");       // double hyphens → single