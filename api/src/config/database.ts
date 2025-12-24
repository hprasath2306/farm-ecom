import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI!;
    await mongoose.connect(mongoURI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;