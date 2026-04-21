import UserModel from "../models/user-model.js";
import { StatusCodes } from "http-status-codes";
import MessageModel from "../models/message-model.js";
import cloudinary from "../config/cloudinary-config.js";

export const getUserForSidebar = async (req, res, next) => {
  try {
    let loggedInUserId = req.user._id;
    let filteredUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User fetched successfully",
      users: filteredUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    let { id: userToChatId } = req.params;
    let myId = req.user._id;

    let message = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(StatusCodes.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    let { text, image } = req.body;
    let { id: receiverId } = req.params;
    let senderId = req.user._id;

    let imageUrl;
    if (image) {
      let uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(StatusCodes.OK).json(newMessage);
  } catch (error) {
    next(error);
  }
};
