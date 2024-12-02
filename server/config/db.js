import mongoose from "mongoose";
// conecting to db
const connectDB = async (connectionStr) => {
  try {
    await mongoose.connect(connectionStr);
  } catch (error) {
    throw new Error(error);
  }
};

export default connectDB;
