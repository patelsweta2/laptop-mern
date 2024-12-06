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
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    required: true,
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    required: true,
    default: "Pending",
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
};

const issueSchema = new mongoose.Schema(options, { timestamps: true });

const Issue = mongoose.model("Issue", issueSchema);
export { issueSchema };
export default Issue;
