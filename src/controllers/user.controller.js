import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../constants.js";
import mongoose from "mongoose";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../HttpStatusCodes.js";

export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      BAD_REQUEST,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim() || null;
  const email = req.body.email?.trim() || null;
  const fullname = req.body.fullname?.trim() || null;
  const password = req.body.password?.trim() || null;

  if (username | email | fullname | password) {
    throw new ApiError(
      BAD_REQUEST,
      "All fields are required, username, email, fullname, password"
    );
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      CONFLICT,
      `User with Email: ${email} or username: ${username} is already exist`
    );
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

  if (!avatarLocalPath) {
    throw new ApiError(BAD_REQUEST, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(
      INTERNAL_SERVER_ERROR,
      "Avatar file not uploaded, due to internal server error"
    );
  }

  const user = await User.create({
    username,
    email,
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage.url : "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      INTERNAL_SERVER_ERROR,
      "Something went wrong while registering the user"
    );
  }

  return ApiSuccessResponse(
    res,
    CREATED,
    createdUser,
    "User registered successfully"
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim() || null;
  const email = req.body.email?.trim() || null;
  const password = req.body.password?.trim() || null;

  if (!email && !username) {
    throw new ApiError(BAD_REQUEST, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(NOT_FOUND, "User does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(UNAUTHORIZED, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return ApiSuccessResponse(
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options),
    OK,
    { user: loggedInUser, accessToken, refreshToken },
    "user logged in successfully"
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return ApiSuccessResponse(
    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options),
    OK,
    {},
    "User logged out"
  );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(UNAUTHORIZED, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(NOT_FOUND, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(NOT_FOUND, "Your refresh token expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return ApiSuccessResponse(
      res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options),
      OK,
      { accessToken, refreshToken },
      "Access Token Refreshed"
    );
  } catch (error) {
    throw new ApiError(UNAUTHORIZED, error?.message || "invalid refresh token");
  }
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const oldPassword = req.body.oldPassword?.trim() || null;
  const newPassword = req.body.newPassword?.trim() || null;

  if (oldPassword | newPassword) {
    throw new ApiError(
      BAD_REQUEST,
      "Old password and new password both are required"
    );
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(UNAUTHORIZED, "Old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(BAD_REQUEST, "Both passwords are same");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return ApiSuccessResponse(res, OK, {}, "Password changed successfully");
});

export const getCurrentUser = asyncHandler(async (req, res) =>
  ApiSuccessResponse(res, OK, req.user, "user fetched successfully")
);

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim() || null;
  const email = req.body.email?.trim() || null;
  const fullname = req.body.fullname?.trim() || null;

  if (username | email | fullname) {
    throw new ApiError(BAD_REQUEST, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        email,
        fullname,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return ApiSuccessResponse(
    res,
    OK,
    user,
    "Account details updated successfully"
  );
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(BAD_REQUEST, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(INTERNAL_SERVER_ERROR, "Error while uploading avatar");
  }

  //TODO: delete old avatar

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return ApiSuccessResponse(res, OK, user, "Avatar updated successfully");
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(BAD_REQUEST, "Cover Image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(
      INTERNAL_SERVER_ERROR,
      "Error while uploading cover image"
    );
  }

  //TODO: delete old cover image

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return ApiSuccessResponse(res, OK, user, "Cover Image updated successfully");
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params.username?.trim() || null;
  if (!username) {
    throw new ApiError(BAD_REQUEST, "username is missing");
  }

  const channel = await User.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        subscribers: { $size: "$subscribers" },
        subscribedTo: { $size: "$subscribedTo" },
      },
    },
    // {
    //   $addFields: {
    //     isSubscribed: {
    //       $cond: {
    //         if: { $in: [req.user?._id, "$subscribers.subscriber"] },
    //         then: true,
    //         else: false,
    //       },
    //     subscribers: { $size: "$subscribers" },
    //     subscribedTo: { $size: "$subscribedTo" },
    //     },
    //   },
    // },
    {
      $project: {
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        subscribers: 1,
        subscribedTo: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(NOT_FOUND, "Channel does not exist");
  }

  return ApiSuccessResponse(
    res,
    OK,
    channel[0],
    "User channel fetched successfully"
  );
});

export const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user?._id) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              userId: "userId",
              // userId: {
              //   $first: "userId",
              // },
            },
          },
        ],
      },
    },
  ]);

  return ApiSuccessResponse(
    res,
    OK,
    user[0].watchHistory,
    "Watch history fetched successfully"
  );
});
