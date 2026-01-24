import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    itemDetails: {
      itemType: {
        type: String,
        required: true,
        trim: true,
      },
      itemName: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    companyName: {
      type: String,
      trim: true,
    },
    userDetails: {
      userName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Revenue = mongoose.model("Revenue", revenueSchema);
export default Revenue;

export const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Revenue.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$itemDetails.price" },
        },
      },
    ]);

    res.status(200).json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
