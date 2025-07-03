export const ApiSuccessResponse = (res, statusCode, data, message) =>
  res
    .status(statusCode)
    .json({ statusCode, data, message, success: statusCode < 400 });

export const ApiErrorResponse = (res, statusCode, errors, message) =>
  res
    .status(statusCode)
    .json({ statusCode, errors, message, success: statusCode < 400 });
