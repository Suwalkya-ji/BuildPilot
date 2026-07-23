import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  registerService,
  verifyOtpService,
  resendOtpService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";

import {
  validateRegister,
  validateLogin,
  validateVerifyOtp,
  validateResendOtp,
  validateForgotPassword,
  validateResetPassword,
} from "../validations/auth.validation.js";

export const register = asyncHandler(async (req, res) => {
  validateRegister(req.body);

  const result = await registerService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, result, result.message || "User Registered. Please verify your OTP."));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  validateVerifyOtp(req.body);

  const result = await verifyOtpService(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Email Verified Successfully"));
});

export const resendOtp = asyncHandler(async (req, res) => {
  validateResendOtp(req.body);

  const result = await resendOtpService(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message || "OTP resent successfully"));
});

export const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const result = await loginService(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Login Successful"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  validateForgotPassword(req.body);

  const result = await forgotPasswordService(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  validateResetPassword(req.body);

  const result = await resetPasswordService(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Current User"
    )
  );
});