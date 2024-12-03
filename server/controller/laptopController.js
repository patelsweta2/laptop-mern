import Laptop from "../models/laptops.schema.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import CustomError from "../utils/customError.js";

// Create a new laptop
export const createLaptop = catchAsyncError(async (req, res, next) => {
  const { brand, model, serialNumber, status, purchaseDate } = req.body;

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
    purchaseDate,
  });
  await newLaptop.save();
  res.status(201).json({ message: "Laptop created successfully", newLaptop });
});

// Get all laptops
export const getAllLaptops = catchAsyncError(async (req, res) => {
  const laptops = await Laptop.find();
  res.status(200).json(laptops);
});

// Get a specific laptop by serial number
export const getLaptopBySerialNumber = catchAsyncError(
  async (req, res, next) => {
    const laptop = await Laptop.findOne({
      serialNumber: req.params.serialNumber,
    });
    if (!laptop) {
      return next(new CustomError("Laptop not found", 404));
    }
    res.status(200).json(laptop);
  }
);

// Update a laptop by serial number
export const updateLaptop = catchAsyncError(async (req, res, next) => {
  const laptop = await Laptop.findOneAndUpdate(
    { serialNumber: req.params.serialNumber },
    req.body,
    { new: true, runValidators: true }
  );
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  res.status(200).json({ message: "Laptop updated successfully", laptop });
});

// Delete a laptop by serial number
export const deleteLaptop = catchAsyncError(async (req, res, next) => {
  const laptop = await Laptop.findOneAndDelete({
    serialNumber: req.params.serialNumber,
  });
  if (!laptop) {
    return next(new CustomError("Laptop not found", 404));
  }
  res.status(200).json({ message: "Laptop deleted successfully", laptop });
});
