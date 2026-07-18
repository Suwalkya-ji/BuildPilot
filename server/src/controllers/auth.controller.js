import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signUpController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Hash Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Don't send password back
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: userResponse,
    });
  } catch (error) {
    console.error("Error in SignUp Controller:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
