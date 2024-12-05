import express from "express";
import {
  createLaptop,
  getAllLaptops,
  getLaptopById,
  updateLaptop,
  deleteLaptop,
} from "../controller/laptopController.js";
import { authMiddleware, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route for creating a new laptop
router.route("/create").post(authMiddleware, Authorize("admin"), createLaptop);

// Route for getting all laptops
router
  .route("/getLaptops")
  .get(authMiddleware, Authorize("admin"), getAllLaptops);

// Route for getting, updating, and deleting a laptop by id
router
  .route("/getLaptop/:id")
  .get(authMiddleware, Authorize("admin"), getLaptopById)
  .put(authMiddleware, Authorize("admin"), updateLaptop)
  .delete(authMiddleware, Authorize("admin"), deleteLaptop);

export default router;
