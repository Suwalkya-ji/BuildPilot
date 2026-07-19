import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  registerService,
  loginService,
} from "../services/auth.service.js";

import {
  validateRegister,
  validateLogin,
} from "../validations/auth.validation.js";

export const register = asyncHandler(async (req, res) => {
  validateRegister(req.body);

  const result = await registerService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, result, "User Registered Successfully"));
});

export const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const result = await loginService(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Login Successful"));
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