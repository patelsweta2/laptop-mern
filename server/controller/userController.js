import User from "../models/user.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "./../utils/customError.js";
import RefreshToken from "../models/refreshtoken.js";

//signUp controller --> POST -> api/users/signup
export const signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password, department, role } = req.body;

  //check if email already exists
  const isExist = await User.findOne({ email });
  if (isExist) {
    return next(new CustomError("Email already exists", 400));
  }

  //create new user
  const user = await User.create({ name, email, password, department, role });

  // Respond with user details (excluding sensitive info like password)
  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

//login controller --> POST -> api/users/login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("email is not registered", 401));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new CustomError("Incorrect password", 401));
  }
  // Generate token
  const token = user.getAccessJwtToken(); // Expires in 15 minutes
  const refreshToken = user.getRefreshJwtToken(); // Expires in 30 days
  const dbToken = await RefreshToken.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        refreshToken,
        userId: user._id,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  if (!dbToken) {
    return next(new CustomError("Internal server error", 500));
  }
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000 // 30 days for cookie
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "strict";
  }
  res
    .status(200)
    .cookie("refreshToken", dbToken.refreshToken, cookieOptions)
    .json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
});
