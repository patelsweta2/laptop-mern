import express from "express";
import {
  createLaptop,
  getAllLaptops,
  getLaptopBySerialNumber,
  updateLaptop,
  deleteLaptop,
} from "../controller/laptopController.js";
import { Authenticate } from "../middleware/authMiddleware.js";
import { Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/laptop").post(Authenticate, Authorize("admin"), createLaptop);
router.route("/laptops").get(Authenticate, Authorize("admin"), getAllLaptops);
router
  .route("/laptop/:serialNumber")
  .get(Authenticate, Authorize("admin"), getLaptopBySerialNumber);
router
  .route("/laptop/:serialNumber")
  .put(Authenticate, Authorize("admin"), updateLaptop);
router
  .route("/laptop/:serialNumber")
  .delete(Authenticate, Authorize("admin"), deleteLaptop);

export default router;
