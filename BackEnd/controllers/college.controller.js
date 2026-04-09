import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { College } from "../models/college.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const registerCollege = async (req, res) => {
  try {
    const { collegeName, fullName, email, phoneNumber, password, address, website, tpo, tpoEmail, tpoPhone, naac, established, type } = req.body;

    if (!collegeName || !email || !password) {
      return res.status(400).json({ success: false, message: "College name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const existingEmail = await College.findOne({ "emailId.email": email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "This email is already registered." });
    }

    const existingName = await College.findOne({ collegeName: { $regex: new RegExp(`^${collegeName}$`, "i") } });
    if (existingName) {
      return res.status(400).json({ success: false, message: "A college with this name is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const college = await College.create({
      collegeName,
      fullName: fullName || collegeName,
      emailId: { email },
      phoneNumber,
      password: hashedPassword,
      address, website, tpo, tpoEmail, tpoPhone, naac,
      established: established ? parseInt(established) : null,
      type,
    });

    const token = jwt.sign({ collegeId: college._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    const collegeData = await College.findById(college._id).select("-password");

    return res
      .status(200)
      .cookie("college_token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
      .json({ success: true, message: "College registered successfully.", college: collegeData });
  } catch (error) {
    console.error("registerCollege error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const college = await College.findOne({ "emailId.email": email });
    if (!college) {
      return res.status(200).json({ success: false, message: "College account not found." });
    }

    const isMatch = await bcrypt.compare(password, college.password);
    if (!isMatch) {
      return res.status(200).json({ success: false, message: "Incorrect email or password." });
    }

    const token = jwt.sign({ collegeId: college._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    const collegeData = await College.findById(college._id).select("-password");

    return res
      .status(200)
      .cookie("college_token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
      .json({ success: true, message: `Welcome ${college.collegeName}`, college: collegeData });
  } catch (error) {
    console.error("loginCollege error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logoutCollege = async (req, res) => {
  return res
    .status(200)
    .cookie("college_token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" })
    .json({ success: true, message: "Logged out successfully." });
};

// ── GET ME ────────────────────────────────────────────────────────────────────
export const getCollegeMe = async (req, res) => {
  try {
    const college = await College.findById(req.collegeId).select("-password");
    if (!college) return res.status(404).json({ success: false, message: "College not found." });
    return res.status(200).json({ success: true, college });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── DEBUG (TEMP) ─────────────────────────────────────────────────────────────
export const debugCollegeStudents = async (req, res) => {
  try {
    const decodedName = decodeURIComponent(req.params.collegeName).trim();
    const students = await User.find({
      $or: [
        { collegeName: { $regex: new RegExp(decodedName, "i") } },
        { collegeName: { $regex: new RegExp(decodedName.replace(/\s+/g, "\\s*"), "i") } },
      ],
    }).select("fullname emailId collegeName rollNo stream _id");

    const result = await Promise.all(students.map(async (s) => {
      const email = s.emailId?.email || "";
      const byId = await Application.countDocuments({ applicant: s._id });
      const byEmail = email ? await Application.countDocuments({ applicantEmail: email }) : 0;
      return {
        name: s.fullname,
        userId: s._id,
        collegeName: s.collegeName,
        email,
        appsByObjectId: byId,
        appsByEmail: byEmail,
      };
    }));

    return res.status(200).json({ searchedFor: decodedName, students: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ── HELPER: fetch applications for a student, with email fallback ─────────────
async function fetchApplicationsForStudent(studentId, studentEmail) {
  // Primary: match by applicant ObjectId (correct path)
  let applications = await Application.find({ applicant: studentId })
    .populate("job", "jobDetails")
    .lean();

  // Fallback (Cause 2): if 0 results, the application may have been saved under
  // a different account but same email — match by applicantEmail
  if (applications.length === 0 && studentEmail) {
    applications = await Application.find({ applicantEmail: studentEmail })
      .populate("job", "jobDetails")
      .lean();
  }

  return applications;
}

// ── GET STUDENTS BY COLLEGE ───────────────────────────────────────────────────
export const getStudentsByCollege = async (req, res) => {
  try {
    const { collegeName } = req.params;
    if (!collegeName) {
      return res.status(400).json({ success: false, message: "College name is required" });
    }

    const decodedName = decodeURIComponent(collegeName).trim();

    // Cause 1 & 3: search by collegeName with case-insensitive regex
    // Also handles students whose collegeName was set with different casing/spacing
    const students = await User.find({
      $or: [
        { collegeName: { $regex: new RegExp(decodedName, "i") } },
        { collegeName: { $regex: new RegExp(decodedName.replace(/\s+/g, "\\s*"), "i") } },
      ],
    }).select("-password");

    console.log(`[College] Searching for collegeName: "${decodedName}" → found ${students.length} students`);

    const studentsWithApps = await Promise.all(
      students.map(async (s) => {
        const studentEmail = s.emailId?.email || "";

        // Cause 2 & 4: use helper that falls back to email match + fixed populate
        const applications = await fetchApplicationsForStudent(s._id, studentEmail);

        console.log(`[College] Student ${s.fullname} (${s._id}) → ${applications.length} applications`);

        const mappedApps = applications.map((app) => ({
          id: app._id,
          company: app.job?.jobDetails?.companyName || app.applicantProfile?.companyName || "N/A",
          role: app.job?.jobDetails?.title || "N/A",
          location: app.job?.jobDetails?.location || "N/A",
          package: app.job?.jobDetails?.salary || "N/A",
          jobType: app.job?.jobDetails?.jobType || "Job",
          status: app.status || "Pending",
          date: app.createdAt?.toISOString().split("T")[0] || "",
          channel: "Job Portal",
        }));

        const hasPlaced = mappedApps.some((a) => a.status === "Shortlisted");
        const placementStatus = hasPlaced ? "Placed" : mappedApps.length > 0 ? "Applied" : "Applied";

        const initials = s.fullname?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "NA";

        return {
          id: s._id,
          name: s.fullname || "",
          photo: initials,
          profilePhoto: s.profile?.profilePhoto || "",
          email: studentEmail,
          phone: s.phoneNumber?.number || "",
          stream: s.stream || "",
          qualification: s.profile?.qualification || "",
          year: new Date(s.createdAt).getFullYear().toString(),
          cgpa: s.cgpa || 0,
          rollNo: s.rollNo || "N/A",
          gender: s.profile?.gender || "Not Select",
          hometown: s.hometown || "",
          city: s.address?.city || "",
          state: s.address?.state || "",
          skills: s.profile?.skills || [],
          bio: s.profile?.bio || "",
          resume: s.profile?.resume || "",
          status: placementStatus,
          applications: mappedApps,
        };
      })
    );

    return res.status(200).json({ success: true, students: studentsWithApps });
  } catch (error) {
    console.error("getStudentsByCollege error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
