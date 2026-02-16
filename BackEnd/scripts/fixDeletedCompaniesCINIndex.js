import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixDeletedCompaniesCINIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("deletedcompanies");

    // Drop the old CIN index
    try {
      await collection.dropIndex("CIN_1");
      console.log("✓ Dropped old CIN_1 index from deletedcompanies");
    } catch (error) {
      console.log("Index CIN_1 doesn't exist or already dropped");
    }

    // Create new sparse unique index
    await collection.createIndex({ CIN: 1 }, { unique: true, sparse: true });
    console.log("✓ Created new sparse unique index on CIN in deletedcompanies");

    console.log("\n✓ DeletedCompanies CIN index fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing CIN index:", error);
    process.exit(1);
  }
};

fixDeletedCompaniesCINIndex();
