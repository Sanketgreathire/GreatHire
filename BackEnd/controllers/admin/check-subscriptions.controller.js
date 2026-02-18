import { JobSubscription } from "../../models/jobSubscription.model.js";

export const checkJobSubscriptions = async (req, res) => {
  try {
    const jobSubs = await JobSubscription.find({ paymentStatus: "paid" })
      .populate("company")
      .sort({ createdAt: -1 })
      .limit(20);

    const formatted = jobSubs.map(sub => ({
      id: sub._id,
      company: sub.company?.companyName || "N/A",
      planName: sub.planName,
      price: sub.price,
      date: sub.createdAt,
      status: sub.status,
    }));

    return res.status(200).json({
      success: true,
      total: await JobSubscription.countDocuments({ paymentStatus: "paid" }),
      recent: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
