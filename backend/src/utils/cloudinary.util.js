import fs from "fs";
import v2 from "../config/cloudinary-config.js"

export const uploadToCloudinary = async (filePath, next) => {
  try {
    if (!filePath) return;
    return await v2.uploader.upload(filePath, {
      folder: "blog_images",
      resource_type: "image",
    });
  } catch (error) {
    next(error);
  } finally {
    fs.unlinkSync(filePath);
  }
};

export const deleteFromCloudinary = async (publicId, next) => {
  try {
    if (!publicId) return;
    return await v2.uploader.destroy(publicId);
  } catch (error) {
    next(error);
  }
};
