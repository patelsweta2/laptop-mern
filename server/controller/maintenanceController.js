import Maintenance from "../models/maintenance.schema.js";
import Laptop from "../models/laptops.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "../utils/customError.js";

// Add laptop to maintenance
export const addToMaintenance = catchAsyncError(async (req, res, next) => {
  const { laptopId, description, cost } = req.body;
  // Check if the laptop exists
  const laptop = await Laptop.findById(laptopId);
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  // Create a new maintenance record
  const maintenance = await Maintenance.create({
    laptopId,
    description,
    cost,
    status: "Pending",
  });
  // Update laptop's status to indicate it is under maintenance
  laptop.status = "Maintenance";
  await laptop.save();

  res.status(201).json({
    success: true,
    message: "Laptop added to maintenance successfully.",
    maintenance,
  });
});

//Remove from maintenance
export const removeFromMaintenance = catchAsyncError(async (req, res, next) => {
  const { maintenanceId } = req.params;

  // Find the maintenance record
  const maintenance = await Maintenance.findById(maintenanceId);
  if (!maintenance) {
    return next(new CustomError("Maintenance record not found", 404));
  }
  // Find the associated laptop
  const laptop = await Laptop.findById(maintenance.laptopId);
  if (!laptop) {
    return next(new CustomError("Associated laptop not found", 404));
  }
  // Update laptop's status to 'Available'
  laptop.status = "Available";
  await laptop.save();
  // Delete the maintenance record
  await maintenance.deleteOne();
  res.status(200).json({
    success: true,
    message: "Laptop removed from maintenance successfully.",
  });
});

//view all laptop under maintenance
export const getLaptopsUnderMaintenance = catchAsyncError(
  async (req, res, next) => {
    // Find all maintenance records with status 'Pending'
    const maintenanceRecords = await Maintenance.find({
      status: "Pending",
    }).populate("laptopId", "name status");
    res.status(200).json({
      success: true,
      message: "Laptops currently under maintenance retrieved successfully.",
      data: maintenanceRecords,
    });
  }
);
