import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyChannelId = asyncHandler(
  async (req, _, next) => {
    const { channelId } = req.body;

    if (!channelId) {
      throw new ApiError(
        BAD_REQUEST,
        "channelId is required"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      throw new ApiError(BAD_REQUEST, "Invalid channelId format");
    }

    req.channelId = channelId;
    next();
  }
);

export const verifySubscriberId = asyncHandler(
  async (req, _, next) => {
    const { subscriberId } = req.body;

    if (!subscriberId) {
      throw new ApiError(
        BAD_REQUEST,
        "subscriberId is required"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
      throw new ApiError(BAD_REQUEST, "Invalid subscriberId format");
    }

    req.subscriberId = subscriberId;
    next();
  }
);

// export const verifyChannelIdAndSubscriberId = asyncHandler(
//   async (req, _, next) => {
//     const { subscriberId, channelId } = req.body;

//     if (!subscriberId | !channelId) {
//       throw new ApiError(
//         BAD_REQUEST,
//         "subscriberId and channelId both are required"
//       );
//     }

//     if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
//       throw new ApiError(BAD_REQUEST, "Invalid subscriberId format");
//     }

//     if (!mongoose.Types.ObjectId.isValid(channelId)) {
//       throw new ApiError(BAD_REQUEST, "Invalid channelId format");
//     }

//     req.subscriberId = subscriberId;
//     req.channelId = channelId;
//     next();
//   }
// );
