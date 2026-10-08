import Revenue from "../models/revenue.model.js";

// this controller store revenue create by job posting plan or candidate database plan
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

    // Prevent duplicate recording if already recorded by backend verification in the last 5 minutes
    const recentRevenue = await Revenue.findOne({
      "itemDetails.itemName": itemDetails.itemName,
      "userDetails.email": userDetails.email,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (recentRevenue) {
      return res.status(200).json({ success: true, message: "Revenue already recorded." });
    }

    // creating new revenue data
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
