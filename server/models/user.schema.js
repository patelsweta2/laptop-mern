import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { argon2 } from "argon2";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const departments = [
  "IT Support",
  "Development",
  "QA",
  "HR",
  "Microsoft",
  "Hospitality",
  "dataManagement",
];
const roles = ["Admin", "Employee"];

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
      message: "{value} as department not supported",
    },
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: "Employee",
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

userSchema.methods.getAccessJwtToken = function () {
  try {
    return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME,
    });
  } catch (err) {
    console.error("Error generating access token:", err);
    return null;
  }
};

userSchema.methods.getRefreshJwtToken = function () {
  try {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
    });
  } catch (err) {
    console.error("Error generating refresh token:", err);
    return null;
  }
};

const User = mongoose.model("User", userSchema);

export { userSchema };
export default User;
