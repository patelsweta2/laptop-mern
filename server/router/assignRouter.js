import express from "express";
import {
  requestLaptop,
  returnLaptop,
  requestUpdate,
} from "../controller/assignController.js";
import { authMiddleware, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to request a laptop
router.route("/requests").post(authMiddleware, requestLaptop);

// Route to return a laptop
router.route("/requests/return/:requestId").put(authMiddleware, returnLaptop);

// Route for admin to accept or deny a request
router
  .route("/requests/:requestId")
  .put(authMiddleware, Authorize("admin"), requestUpdate);

export default router;
