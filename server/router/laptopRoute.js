import express from "express";
import {
  createLaptop,
  getAllLaptops,
  getLaptopBySerialNumber,
  updateLaptop,
  deleteLaptop,
} from "../controller/laptopController.js";
import { Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/laptop").post(Authorize("admin"), createLaptop);
router.route("/laptops").get(Authorize("admin"), getAllLaptops);
router
  .route("/laptop/:serialNumber")
  .get(Authorize("admin"), getLaptopBySerialNumber);
router.route("/laptop/:serialNumber").put(Authorize("admin"), updateLaptop);
router.route("/laptop/:serialNumber").delete(Authorize("admin"), deleteLaptop);

export default laptop;
