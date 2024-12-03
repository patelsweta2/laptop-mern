import mongoose from "mongoose";

const options = {
  laptopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: [5, "Description must be at least 5 characters long"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accept"],
    default: "Pending",
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: [0, "Cost cannot be negative"],
  },
  loggedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
};

const maintenanceSchema = new mongoose.Schema(options, { timestamps: true });

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export { maintenanceSchema };
export default Maintenance;
