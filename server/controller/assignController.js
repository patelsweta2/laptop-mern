import Assign from "../models/assignments.schema.js";
import Laptop from "../models/laptops.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "../utils/customError.js";

//Request a laptop
export const requestLaptop = catchAsyncError(async (req, res, next) => {
  const request = new Assign({
    employeeId: req.user._id,
    reqStatus: true,
  });
  await request.save();
  res.status(201).json({
    message:
      "Laptop request submitted successfully. Admin will assign a laptop.",
    request,
  });
});

//Return a laptop
export const returnLaptop = catchAsyncError(async (req, res, next) => {
  const { assignId } = req.body;

  // Find the assignment record where employee has the laptop
  const assignRecord = await Assign.findById(assignId);
  if (!assignRecord) {
    return next(new CustomError("Assignment record not found", 404));
  }
  // Check if the logged-in user is the same as the employeeId in the record
  if (assignRecord.employeeId.toString() !== req.user._id.toString()) {
    return next(
      new CustomError("You are not authorized to return this laptop", 403)
    );
  }
  assignRecord.returnedAt = Date.now(); // Set the returned date to current time
  assignRecord.reqStatus = true;
  await assignRecord.save();
  res.status(200).json({
    message: "Laptop return assigned",
    assignRecord,
  });
});

// req accept or denied by admin
export const requestUpdate = catchAsyncError(async (req, res, next) => {
  const { requestId } = req.params;
  const { deniedReason, laptopId } = req.body; // Check if the reason for denial is provided

  // Find the request record by ID
  const request = await Assign.findById(requestId);

  // If the request is not found
  if (!request) {
    return next(new CustomError("Request not found", 404));
  }

  // If the request has already been accepted
  if (request.statusType === "success") {
    return next(new CustomError("This request has already been accepted", 400));
  }
  if (request.statusType === "denied") {
    return next(new CustomError("This request has already been denied", 400));
  }

  // Handle Denial
  if (deniedReason && deniedReason.trim().length >= 5) {
    request.reqStatus = false;
    request.statusType = "denied";
    request.deniedReason = deniedReason;
    await request.save();

    return res.status(200).json({
      message: "Your request has been denied.",
      request,
    });
  }

  // Handle Acceptance
  if (!laptopId) {
    return next(
      new CustomError("Laptop ID is required to accept the request", 400)
    );
  }
  // Fetch the laptop record
  const laptop = await Laptop.findById(laptopId);
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  // Check if the laptop is already assigned
  if (laptop.status === "Assigned") {
    return next(
      new CustomError("This laptop is already assigned to another user", 400)
    );
  }

  // Handle Acceptance
  request.reqStatus = false; // Set reqStatus to false after acceptance
  request.statusType = "success";
  request.laptopId = laptopId;
  request.assignedAt = new Date();
  laptop.status = "Assigned";
  await Promise.all([request.save(), laptop.save()]);

  res.status(200).json({
    message: "Congratulations! Your request has been accepted.",
    request,
  });
});
