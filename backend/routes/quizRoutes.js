import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createQuizController,
  deleteQuizController,
  getAllQuizes,
  getSingleQuiz,
  updateQuizController,
} from "../controllers/quizController.js";
const router = express.Router();

router.post("/create-quiz", requireSignIn, isAdmin, createQuizController);
router.get("/get-all-quizes", getAllQuizes);
router.get("/get-single-quiz/:id", getSingleQuiz);
router.put("/update-quiz/:id", requireSignIn, isAdmin, updateQuizController);
router.delete("/delete-quiz/:id", requireSignIn, isAdmin, deleteQuizController);

export default router;
