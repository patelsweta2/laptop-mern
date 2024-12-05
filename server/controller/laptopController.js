import Laptop from "../models/laptops.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "../utils/customError.js";

// Create a new laptop
export const createLaptop = catchAsyncError(async (req, res, next) => {
  const { brand, model, serialNumber, status, purchaseDate } = req.body;

  if (!brand || !model || !serialNumber || !purchaseDate) {
    return next(new CustomError("All fields are required", 400));
  }

  // Check if laptop with the same serial number already exists
  const existingLaptop = await Laptop.findOne({ serialNumber });
  if (existingLaptop) {
    return next(
      new CustomError("Laptop with this serial number already exists", 400)
    );
  }

  const newLaptop = new Laptop({
    brand,
    model,
    serialNumber,
    status,
    purchaseDate: new Date(purchaseDate), // Ensure it's a Date object
  });

  await newLaptop.save();

  res.status(201).json({
    success: true,
    message: "Laptop created successfully",
    laptop: newLaptop,
  });
});

// Get all laptops (with pagination)
export const getAllLaptops = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Aggregation pipeline to count total,available,maintenance, and issue laptops
  const laptopCounts = await Laptop.aggregate([
    {
      $facet: {
        totalLaptops: [{ $count: "total" }],
        availableLaptops: [
          { $match: { status: "available" } },
          { $count: "available" },
        ],
        maintenanceLaptops: [
          { $match: { status: "maintenance" } },
          { $count: "maintenance" },
        ],
        issueLaptops: [{ $match: { status: "issue" } }, { $count: "issue" }],
      },
    },
    {
      $project: {
        totalLaptops: { $arrayElemAt: ["$totalLaptops.total", 0] },
        availableLaptops: { $arrayElemAt: ["$availableLaptops.available", 0] },
        maintenanceLaptops: {
          $arrayElemAt: ["$maintenanceLaptops.maintenance", 0],
        },
        issueLaptops: { $arrayElemAt: ["$issueLaptops.issue", 0] },
      },
    },
  ]);
  const counts = laptopCounts[0];

  const laptops = await Laptop.find()
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    laptops,
    page,
    limit,
    totalLaptops: counts.totalLaptops || 0,
    availableLaptops: counts.availableLaptops || 0,
    maintenanceLaptops: counts.maintenanceLaptops || 0,
    issueLaptops: counts.issueLaptops || 0,
  });
});

// Get a specific laptop by serial number
export const getLaptopById = catchAsyncError(async (req, res, next) => {
  const laptop = await Laptop.findById(req.params.id); // Find by ID
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  res.status(200).json({
    success: true,
    laptop,
  });
});

// Update a laptop by serial number
export const updateLaptop = catchAsyncError(async (req, res, next) => {
  const { serialNumber, ...updateData } = req.body;
  const laptop = await Laptop.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  // Check if the laptop exists
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }

  // Respond with the updated laptop
  res.status(200).json({
    success: true,
    message: "Laptop updated successfully",
    laptop,
  });
});

// Delete a laptop by serial number
export const deleteLaptop = catchAsyncError(async (req, res, next) => {
  const laptop = await Laptop.findOneAndDelete(req.params.id);
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Laptop deleted successfully",
    laptop,
  });
});
