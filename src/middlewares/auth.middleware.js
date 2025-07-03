import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { NOT_FOUND, UNAUTHORIZED } from "../HttpStatusCodes.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(NOT_FOUND, "Not authorized, token not found");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(
        UNAUTHORIZED,
        "Not authorized, token expired or invalid"
      );
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      UNAUTHORIZED,
      "Not authorized, token expired or invalid"
    );
  }
});
