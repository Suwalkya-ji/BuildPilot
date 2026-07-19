import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message);
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
  });
};

export default errorHandler;