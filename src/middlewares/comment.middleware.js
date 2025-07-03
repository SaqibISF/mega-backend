import mongoose from "mongoose";
import { BAD_REQUEST } from "../HttpStatusCodes.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyCommentId = asyncHandler(async (req, _, next) => {
  const commentId = req.params.commentId?.trim() || null;

  if (!commentId) {
    throw new ApiError(BAD_REQUEST, "commentId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(BAD_REQUEST, "Invalid commentId format");
  }

  req.commentId = commentId;
  next();
});
