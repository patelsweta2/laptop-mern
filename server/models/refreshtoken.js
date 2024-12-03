import mongoose from "mongoose";
import ensureIndex from "../utils/ensureIndex.js";
const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  refreshToken: {
    type: String,
    required: [true, "RefreshToken is required"],
    minLength: [12, "RefreshToken should have 12 characters"],
  },
  expireAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 1000), // 30 days form now
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
// creating index if not created
if (process.env.NODE_ENV === "development") {
  const indexObj1 = { expireAt: 1 };
  const options = { expireAfterSeconds: 0 };
  const indexObj2 = { userId: 1 };
  const indexObj3 = { refreshToken: 1, userId: 1 };
  // index will be created one time only
  ensureIndex(RefreshToken, refreshTokenSchema, indexObj1, options);
  ensureIndex(RefreshToken, refreshTokenSchema, indexObj2);
  ensureIndex(RefreshToken, refreshTokenSchema, indexObj3);
}
export default RefreshToken;
