import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const departments = [
  "IT",
  "Development",
  "QA",
  "HR",
  "finance",
  "marketing",
  "Microsoft",
  "Hospitality",
  "dataManagement",
];
const roles = ["admin", "employee"];

const options = {
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (v) => emailRegex.test(v),
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password should have 8 characters"],
  },
  department: {
    type: String,
    enum: {
      values: departments,
      message: `value as department not supported`,
    },
    required: true,
  },
  role: {
    type: String,
    enum: {
      values: roles,
      message: "value as role not supported",
    },
    default: "employee",
  },
};

const userSchema = new mongoose.Schema(options, { timestamps: true });

// Pre-save middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
});

// Methods
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

//getJwtToken
userSchema.methods.getJwtToken = async function () {
  try {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  } catch (error) {
    console.error("Error generating JWT:", error.message);
    throw new Error("Token generation failed");
  }
};

const User = mongoose.model("User", userSchema);

userSchema.index({ email: 1 });
export { userSchema };
export default User;
