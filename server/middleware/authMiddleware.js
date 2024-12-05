import catchAsyncError from "./catchAsyncError.js";
import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";

export const authMiddleware = catchAsyncError(async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      throw new CustomError("Authentication token is missing", 401);
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("role");
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    req.user = { userId: user._id, role: user.role };
    next();
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Authentication failed" });
  }
});

export const Authorize = (requiredRole) => {
  return (req, res, next) => {
    console.log("Authorize Middleware: User Info:", req.user);

    if (!req.user || req.user.role !== requiredRole) {
      return next(
        new CustomError(
          `Access denied! This route is restricted to ${requiredRole}s`,
          403
        )
      );
    }

    next();
  };
};
