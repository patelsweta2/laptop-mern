import Assign from "../models/assignments.schema.js";
import Laptop from "../models/laptops.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "../utils/customError.js";

/* Request for new laptop */
export const requestLaptop = catchAsyncError(async (req, res, next) => {
  const { reqType } = req.body;

  // Validate request type
  if (reqType !== "assignRequest") {
    return res.status(400).json({
      message: "Invalid request type. It must be 'assignRequest'.",
    });
  }

  const request = new Assign({
    employeeId: req.user.userId,
    reqType,
    statusType: "pending",
  });

  await request.save();

  res.status(201).json({
    message:
      "Laptop assignment request submitted successfully. Admin will review your request.",
    request,
  });
});

/* Return request for assign laptop */
export const returnLaptop = catchAsyncError(async (req, res, next) => {
  const { reqType, laptopId } = req.body;

  if (reqType !== "returnRequest") {
    return res.status(400).json({
      message: "Invalid request type. It must be 'returnRequest'.",
    });
  }

  // Validate assignId and laptopId
  if (!laptopId) {
    return res.status(400).json({
      message: "assignId and laptopId are required to return a laptop.",
    });
  }

  // Find the assignment record that matches both assignId and laptopId
  const assignRecord = await Assign.findOne({
    laptopId: laptopId,
    statusType: { $ne: "denied" },
  });

  // If the assignment record is not found
  if (!assignRecord) {
    return next(
      new CustomError(
        "Assignment record with the given laptopId not found.",
        404
      )
    );
  }

  if (!assignRecord.employeeId || !req.user || !req.user.userId) {
    return next(new CustomError("Invalid user or assignment record.", 400));
  }

  // Authorization check
  if (assignRecord.employeeId.toString() !== req.user.userId.toString()) {
    return next(
      new CustomError("You are not authorized to return this laptop.", 403)
    );
  }

  // Ensure the laptop has not already been returned
  if (assignRecord.returnedAt) {
    return next(new CustomError("Laptop has already been returned.", 400));
  }

  // Update the record for the return request
  assignRecord.reqType = "returnRequest";
  assignRecord.statusType = "pending";
  await assignRecord.save();

  // Send a response confirming the return request submission
  res.status(200).json({
    message:
      "Laptop return request submitted successfully. Admin will review your request.",
    assignRecord,
  });
});

/* Request accept or denied for new laptop */
export const handleAssignRequest = catchAsyncError(async (req, res, next) => {
  const { laptopId, deniedReason, reqType } = req.body;

  if (reqType !== "assignRequest") {
    return next(new CustomError("Invalid req type", 400));
  }

  // find the assignment record
  const request = await Assign.findById(req.params.id);
  if (!request) {
    return next(new CustomError("Request not found", 404));
  }

  //handle Denied
  if (deniedReason && deniedReason.trim().length >= 5) {
    request.statusType = "denied";
    request.deniedReason = deniedReason;
    await request.save();
    return res.status(200).json({
      message: "Assignment request has been denied.",
      request,
    });
  }

  // handle Acceptance
  if (!laptopId) {
    return next(
      new CustomError("Laptop ID is required to accept the request", 400)
    );
  }

  const laptop = await Laptop.findById(laptopId);
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }

  //check if the laptop is already assign
  if (laptop.status === "assigned" || laptop.status === "maintenance") {
    return next(
      new CustomError(
        "This laptop is already assigned or under maintenance",
        400
      )
    );
  }
  // update request and laptop status
  request.statusType = "success";
  request.laptopId = laptopId;
  request.assignedAt = new Date();
  laptop.status = "assigned";
  await Promise.all([request.save(), laptop.save()]);
  return res.status(200).json({
    message: "Laptop has been successfully assigned to the user.",
    request,
  });
});

/* Request accept or denied for return laptop */

export const handleReturnRequest = catchAsyncError(async (req, res, next) => {
  const { laptopId, deniedReason, reqType } = req.body;
  if (reqType !== "returnRequest") {
    return next(new CustomError("Invalid request type", 400));
  }

  // find the assignment record
  const request = await Assign.findById(req.params.id);
  if (!request) {
    return next(new CustomError("Request not found", 404));
  }

  // handle Denial
  if (deniedReason && deniedReason.trim().length >= 5) {
    request.statusType = "denied";
    request.deniedReason = deniedReason;
    await request.save();

    return res.status(200).json({
      message: "Return request has been denied.",
      request,
    });
  }
  // Handle Acceptance (Admin accepts the return request)
  if (!laptopId) {
    return next(
      new CustomError(
        "Laptop ID is required to process the return request",
        400
      )
    );
  }
  const laptop = await Laptop.findById(laptopId);
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }

  // update data
  laptop.status = "available";
  request.statusType = "success";
  request.returnedAt = new Date();
  await Promise.all([request.save(), laptop.save()]);
  return res.status(200).json({
    message: "Laptop has been successfully returned.",
    request,
  });
});

/* get assign request history */
export const getAllAssignHistory = catchAsyncError(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query; // Page number and limit from query params

  // Calculate the skip value (for pagination)
  const skip = (page - 1) * limit;

  // Fetch all assignments with pagination
  const totalRecords = await Assign.countDocuments(); // Total count of assignments
  const assignments = await Assign.find()
    .populate("employeeId", "-password -createdAt -updatedAt") // Exclude password, createdAt, and updatedAt
    .skip(skip)
    .limit(limit);

  // Return the assignments with employee info
  res.status(200).json({
    message: "All assign request histories fetched successfully.",
    histories: assignments,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
  });
});
