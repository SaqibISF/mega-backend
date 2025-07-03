import { OK } from "../HttpStatusCodes.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// build a health check response that simply return the Ok status as json with message
export const healthCheck = asyncHandler((req, res) =>
  ApiSuccessResponse(res, OK, req.body, "Everything is OK")
);

export const checkCode = asyncHandler((req, res) => {
  const { statusCode } = req.body;
  ApiSuccessResponse(res, statusCode, { statusCode }, "Everything is OK");
});
