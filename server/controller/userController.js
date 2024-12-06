import User from "../models/user.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "./../utils/customError.js";

/*  signUp controller --> POST -> api/users/signup   */
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

/* login controller --> POST -> api/users/login */
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
  const token = await user.getJwtToken(); // Expires in 2 days```
  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
});

/* Get all employees controller --> GET -> api/users/employees */
export const getAllEmployees = catchAsyncError(async (req, res, next) => {
  // Fetch all users with 'employee' role from the database
  const employees = await User.find({ role: "employee" }).select("-password");
  // Check if employees exist
  if (!employees || employees.length === 0) {
    return next(new CustomError("No employees found", 404));
  }
  // Respond with the list of employees
  res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    employees,
    totalEmployees: employees.length,
  });
});
