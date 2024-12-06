import express from "express";
import {
  addToMaintenance,
  removeFromMaintenance,
} from "../controller/maintenanceController.js"; // Make sure the controller path is correct
import { authMiddleware, Authorize } from "../middleware/authMiddleware.js"; // If needed for authorization

const router = express.Router();

// Route to add laptop to maintenance
router
  .route("/add-to-maintenance")
  .post(authMiddleware, Authorize("admin"), addToMaintenance);

// Route to remove laptop from maintenance
router
  .route("/remove-from-maintenance/:maintenanceId")
  .delete(authMiddleware, Authorize("admin"), removeFromMaintenance);

export default router;
