import express from "express";
import {
  signUp,
  login,
  getAllEmployees,
} from "../controller/userController.js";
import { Authenticate, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router
  .route("/employees")
  .get(Authenticate, Authorize("admin"), getAllEmployees);

export default router;
