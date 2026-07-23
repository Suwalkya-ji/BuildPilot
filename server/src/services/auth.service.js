import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import PasswordReset from "../models/passwordReset.model.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail, sendPasswordResetEmail } from "./email.service.js";

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerService = async (data) => {
  const { name, email, password } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(409, "User already exists with this email address");
    } else {
      // If user registered earlier but didn't verify, update password & name
      existingUser.name = name;
      existingUser.password = password;
      await existingUser.save();
    }
  } else {
    // Create new unverified user
    await User.create({
      name,
      email: normalizedEmail,
      password,
      isVerified: false,
    });
  }

  // Delete any existing OTP for this email
  await OTP.deleteMany({ email: normalizedEmail });

  // Generate new OTP & save to DB
  const otpCode = generateOTP();
  await OTP.create({
    email: normalizedEmail,
    otp: otpCode,
  });

  // Send OTP email via Brevo
  await sendOTPEmail({
    toEmail: normalizedEmail,
    name,
    otp: otpCode,
  });

  return {
    requiresOtp: true,
    email: normalizedEmail,
    message: "OTP sent successfully to your email.",
  };
};

export const verifyOtpService = async (data) => {
  const { email, otp } = data;
  const normalizedEmail = email.toLowerCase().trim();

  // Find user
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  if (user.isVerified) {
    // Already verified, generate token directly
    const token = generateToken(user._id);
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: true,
      },
    };
  }

  // Check OTP match
  const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP verification code");
  }

  // Mark user as verified
  user.isVerified = true;
  user.lastLogin = new Date();
  await user.save();

  // Delete used OTP
  await OTP.deleteMany({ email: normalizedEmail });

  // Issue token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
    },
  };
};

export const resendOtpService = async (data) => {
  const { email } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  // Clear existing OTP & generate a fresh one
  await OTP.deleteMany({ email: normalizedEmail });

  const newOtp = generateOTP();
  await OTP.create({
    email: normalizedEmail,
    otp: newOtp,
  });

  await sendOTPEmail({
    toEmail: normalizedEmail,
    name: user.name,
    otp: newOtp,
  });

  return {
    message: "A new OTP has been sent to your email address.",
  };
};

export const loginService = async (data) => {
  const { email, password } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  if (!user.isVerified) {
    // Generate and send a new OTP if unverified
    await OTP.deleteMany({ email: normalizedEmail });
    const newOtp = generateOTP();
    await OTP.create({ email: normalizedEmail, otp: newOtp });
    await sendOTPEmail({ toEmail: normalizedEmail, name: user.name, otp: newOtp });

    return {
      requiresOtp: true,
      email: normalizedEmail,
      message: "Your account is not verified yet. A new OTP has been sent to your email.",
    };
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
      isVerified: user.isVerified,
    },
  };
};

export const forgotPasswordService = async (data) => {
  const { email } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "No account found with this email address");
  }

  // Clear any existing password reset token for this email
  await PasswordReset.deleteMany({ email: normalizedEmail });

  // Generate 6-digit reset OTP
  const resetOtp = generateOTP();
  await PasswordReset.create({
    email: normalizedEmail,
    otp: resetOtp,
  });

  // Send password reset email via Brevo
  await sendPasswordResetEmail({
    toEmail: normalizedEmail,
    name: user.name,
    otp: resetOtp,
  });

  return {
    success: true,
    email: normalizedEmail,
    message: "Password reset OTP sent to your email address.",
  };
};

export const resetPasswordService = async (data) => {
  const { email, otp, newPassword } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  // Verify OTP
  const resetRecord = await PasswordReset.findOne({
    email: normalizedEmail,
    otp,
  });

  if (!resetRecord) {
    throw new ApiError(400, "Invalid or expired password reset OTP");
  }

  // Update password (pre-save hook will hash it automatically)
  user.password = newPassword;
  await user.save();

  // Clear reset OTP
  await PasswordReset.deleteMany({ email: normalizedEmail });

  return {
    success: true,
    message: "Password reset successfully. You can now login with your new password.",
  };
};