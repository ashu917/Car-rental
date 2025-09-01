// db/connectDb.js
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Connection Failed:", err.message);
    process.exit(1); // Exit on failure
  }
};

export default connectDb;