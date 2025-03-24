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
    // Fetch all companies with only the selected fields
    const companies = await Company.find(
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
