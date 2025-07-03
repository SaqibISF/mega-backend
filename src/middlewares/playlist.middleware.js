import mongoose from "mongoose";
import { BAD_REQUEST } from "../HttpStatusCodes.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyPlaylistId = asyncHandler(async (req, _, next) => {
  const playlistId = req.params.playlistId?.trim() || null;

  if (!playlistId) {
    throw new ApiError(BAD_REQUEST, "playlistId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(BAD_REQUEST, "Invalid playlistId format");
  }

  req.playlistId = playlistId;
  next();
});
