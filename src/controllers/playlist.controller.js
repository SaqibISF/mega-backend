import {
  OK,
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../HttpStatusCodes.js";
import { Playlist } from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const name = req.body.name?.trim() || null;
    const description = req.body.description?.trim() || null;
    const videos = req.body.videos || [];

    if (!name) {
      throw new ApiError(BAD_REQUEST, "playlist name is required");
    }

    const playlist = await Playlist.create({
      name,
      ...(description && { description }),
      videos,
      userId: req.userId,
    });

    const statusCode = playlist ? CREATED : INTERNAL_SERVER_ERROR;
    const message = playlist
      ? "Playlist created successfully"
      : "Internal server error while creating playlist";

    return ApiSuccessResponse(res, statusCode, playlist, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while creating playlist"
    );
  }
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.userId });

    const statusCode = playlists ? OK : NOT_FOUND;
    const message = playlists
      ? "Playlist fetched successfully"
      : `Not any playlist found against userId: ${req.userId}`;

    return ApiSuccessResponse(res, statusCode, playlists, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching playlists"
    );
  }
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.playlistId);

    const statusCode = playlist ? OK : NOT_FOUND;
    const message = playlist
      ? "Playlist fetched successfully"
      : `Not any playlist found against playlistId: ${req.playlistId}`;

    return ApiSuccessResponse(res, statusCode, playlist, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while fetching playlist"
    );
  }
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(
      req.playlistId,
      { $push: { videos: req.videoId } },
      { new: true }
    );

    const statusCode = playlist ? OK : NOT_FOUND;
    const message = playlist
      ? "Added video in playlist successfully"
      : `Not any playlist found against playlistId: ${req.playlistId}`;

    return ApiSuccessResponse(res, statusCode, playlist, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while adding video in playlist"
    );
  }
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(
      req.playlistId,
      { $pull: { videos: req.videoId } },
      { new: true }
    );

    const statusCode = playlist ? OK : NOT_FOUND;
    const message = playlist
      ? "playlist updated successfully"
      : `Not any playlist found against playlistId: ${req.playlistId}`;

    return ApiSuccessResponse(res, statusCode, playlist, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message ||
        "Something went wrong, while removing video from playlist"
    );
  }
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const result = await Playlist.deleteOne({ _id: req.playlistId });
    const isDeleted = result.deletedCount === 1;

    const statusCode = isDeleted ? OK : NOT_FOUND;
    const message = isDeleted
      ? "Playlist deleted successfully"
      : `Not any playlist found against playlistId: ${req.playlistId}`;

    return ApiSuccessResponse(res, statusCode, { isDeleted }, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while deleting playlist"
    );
  }
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const name = req.body.name?.trim() || null;
    const description = req.body.description?.trim() || null;

    if (!name || !description) {
      throw new ApiError(BAD_REQUEST, "playlist name or description is required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
      req.playlistId,
      { $set: { ...(name && { name }), ...(description && { description }) } },
      { new: true }
    );

    const statusCode = playlist ? OK : NOT_FOUND;
    const message = playlist
      ? "Playlist updated successfully"
      : `Not any playlist found against playlistId: ${req.playlistId}`;

    return ApiSuccessResponse(res, statusCode, playlist, message);
  } catch (error) {
    throw new ApiError(
      error.status || INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong, while updating playlist"
    );
  }
});
