import ApiError from "../utils/ApiError.js";

const isProduction = process.env.NODE_ENV === "production";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
  };

  // Expose stack trace only in development
  if (!isProduction && error.stack) {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;