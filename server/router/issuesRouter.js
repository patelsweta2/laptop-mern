import express from "express";

import { Authenticate, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to request a laptop
router.route().post(Authenticate);

// Route to return a laptop
router.route().put(Authenticate);

// Route for admin to accept or deny a request
router.route().put(Authenticate, Authorize("admin"));

export default router;
