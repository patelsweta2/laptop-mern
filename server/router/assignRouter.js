import express from "express";
import {
  requestLaptop,
  returnLaptop,
  requestUpdate,
} from "../controller/assignController.js";
import { Authenticate, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to request a laptop
router.route("/requests").post(Authenticate, requestLaptop);

// Route to return a laptop
router.route("/requests/return/:requestId").put(Authenticate, returnLaptop);

// Route for admin to accept or deny a request
router
  .route("/requests/:requestId")
  .put(Authenticate, Authorize("admin"), requestUpdate);

export default router;
