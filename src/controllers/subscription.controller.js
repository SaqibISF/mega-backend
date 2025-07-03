import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../HttpStatusCodes.js";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const subscribe = asyncHandler(async (res, req) => {
  try {
    const subscription = await Subscription.create({
      subscriber: req.subscriberId,
      channel: req.channelId,
    });

    const statusCode = subscription ? CREATED : INTERNAL_SERVER_ERROR;
    const message = subscription
      ? "Channel subscribed successfully"
      : "Something went wrong, while subscribing...";

    return ApiSuccessResponse(res, statusCode, subscription, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while subscribing..."
    );
  }
});

export const unsubscribe = asyncHandler(async (res, req) => {
  try {
    const result = await Subscription.deleteOne({
      subscriber: req.subscriberId,
      channel: req.channelId,
    });

    const isUnsubscribed = result.deletedCount === 1;
    const statusCode = isUnsubscribed ? OK : NOT_FOUND;
    const message = isUnsubscribed
      ? "Unsubscribed successfully"
      : "Subscription not founded";

    return ApiSuccessResponse(res, statusCode, { isUnsubscribed }, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while unsubscribing..."
    );
  }
});

export const isSubscribed = asyncHandler(async (res, req) => {
  try {
    const subscription = await Subscription.findOne({
      subscriber: req.subscriberId,
      channel: req.channelId,
    });

    const statusCode = subscription ? OK : NOT_FOUND;
    const message = subscription
      ? "Subscription founded successfully"
      : "Subscription not founded";

    return ApiSuccessResponse(res, statusCode, subscription, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching subscription..."
    );
  }
});
