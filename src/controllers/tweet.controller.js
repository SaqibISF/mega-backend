import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
} from "../HttpStatusCodes.js";
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTweet = asyncHandler(async (req, res) => {
  try {
    const content = req.body.content?.trim() || null;
    if (!content) {
      throw new ApiError(BAD_REQUEST, "content is required");
    }

    const tweet = await Tweet.create({
      content: content,
      userId: req.user._id,
    });

    return ApiSuccessResponse(res, CREATED, tweet, "Tweeted successfully");
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while tweeting..."
    );
  }
});

export const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const tweets = await Tweet.find({ userId: req.user._id });
    return ApiSuccessResponse(res, OK, tweets, "Tweets successfully retrieved");
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching tweet"
    );
  }
});

export const updateTweet = asyncHandler(async (req, res) => {
  try {
    const content = req.body.content?.trim() || null;

    if (!content) {
      throw new ApiError(BAD_REQUEST, "content is required");
    }

    const tweet = await Tweet.findByIdAndUpdate(
      req.tweetId,
      { content: content },
      { new: true }
    );

    return ApiSuccessResponse(res, OK, tweet, "Tweet updated successfully");
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while updating tweet"
    );
  }
});

export const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const result = await Tweet.deleteOne({ _id: req.tweetId });
    const isDeleted = result.deletedCount === 1;

    const statusCode = isDeleted ? OK : NOT_FOUND;
    const message = isDeleted
      ? "Tweet deleted successfully"
      : "Tweet not found";

    return ApiSuccessResponse(res, statusCode, { isDeleted }, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while deleting tweet"
    );
  }
});
