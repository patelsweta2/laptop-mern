import express from "express";
import {
  reportIssue,
  getAllIssues,
  updateIssuesStatus,
  getUserIssues,
} from "../controller/issuesController.js";
import { authMiddleware, Authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to request issue for laptop
router.route("/report-issue").post(authMiddleware, reportIssue);

// Route to get all issues
router
  .route("/get-all-issues")
  .get(authMiddleware, Authorize("admin"), getAllIssues);

// Route for update issues
router
  .route("/update-issues/:id")
  .put(authMiddleware, Authorize("admin"), updateIssuesStatus);

// Route to get issues reported by the logged-in user
router.route("/user-issues").get(authMiddleware, getUserIssues);

export default router;
