import jwt from "jsonwebtoken";

const isCollegeAuthenticated = (req, res, next) => {
  const token = req.cookies.college_token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated. Please login." });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.collegeId = decoded.collegeId;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default isCollegeAuthenticated;
