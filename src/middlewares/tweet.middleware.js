import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BAD_REQUEST } from "../HttpStatusCodes.js";

export const verifyTweetId = asyncHandler(async (req, _, next) => {
  const tweetId = req.params.tweetId?.trim() || null;

  if (!tweetId) {
    throw new ApiError(BAD_REQUEST, "Tweet Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(BAD_REQUEST, "Invalid tweet ID format");
  }

  req.tweetId = tweetId;
  next();
});
