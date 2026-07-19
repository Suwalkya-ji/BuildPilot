import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

export const registerService = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginService = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};