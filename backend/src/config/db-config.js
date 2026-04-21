import mongoose from "mongoose";
import { ENV_VAR } from "./env-var.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV_VAR.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};