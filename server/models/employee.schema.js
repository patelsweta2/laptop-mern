import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const departments = [
  "IT Support",
  "Development",
  "QA",
  "HR",
  "Microsoft",
  "Hospitality",
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
    enum: departments,
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: "Employee",
  },
};

const userSchema = new mongoose.Schema(options);
