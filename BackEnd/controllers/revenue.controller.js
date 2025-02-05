import Revenue from "../models/revenue.model.js";

export const storeRevenue = async (req, res) => {
  try {
    const { itemDetails, companyName, userDetails } = req.body;

    if (
      !itemDetails ||
      !userDetails ||
      !userDetails.userName ||
      !userDetails.email ||
      !userDetails.phoneNumber
    ) {
      return res
        .status(400)
        .json({ message: "Missing required user details." });
    }

    const newRevenue = new Revenue({
      itemDetails,
      companyName: companyName || "",
      userDetails,
    });

    await newRevenue.save();
    res.status(201).json({ message: "Revenue recorded successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
