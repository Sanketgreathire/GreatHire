const LEGACY_TOKEN_COOKIE_PATHS = [
  "/api/v1/user",
  "/api/v1/recruiter",
  "/api/v1/admin",
  "/api/v1/digitalmarketer",
];

export const setAuthTokenCookie = (res, token, sameSite = "strict") => {
  LEGACY_TOKEN_COOKIE_PATHS.forEach((path) => res.clearCookie("token", { path }));

  return res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite,
    path: "/",
  });
};

export const clearAuthTokenCookie = (res) => {
  LEGACY_TOKEN_COOKIE_PATHS.forEach((path) => res.clearCookie("token", { path }));
  return res.clearCookie("token", { path: "/" });
};