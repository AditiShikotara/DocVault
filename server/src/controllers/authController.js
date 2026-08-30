import crypto from "crypto";
import { User } from "../models/user.model.js";
import sendPasswordResetEmail from "../utils/mailer.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Password will be hashed by User model pre-save middleware
    const user = await User.create({
      fullName,
      email,
      password,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Something went wrong while registering!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password using User model method
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate access + refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",

      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },

        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong while logging in",
    });
  }
};

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: null
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            message: "Something went wrong while logging out"
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Generate random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before saving to database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        // Token valid for 15 minutes
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save({
            validateBeforeSave: false,
        });

        // Temporary reset URL for development
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        await sendPasswordResetEmail(email, resetUrl);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            message: "Something went wrong while processing password reset",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "New password is required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // Hash the token received from the reset URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid and non-expired reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
            });
        }

        // Update password
        user.password = password;

        // Remove reset token after successful reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Something went wrong while resetting password",
        });
    }
};

export { forgotPassword, loginUser, logoutUser, registerUser, resetPassword };

