// Candidate skills are *supposed* to be an array — user.model.js declares
// profile.skills as [String] — but bulk/AI-sourced rows were written as a raw
// comma-separated string, and the candidate list endpoints read with .lean(),
// so mongoose never casts them back on the way out.
//
// Rendering code that does skills.slice(0, 3).map(...) then throws
// "TypeError: skills.slice(...).map is not a function" (a string has .slice
// but no .map), which takes the whole page down via the ErrorBoundary.
//
// Coerce whatever actually comes off the API into a clean string array.
export const toSkillArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export default toSkillArray;
