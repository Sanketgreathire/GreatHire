export const calculateMatchPercentage = (
  userSkills = [],
  jobSkills = []
) => {
  if (!jobSkills.length) {
    return 0;
  }

  const normalizedUserSkills = userSkills.map((skill) =>
    String(skill).trim().toLowerCase()
  );

  const normalizedJobSkills = jobSkills.map((skill) =>
    String(skill).trim().toLowerCase()
  );

  const matchedSkills = normalizedJobSkills.filter((jobSkill) =>
    normalizedUserSkills.includes(jobSkill)
  );

  return Math.round(
    (matchedSkills.length / normalizedJobSkills.length) * 100
  );
};