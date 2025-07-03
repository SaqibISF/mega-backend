import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../HttpStatusCodes.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";

export const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  try {
    const channelStats = await Video.aggregate([
      { $match: { uploadedBy: mongoose.Types.ObjectId(req.channelId) } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "uploadedBy",
          foreignField: "channel",
          as: "subscribers",
          // pipeline: [{ $project: { subscribers: { $size: "$subscribers" } } }],
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "videoId",
          as: "likes",
          // pipeline: [{ $project: { likes: { $size: "$likes" } } }],
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $ifNull: [{ $size: "$likes" }, 0] } },
          // totalLikes: { $sum: "$likes" },
          totalViews: { $sum: "$views" },
          totalVideos: { $sum: 1 },
        },
      },
      {
        $project: {
          totalLikes: 1,
          totalViews: 1,
          totalVideos: 1,
          subscribers: { $size: { $arrayElemAt: ["$subscribers", 0] } },
          // subscribers: { $arrayElemAt: ["$subscribers", 0] }
          // subscribers: 1,
        },
      },
    ]);

    const statusCode = channelStats ? OK : NOT_FOUND;
    const message = channelStats
      ? "Channel stats are founded successfully"
      : `Not record found against channelId: ${req.channelId}`;

    return ApiSuccessResponse(res, statusCode, channelStats, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching channel stats"
    );
  }
});

export const getChannelVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.channelId });

    const statusCode = videos ? OK : NOT_FOUND;
    const message = videos
      ? "Channel videos fetched successfully"
      : `Videos not found against channelId: ${req.channelId}`;

    return ApiSuccessResponse(res, statusCode, videos, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching videos"
    );
  }
});
