import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  addQuestionController,
  deleteQuestionController,
  getAllQuestionsController,
  getQuestionByQuizController,
  updateQuestionController,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/add-question", requireSignIn, isAdmin, addQuestionController);
router.put(
  "/update-question/:id",
  requireSignIn,
  isAdmin,
  updateQuestionController
);

router.delete(
  "/delete-question/:id",
  requireSignIn,
  isAdmin,
  deleteQuestionController
);

router.get(
  "/get-all-questions",
  requireSignIn,
  isAdmin,
  getAllQuestionsController
);
router.get(
  "/get-question/:id",
  requireSignIn,
  isAdmin,
  getQuestionByQuizController
);
export default router;
