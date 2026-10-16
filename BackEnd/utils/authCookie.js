const LEGACY_TOKEN_COOKIE_PATHS = [
  "/api/v1/user",
  "/api/v1/recruiter",
  "/api/v1/admin",
  "/api/v1/digitalmarketer",
];

// Locked-in cookie options — DO NOT override at call sites
const COOKIE_OPTIONS = {
  domain: ".greathire.in",   // leading dot covers greathire.in AND api.greathire.in
  path: "/",
  httpOnly: true,
  secure: true,              // required when sameSite === "none"
  sameSite: "none",          // allows cross-subdomain XHR
};

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day

export const setAuthTokenCookie = (res, token) => {
  LEGACY_TOKEN_COOKIE_PATHS.forEach((path) =>
    res.clearCookie("token", { path })
  );
  res.clearCookie("token", { path: "/" });

  return res.cookie("token", token, {
    ...COOKIE_OPTIONS,
    maxAge: COOKIE_MAX_AGE,
  });
};

export const clearAuthTokenCookie = (res) => {
  LEGACY_TOKEN_COOKIE_PATHS.forEach((path) =>
    res.clearCookie("token", { path })
  );
  return res.clearCookie("token", {
    domain: COOKIE_OPTIONS.domain,
    path: COOKIE_OPTIONS.path,
  });
};