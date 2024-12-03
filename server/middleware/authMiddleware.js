import catchAsyncError from "./cathAsyncError.js";
import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";
export const Authenticate = catchAsyncError(async (req, res, next) => {
  let token;
  const AUTHORIZATION = "Authorization";
  if (
    req.headers[AUTHORIZATION] &&
    req.headers[AUTHORIZATION].includes("Bearer")
  ) {
    token = req.headers[AUTHORIZATION].split(" ")[1];
  }

  if (!token) {
    return next(new CustomError("Authentication failed! no token", 400));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decode.id);
  next();
});

export const Authorize = (requiredRole) => {
  return (req, res, next) => {
    //check if user exists and has the required role
    if (!req.user || req.user.role !== requiredRole) {
      return next(
        new CustomError(
          `Access denied! This route is restricted to ${requiredRole}s`,
          403
        )
      );
    }
    // User has the required role, proceed
    next();
  };
};
