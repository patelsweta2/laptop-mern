import Issue from "../models/issues.schema.js";
import Laptop from "../models/laptops.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "../utils/customError.js";

//create a new issues by employee
export const reportIssue = catchAsyncError(async (req, res, next) => {
  const { laptopId, description, priority } = req.body;

  //validate required fields
  if (!laptopId || !description || !priority) {
    return next(
      new CustomError("Laptop ID, description, and priority are required", 400)
    );
  }

  // Check if the laptop exists
  const laptop = await Laptop.findById(laptopId);
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  // Create the issue
  const issue = await Issue.create({
    laptopId,
    description,
    priority,
    reportedBy: req.user._id,
  });
  res.status(201).json({
    message: "Issue reported successfully",
    issue,
  });
});

//get All issues
export const getAllIssues = catchAsyncError(async (req, res, next) => {
  const issues = await Issue.find().populate("laptopId").populate("reportedBy");
  res.status(200).json({
    message: "All issues retrieved successfully",
    issues,
  });
});

//update issue status (Admin)
export const updateIssuesStatus = catchAsyncError(async (req, res, next) => {
  const { issueId } = req.params;
  const { status } = req.body;
  // Validate the status
  if (!status || !["Pending", "Accept"].includes(status)) {
    return next(
      new CustomError(
        "Invalid status. Allowed values are 'Pending' or 'Accept'",
        400
      )
    );
  }
  //find the issue by id
  const issue = await Issue.findById(issueId);
  if (!issue) {
    return next(new CustomError("Issue not found", 404));
  }
  // Update the status
  issue.status = status;
  await issue.save();
  res.status(200).json({
    message: `Issue status updated to '${status}'`,
    issue,
  });
});

//get issues reported by the logged-in user
export const getUserIssues = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const issues = await Issue.find({ reportedBy: userId }).populate("laptopId");
  res.status(200).json({
    message: "User's issues retrieved successfully",
    issues,
  });
});
