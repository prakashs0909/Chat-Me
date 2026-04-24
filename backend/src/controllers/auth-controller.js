import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user-model.js";
import { generateToken } from "../utils/jwt-util.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary-config.js";
import { ENV_VAR } from "../config/env-var.js";
import { sendVerificationLink } from "../utils/nodeMailer-util.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    let { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }
    if (password.length < 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Password must be at least 5 characters",
      });
    }

    let newUser = await UserModel.findOne({ email });
    if (newUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
      verificationToken: hashedToken,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
    });

    if (newUser) {
      // console.log("token", rawToken);
      await newUser.save();

      let verifivationLink = `${ENV_VAR.CLIENT_URL}/verify-email/${rawToken}`;

      setTimeout(() => {
        sendVerificationLink(email, verifivationLink, next);
      }, 0);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully and verification link send",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
          profilePicPublicId: newUser.profilePicPublicId,
          isverified: newUser.isverified,
          verificationToken: newUser.verificationToken,
        },
      });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to register user" });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Invalid credentials",
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isverified) {
      const isExpired = user.verificationTokenExpiry < Date.now();
      if (isExpired) {
        const rawToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
          .createHash("sha256")
          .update(rawToken)
          .digest("hex");

        user.verificationToken = hashedToken;
        user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        const verificationLink = `${ENV_VAR.CLIENT_URL}/verify-email/${rawToken}`;

        setTimeout(() => {
          sendVerificationLink(user.email, verificationLink, next);
        }, 0);
      }

      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: isExpired
          ? "New verification link sent."
          : "Please verify your email before login",
        isExpired,
      });
    }

    generateToken(user._id, res);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User loged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let { profilePic } = req.body;
    let userId = req.user._id;
    let prePublicId = req.user.profilePicPublicId;

    if (!profilePic) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Profile pic is required",
      });
    }

    let uploadResponse = await cloudinary.uploader.upload(
      profilePic,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
        } else {
          console.log("Upload result:", result);
        }
      },
    );
    let updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
        profilePicPublicId: uploadResponse.public_id,
      },
      { returnDocument: "after" },
    );

    if (prePublicId) {
      try {
        await cloudinary.uploader.destroy(prePublicId, {
          invalidate: true,
        });
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    res.status(StatusCodes.OK).json({
      success: true,
      updateUser,
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuth = (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json(req.user);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  let { rawid } = req.params;
  let hashToken = crypto.createHash("sha256").update(rawid).digest("hex");
  try {
    let user = await UserModel.findOne({ verificationToken: hashToken });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (user.verificationTokenExpiry < Date.now()) {
      return next(
        new AppError(
          "Token Expired, Please request for new verification link",
          410,
        ),
      );
    }

    user.isverified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email Successfully verified ",
    });
  } catch (error) {
    next(error);
  }
};
