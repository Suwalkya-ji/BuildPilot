import ApiError from "../utils/ApiError.js";

export const validateRegister = (data) => {
  const { name, email, password, confirmPassword } = data;

  if (!name || !email || !password || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }
};

export const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }
};

export const validateVerifyOtp = (data) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP code are required");
  }

  if (otp.length !== 6) {
    throw new ApiError(400, "OTP must be a 6-digit number");
  }
};

export const validateResendOtp = (data) => {
  const { email } = data;

  if (!email) {
    throw new ApiError(400, "Email is required to resend OTP");
  }
};

export const validateForgotPassword = (data) => {
  const { email } = data;

  if (!email) {
    throw new ApiError(400, "Email address is required");
  }
};

export const validateResetPassword = (data) => {
  const { email, otp, newPassword, confirmPassword } = data;

  if (!email || !otp || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (otp.length !== 6) {
    throw new ApiError(400, "OTP must be a 6-digit number");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }
};