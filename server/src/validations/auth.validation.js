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