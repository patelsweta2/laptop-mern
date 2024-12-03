import mongoose from "mongoose";

const options = {
  brand: {
    type: String,
    required: [true, "Brand name is required"],
    minlength: [3, "Brand name should have 3 characters"],
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
    enum: ["available", "assigned", "maintenance"],
    default: "available",
  },
  purchaseDate: {
    type: Number,
    required: [true, "Purchase date is required"],
    validate: {
      validator: function (value) {
        return !isNaN(value) && value > 0; // Ensure it's a valid number and greater than zero
      },
      message: "Invalid purchase date (epoch time must be a valid number)",
    },
  },
};

const laptopSchema = new mongoose.Schema(options, { timestamps: true });

const Laptop = mongoose.model("Laptop", laptopSchema);

export default Laptop;
