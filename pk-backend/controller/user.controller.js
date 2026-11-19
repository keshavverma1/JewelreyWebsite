import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendOTPEmail, sendOTPForForgetEmail } from "../utils/nodeMailer.js";
import pendingSignupModel from "../models/pendingSignupModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";


// ==========================================
// REGISTER USER
// ==========================================

const RegisterUser = async (req, res) => {
  const { name, email, password, acceptedTerms } = req.body;

  try {
    // 1. Validate fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      acceptedTerms !== true
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check existing verified user
    const existingUser = await userModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 4. Generate OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // OTP expiry: 1 minute
    const otpExpiry = new Date(Date.now() + 60 * 1000);

    // Signup session expiry: 15 minutes
    const signupExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // 5. Hash OTP and password
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save temporary signup data
    const pendingUser = await pendingSignupModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        acceptedTerms,
        otp: hashedOtp,
        otpExpiry,
        signupExpiry,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    // 7. Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("OTP email failed:", emailError);

      await pendingSignupModel.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    // 8. Send response with actual backend expiry
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpExpiry: pendingUser.otpExpiry,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// VERIFY SIGNUP OTP
// ==========================================

const VerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // 1. Validate fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // 2. Find pending user
    const user = await pendingSignupModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signup again",
      });
    }

    // 3. Check signup session expiry
    if (user.signupExpiry && user.signupExpiry <= new Date()) {
      await pendingSignupModel.deleteOne({ _id: user._id });

      return res.status(400).json({
        success: false,
        message: "Signup session expired. Please signup again",
      });
    }

    // 4. Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP",
      });
    }

    // 5. Compare OTP
    const isMatch = await bcrypt.compare(otp.toString(), user.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 6. Check existing user
    const existingUser = await userModel.findOne({
      email: user.email,
    });

    if (existingUser) {
      await pendingSignupModel.deleteOne({
        _id: user._id,
      });

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 7. Create verified user
    const newUser = await userModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      acceptedTerms: user.acceptedTerms,
      isVerified: true,
    });

    // 8. Delete pending signup record
    await pendingSignupModel.deleteOne({
      _id: user._id,
    });

    // 9. Success response
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// RESEND SIGNUP OTP
// ==========================================

const ResendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find pending signup
    const pendingUser = await pendingSignupModel.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Signup session not found. Please signup again.",
      });
    }

    // Check overall signup session expiry
    if (pendingUser.signupExpiry && pendingUser.signupExpiry <= new Date()) {
      await pendingSignupModel.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(400).json({
        success: false,
        message: "Signup session expired. Please signup again.",
      });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // New OTP expiry from backend
    const otpExpiry = new Date(Date.now() + 60 * 1000);

    // Keep old OTP in case email sending fails
    const oldOtp = pendingUser.otp;
    const oldOtpExpiry = pendingUser.otpExpiry;

    // Update pending user
    pendingUser.otp = hashedOtp;
    pendingUser.otpExpiry = otpExpiry;

    await pendingUser.save();

    // Send new OTP
    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      // Restore old OTP if email fails
      pendingUser.otp = oldOtp;
      pendingUser.otpExpiry = oldOtpExpiry;

      await pendingUser.save();

      console.error("Resend OTP email failed:", emailError);

      return res.status(500).json({
        success: false,
        message: "Unable to resend OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      otpExpiry: pendingUser.otpExpiry,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// USER LOGIN
// ==========================================

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validate fields
    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user
    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 5. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 6. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 7. Cookie settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 8. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// AUTH CHECK
// ==========================================

const isAuth = (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        isAuthenticated: false,
        message: "User not authenticated",
      });
    }

    return res.status(200).json({
      success: true,
      isAuthenticated: true,
      message: "User is authenticated",
      user,
    });
  } catch (error) {
    console.error("isAuth error:", error);

    return res.status(500).json({
      success: false,
      isAuthenticated: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// LOGOUT USER
// ==========================================

const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

const forgetPasswordSendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is not provided",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please create your account",
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // OTP expiry
    const otpExpiry = new Date(Date.now() + 60 * 1000);

    // Save OTP in user document
    user.otp = hashedOtp;
    user.otpExpiry = otpExpiry;

    await user.save();

    // Send email
    try {
      await sendOTPForForgetEmail(normalizedEmail, otp);
    } catch (emailError) {
      user.otp = null;
      user.otpExpiry = null;

      await user.save();

      console.error("Forgot password email error:", emailError);

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpExpiry: user.otpExpiry,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// FORGOT PASSWORD - VERIFY OTP
// ==========================================

const verifyForgetPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP",
      });
    }

    // Check OTP expiry
    if (user.otpExpiry <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp.toString(), user.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Forgot password OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ==========================================
// EXPORT CONTROLLERS
// ==========================================

export {
  RegisterUser,
  VerifyOTP,
  ResendOTP,
  UserLogin,
  isAuth,
  LogoutUser,
  forgetPasswordSendOtp,
  verifyForgetPasswordOtp,
  ResetPassowrd,
};
