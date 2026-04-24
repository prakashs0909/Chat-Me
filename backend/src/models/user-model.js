import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    profilePic: {
      type: String,
      default: "",
    },
    profilePicPublicId: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: { type: String },
    isverified: {
      type: Boolean,
      default: false,
    },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
