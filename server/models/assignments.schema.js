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
    required: [true, "assigned date is required"],
    validate: {
      validator: function (value) {
        return !isNaN(value) && value > 0; // Ensure it's a valid number and greater than zero
      },
      message: "Invalid assigned date (epoch time must be a valid number)",
    },
  },
  returnedAt: {
    type: Number,
    required: [true, "returned date is required"],
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
};

const assignSchema = new mongoose.Schema(options, { timestamps: true });

const Assign = mongoose.model("Assign", assignSchema);

export { assignSchema };
export default Assign;
