import mongoose from "mongoose";
import { BAD_REQUEST } from "../HttpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const verifyVideoId = asyncHandler(async (req, _, next) => {
  const videoId =
    req.params.videoId?.trim() || req.body.videoId?.trim() || null;

  if (!videoId) {
    throw new ApiError(BAD_REQUEST, "videoId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(BAD_REQUEST, "Invalid videoId format");
  }

  req.videoId = videoId;
  next();
});
