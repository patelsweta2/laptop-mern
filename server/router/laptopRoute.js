import express from "express";
import {
  createLaptop,
  getAllLaptops,
  getLaptopBySerialNumber,
  updateLaptop,
  deleteLaptop,
} from "../controller/laptopController.js";
import { Authenticate, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route for creating a new laptop
router.route("/laptop").post(Authenticate, Authorize("admin"), createLaptop);

// Route for getting all laptops
router.route("/laptops").get(Authenticate, Authorize("admin"), getAllLaptops);

// Route for getting, updating, and deleting a laptop by serial number
router
  .route("/laptop/:serialNumber")
  .get(Authenticate, Authorize("admin"), getLaptopBySerialNumber)
  .put(Authenticate, Authorize("admin"), updateLaptop)
  .delete(Authenticate, Authorize("admin"), deleteLaptop);

export default router;
