import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../HttpStatusCodes.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export const getVideoComments = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1, // Page number
      limit = 10, // Results per page
    } = req.query;

    const aggregate = [
      { $match: { video: new mongoose.Types.ObjectId(req.videoId) } },
      { $sort: { createdAt: -1 } },
    ];

    const options = {
      page: Number(page),
      limit: Number(limit),
      // customLabels: {
      //   docs: 'comments',
      //   totalDocs: 'totalComments',
      //   currentPage: "page",
      //   resultPerPage: "limit",
      // },
    };

    const result = await Comment.aggregatePaginate(aggregate, options);
    const statusCode = result.totalDocs !== 0 ? OK : NOT_FOUND;
    const message =
      result.totalDocs !== 0
        ? "Comments fetched successfully"
        : "No comments founded";

    return ApiSuccessResponse(
      res,
      statusCode,
      {
        comments: result.docs,
        totalComments: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
        resultPerPage: result.limit,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
      },
      message
    );
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while comments fetching..."
    );
  }
});

export const addComment = asyncHandler(async (req, res) => {
  try {
    const comment = req.body.comment?.trim() || null;

    if (!comment) {
      throw new ApiError(BAD_REQUEST, "comment is required");
    }

    const dbComment = await Comment.create({
      comment,
      video: req.videoId,
      userId: req.user._id,
    });

    return ApiSuccessResponse(
      res,
      CREATED,
      dbComment,
      "Commented successfully"
    );
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while commenting..."
    );
  }
});

export const updateComment = asyncHandler(async (req, res) => {
  try {
    const comment = req.body.comment?.trim() || null;

    if (!comment) {
      throw new ApiError(BAD_REQUEST, "comment is required");
    }

    const dbComment = await Comment.findByIdAndUpdate(
      req.commentId,
      { comment },
      { new: true }
    );

    return ApiSuccessResponse(
      res,
      OK,
      dbComment,
      "Comment updated successfully"
    );
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while comment updating..."
    );
  }
});

export const deleteComment = asyncHandler(async (req, res) => {
  try {
    const result = await Comment.deleteOne({ _id: req.commentId });
    const isDeleted = result.deletedCount === 1;

    const statusCode = isDeleted ? OK : NOT_FOUND;
    const message = isDeleted
      ? "Comment deleted successfully"
      : "Comment not found";

    return ApiSuccessResponse(res, statusCode, { isDeleted }, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while comment deleting..."
    );
  }
});
