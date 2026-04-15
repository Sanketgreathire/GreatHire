import { Company } from "../../models/company.model.js";
import { deletedCompany } from "../../models/deletedCompany.model.js";

// returning total number of company, active company, deactive company
export const companyStats = async (req, res) => {
  try {
    // Total Companies
    const totalCompanies = await Company.countDocuments();
    // Total Active Companies
    const totalActiveCompanies = await Company.countDocuments({
      isActive: true,
    });
    // Total Deactive Companies
    const totalDeactiveCompanies = await Company.countDocuments({
      isActive: false,
    });

    return res.status(200).json({
      success: true,
      stats:{totalCompanies,
      totalActiveCompanies,
      totalDeactiveCompanies,}
    });
  } catch (err) {
    console.error("Error fetching company stats:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// return all company list to admin
export const companyList = async (req, res) => {
  try {
    // Fetch all companies with only the selected fields, sorted by createdAt descending (latest first)
    const companies = await Company.find(
      {},
      "companyName email adminEmail phone isActive"
    ).sort({ createdAt: -1 });

    // Send the response with a success status
    res.status(200).json({ success: true, companies });
  } catch (err) {
    console.error("Error retrieving company list:", err);
    res
      .status(500)
      .json({ error: "Server error: Unable to retrieve company list" });
  }
};

import validator from "validator";

export const updateCompanyEmails = async (req, res) => {
  try {
    const { companyId, email, adminEmail } = req.body;

    // 🔐 Allow only Owner
    if (!req.user || req.user.role !== "Owner") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update company emails",
      });
    }

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const updateData = {};

    // ✅ Business Email Validation
    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail) {
        return res.status(400).json({
          success: false,
          message: "Business email cannot be blank",
        });
      }

      if (!validator.isEmail(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid business email format",
        });
      }

      // 🔁 Check duplicate
      const existingBusinessEmail = await Company.findOne({
        email: trimmedEmail,
        _id: { $ne: companyId },
      });

      if (existingBusinessEmail) {
        return res.status(400).json({
          success: false,
          message: "Business email already in use",
        });
      }

      updateData.email = trimmedEmail;
    }

    // ✅ Admin Email Validation
    if (adminEmail !== undefined) {
      const trimmedAdminEmail = adminEmail.trim().toLowerCase();

      if (!trimmedAdminEmail) {
        return res.status(400).json({
          success: false,
          message: "Admin email cannot be blank",
        });
      }

      if (!validator.isEmail(trimmedAdminEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid admin email format",
        });
      }

      // 🔁 Check duplicate
      const existingAdminEmail = await Company.findOne({
        adminEmail: trimmedAdminEmail,
        _id: { $ne: companyId },
      });

      if (existingAdminEmail) {
        return res.status(400).json({
          success: false,
          message: "Admin email already in use",
        });
      }

      updateData.adminEmail = trimmedAdminEmail;
    }

    // 🚫 Optional: prevent same email for both fields
    if (
      updateData.email &&
      updateData.adminEmail &&
      updateData.email === updateData.adminEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "Business and admin email cannot be the same",
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const company = await Company.findByIdAndUpdate(
      companyId,
      updateData,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emails updated successfully",
      company,
    });

  } catch (error) {
    console.error("Update email error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// return all deleted company list to admin
export const deletedCompanyList = async (req, res) => {
  try {
    // Fetch all companies with only the selected fields
    const companies = await deletedCompany.find(
      {},
      "companyName email adminEmail phone isActive"
    );

    // Send the response with a success status
    res.status(200).json({ success: true, companies });
  } catch (err) {
    console.error("Error retrieving company list:", err);
    res
      .status(500)
      .json({ error: "Server error: Unable to retrieve company list" });
  }
};
