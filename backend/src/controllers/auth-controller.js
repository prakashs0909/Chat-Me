import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user-model.js";
import { generateToken } from "../utils/jwt-util.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary-config.js";

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

    newUser = new UserModel({ fullName, email, password: hashedPassword });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
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

    if (!profilePic) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Profile pic is required",
      });
    }

    let uploadResponse = await cloudinary.uploader.upload(profilePic);
    let updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true },
    );

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
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User fetched successfully",
      payload: req.user, // this is coming from middleware
    });
  } catch (error) {
    next(error);
  }
};
