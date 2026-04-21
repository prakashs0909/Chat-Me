import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    line : err.stack,
  });
};