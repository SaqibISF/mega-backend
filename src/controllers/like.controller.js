import mongoose from "mongoose";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../HttpStatusCodes.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const isAlreadyLiked = await Like.findOne({
      likedBy: req.userId,
      videoId: req.videoId,
    });

    const toggle = isAlreadyLiked
      ? await Like.findOneAndDelete({
          likedBy: req.userId,
          videoId: req.videoId,
        })
      : await Like.create({ likedBy: req.userId, videoId: req.videoId });

    const statusCode = toggle ? OK : INTERNAL_SERVER_ERROR;
    const message = toggle
      ? isAlreadyLiked
        ? "Video is unlike"
        : "Video is liked"
      : "Something went wrong, while toggling video like...";

    const data = toggle
      ? { videoId: toggle.videoId, likedBy: toggle.likedBy, isLiked }
      : undefined;

    return ApiSuccessResponse(res, statusCode, data, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while toggling video like..."
    );
  }
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const isAlreadyLiked = await Like.findOne({
      likedBy: req.userId,
      commentId: req.commentId,
    });

    const toggle = isAlreadyLiked
      ? await Like.findOneAndDelete({
          likedBy: req.userId,
          commentId: req.commentId,
        })
      : await Like.create({ likedBy: req.userId, commentId: req.commentId });

    const statusCode = toggle ? OK : INTERNAL_SERVER_ERROR;
    const message = toggle
      ? isAlreadyLiked
        ? "Comment is unlike"
        : "Comment is liked"
      : "Something went wrong, while toggling comment like...";

    const data = toggle
      ? { commentId: toggle.commentId, likedBy: toggle.likedBy, isLiked }
      : undefined;

    return ApiSuccessResponse(res, statusCode, data, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while toggling comment like..."
    );
  }
});

export const toggleTweetLike = asyncHandler(async (req, res) => {
  try {
    const isAlreadyLiked = await Like.findOne({
      likedBy: req.userId,
      tweetId: req.tweetId,
    });

    const toggle = isAlreadyLiked
      ? await Like.findOneAndDelete({
          likedBy: req.userId,
          tweetId: req.tweetId,
        })
      : await Like.create({ likedBy: req.userId, tweetId: req.tweetId });

    const statusCode = toggle ? OK : INTERNAL_SERVER_ERROR;
    const message = toggle
      ? isAlreadyLiked
        ? "Tweet is unlike"
        : "Tweet is liked"
      : "Something went wrong, while toggling tweet like...";

    const data = toggle
      ? { tweetId: toggle.tweetId, likedBy: toggle.likedBy, isLiked }
      : undefined;

    return ApiSuccessResponse(res, statusCode, data, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while toggling tweet like..."
    );
  }
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.userId),
          videoId: { $ne: null, $exists: true },
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videoId",
          foreignField: "_id",
          as: "videos",
        },
      },
      {
        $project: {
          videoId: 0,
          commentId: 0,
          tweetId: 0,
          likedBy: 0,
        },
      },
    ]);

    const statusCode = videos ? OK : NOT_FOUND;
    const message = videos
      ? "Liked video fetched successfully"
      : "Liked videos not founded";

    return ApiSuccessResponse(res, statusCode, videos, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching liked videos"
    );
  }
});
