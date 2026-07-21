import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const URL = process.env.MONGODB_URI;

    if (!URL) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(URL);
    console.info("[DB] MongoDB connected successfully");
  } catch (error) {
    console.error("[DB] Connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
