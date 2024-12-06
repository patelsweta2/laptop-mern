import mongoose from "mongoose";

const laptopStatus = ["available", "assigned", "maintenance"];

const options = {
  brand: {
    type: String,
    required: [true, "Brand name is required"],
    minlength: [2, "Brand name should have 2 characters"],
  },
  model: {
    type: String,
    required: [true, "Model name is required"],
  },
  serialNumber: {
    type: String,
    required: [true, "Serial number is required"],
    unique: true,
  },
  status: {
    type: String,
    enum: laptopStatus,
    default: "available",
    validate: {
      validator: function (value) {
        // Add custom logic for validation
        const validStatuses = ["available", "assigned", "maintenance"];
        return validStatuses.includes(value);
      },
      message: (props) => `${props.value} is not a valid status!`,
    },
  },
  purchaseDate: {
    type: Date, // Use Date type for normal date
    required: [true, "Purchase date is required"], // Validation message for required field
    validate: {
      validator: function (value) {
        return value instanceof Date && !isNaN(value); // Ensure the value is a valid Date
      },
      message: "Invalid purchase date (must be a valid date)", // Custom error message
    },
  },
};

const laptopSchema = new mongoose.Schema(options, { timestamps: true });

const Laptop = mongoose.model("Laptop", laptopSchema);

export default Laptop;
