import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../constants.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const getPublicId = (url) => {
  return url.split("/").pop().split(".")[0];
};

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    return await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
  } catch (error) {
    return null;
  } finally {
    await fs.promises.unlink(localFilePath);
  }
};

export const deleteFromCloudinary = async (url) => {
  try {
    if (!url) return null;
    return await cloudinary.uploader.destroy(getPublicId(url), {
      resource_type: "auto",
    });
  } catch (error) {
    return null;
  }
};

export const deleteFilesFromCloudinary = async (...urls) => {
  try {
    if (!urls || urls.length === 0) return null;
    return await cloudinary.api.delete_resources(
      urls.map((url) => getPublicId(url))
    );
  } catch (error) {
    return null;
  }
};
