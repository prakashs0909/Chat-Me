import AppError from "../utils/app-error-util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ENV_VAR } from "../config/env-var.js";
import UserModel from "../models/user-model.js";

export const authenticate = async (req, res, next) => {
  let token = req?.cookies?.token;
  if (!token) {
    return next(
      new AppError(
        "Please login again",
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }
  let decodeToken = await jwt.verify(token, ENV_VAR.JWT_SECRET_KEY);
  let user = await UserModel.findById(decodeToken.userId).select("-password");
  if (!user) {
    return next(
      new AppError(
        "Invalid Session, Please login again",
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  req.user = user;
  next();
};
