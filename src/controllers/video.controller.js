import mongoose from "mongoose";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../HttpStatusCodes.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFilesFromCloudinary,
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

export const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      sortBy,
      sortType,
      userId,
    } = req.body;
    // TODO: get all videos based on query, sort, pagination

    if (
      sortBy &&
      ![
        "title",
        "duration",
        "views",
        "userId",
        "createdAt",
        "updatedAt",
      ].includes(sortBy)
    ) {
      throw new ApiError(
        BAD_REQUEST,
        "Invalid sort by, must be 'title', 'duration', 'views', 'userId', 'createdAt' or 'updatedAt'"
      );
    }

    if (
      sortType &&
      !["ascending", "descending"].includes(sortType.toLowerCase())
    ) {
      throw new ApiError(
        BAD_REQUEST,
        "Invalid sort type, must be 'ascending' or 'descending'"
      );
    }

    const aggregate = [];

    // Match videos based on query (if provided)
    if (searchQuery) {
      aggregate.push({
        $match: {
          $text: { $search: searchQuery },
        },
      });
    }

    // Optionally filter by userId (if provided)
    if (userId) {
      aggregate.push({
        $match: { uploadedBy: mongoose.Types.ObjectId(userId) },
      });
    }

    const sort = {};
    if (sortBy && sortType) {
      const index = sortBy === "userId" ? "uploadedBy" : sortBy;
      sort[index] = sortType === "descending" ? -1 : 1;
    } else sort.createdAt = -1;

    aggregate.push({ $sort: sort });

    const options = {
      page: Number(page),
      limit: Number(limit),
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
        currentPage: "page",
        resultPerPage: "limit",
      },
    };

    const result = await Video.aggregatePaginate(aggregate, options);
    const statusCode = result.totalVideos !== 0 ? OK : NOT_FOUND;
    const message =
      result.totalVideos !== 0
        ? "Videos fetched successfully"
        : "No videos founded";

    return ApiSuccessResponse(res, statusCode, result, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while videos fetching..."
    );
  }
});

export const publishVideo = asyncHandler(async (req, res) => {
  try {
    const title = req.body.title?.trim() || null;
    const description = req.body.description?.trim() || null;

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path || null;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path || null;

    if (!title | !description | !videoFileLocalPath | !thumbnailLocalPath) {
      throw new ApiError(
        BAD_REQUEST,
        "title, description, videoFile and thumbnail all are required"
      );
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile | !thumbnail) {
      throw new ApiError(
        INTERNAL_SERVER_ERROR,
        "videoFile or thumbnail not upload completely, try again..."
      );
    }

    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration: videoFile.duration,
      uploadedBy: req.user._id,
    });

    return ApiSuccessResponse(res, OK, video, "Video published successfully");
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while publishing video"
    );
  }
});

export const getVideoById = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findById(req.videoId);
    const statusCode = video ? OK : NOT_FOUND;
    const message = video
      ? "Video fetched successfully"
      : `Video not found against videoId: ${req.videoId}`;
    return ApiSuccessResponse(res, statusCode, video, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching video"
    );
  }
});

export const updateVideoDetails = asyncHandler(async (req, res) => {
  try {
    const title = req.body.title?.trim() || null;
    const description = req.body.description?.trim() || null;

    if (!title || !description) {
      throw new ApiError(BAD_REQUEST, "title or description is required");
    }

    const video = await Video.findByIdAndUpdate(
      req.videoId,
      {
        $set: { ...(title && { title }), ...(description && { description }) },
      },
      { new: true }
    );

    return ApiSuccessResponse(
      res,
      OK,
      video,
      "Video details updated successfully"
    );
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while updating video details"
    );
  }
});

export const updateVideoThumbnail = asyncHandler(async (req, res) => {
  try {
    const thumbnailLocalPath = req.file?.path || null;
    if (!thumbnailLocalPath) {
      throw new ApiError(BAD_REQUEST, "Thumbnail file not found");
    }

    const video = await Video.findById(req.videoId);

    if (!video) {
      throw new ApiError(
        BAD_REQUEST,
        `Video not found against the videoId: ${req.videoId}`
      );
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      throw new ApiError(
        INTERNAL_SERVER_ERROR,
        "Error while uploading thumbnail"
      );
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.videoId,
      { $set: { thumbnail: thumbnail.url } },
      { new: true }
    );

    await deleteFromCloudinary(video.thumbnail);

    return ApiSuccessResponse(
      res,
      OK,
      updatedVideo,
      "Thumbnail updated successfully"
    );
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while updating thumbnail"
    );
  }
});

export const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findById(req.videoId);
    if (!video) {
      throw new ApiError(
        NOT_FOUND,
        `Video is not found against videoId: ${req.videoId}`
      );
    }

    const cloudinaryResult = await deleteFilesFromCloudinary(
      video.videoFile,
      video.thumbnail
    );

    if (!cloudinaryResult) {
      throw new ApiError(
        INTERNAL_SERVER_ERROR,
        "Something went wrong, while deleting video"
      );
    }

    await Comment.deleteMany({ _id: req.videoId });

    const result = await Video.deleteOne({ _id: req.videoId });
    const isDeleted = result.deletedCount === 1;
    const statusCode = isDeleted ? OK : NOT_FOUND;
    const message = isDeleted
      ? "Video is deleted successfully"
      : `Video is not found against videoId: ${req.videoId}`;
    return ApiSuccessResponse(res, statusCode, { isDeleted }, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while deleting video"
    );
  }
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.videoId,
      { $set: { isPublished: { $not: "$isPublished" } } },
      { new: true }
    );

    video.isToggled = video != null;
    const statusCode = video.isToggled ? OK : NOT_FOUND;
    const message = video.isToggled
      ? video.isPublished
        ? "Video is published"
        : "Video is unpublished"
      : `Video is not found against videoId: ${req.videoId}`;

    return ApiSuccessResponse(res, statusCode, video, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message ||
        "Something went wrong, while toggle isPublished status for video"
    );
  }
});
