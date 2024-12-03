import mongoose from "mongoose";

const options = {
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  laptopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
  },
  assignedAt: {
    type: Number,
    // required: [true, "assigned date is required"],
    validate: {
      validator: function (value) {
        return !isNaN(value) && value > 0; // Ensure it's a valid number and greater than zero
      },
      message: "Invalid assigned date (epoch time must be a valid number)",
    },
  },
  returnedAt: {
    type: Number,
    // required: [true, "returned date is required"],
    validate: {
      validator: function (value) {
        return !isNaN(value) && value > 0; // Ensure it's a valid number and greater than zero
      },
      message: "Invalid returned date (epoch time must be a valid number)",
    },
  },

  reqStatus: {
    type: Boolean,
    default: false,
  },
  statusType: {
    type: String,
    enum: ["pending", "success", "denied"],
    default: "pending",
  },
  deniedReason: {
    type: String,
    required: function () {
      return this.statusType === "denied"; // Make this field required only when statusType is 'denied'
    },
    minlength: [5, "Reason must be at least 5 characters long"],
    maxlength: [500, "Reason cannot exceed 500 characters"],
  },
};

const assignSchema = new mongoose.Schema(options, { timestamps: true });

const Assign = mongoose.model("Assign", assignSchema);

export { assignSchema };
export default Assign;
