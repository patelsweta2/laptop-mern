import express from "express";
import {
  requestLaptop,
  returnLaptop,
  handleAssignRequest,
  handleReturnRequest,
} from "../controller/assignController.js";
import { authMiddleware, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to request a new laptop
router.route("/request-laptop").post(authMiddleware, requestLaptop);

// Route to request for return laptop
router.route("/return-laptop").post(authMiddleware, returnLaptop);

// Route for handling assignment requests (approve/deny)
router
  .route("/handle-assign-request/:id")
  .put(authMiddleware, Authorize("admin"), handleAssignRequest);

// Route for admin to accept or deny a request
router
  .route("/handle-return-request/:id")
  .put(authMiddleware, Authorize("admin"), handleReturnRequest);

export default router;
