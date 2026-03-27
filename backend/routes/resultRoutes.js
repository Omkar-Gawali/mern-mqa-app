import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getRandomQuestionsFromAllQuizesController,
  getRandomQuestionControllers,
  getQuestionById,
  getUsername,
  getResultsById,
  getAllResults,
  submitQuizController,
} from "../controllers/resultController.js";

const router = express.Router();

// --------------------------------------------------------------------------------
router.get(
  "/random-questions-all-quizes",
  requireSignIn,
  getRandomQuestionsFromAllQuizesController
);
// --------------------------------------------------------------------------------
router.get(
  "/random-questions/:id",
  requireSignIn,
  getRandomQuestionControllers
);
// --------------------------------------------------------------------------------

router.post("/submit-quiz", requireSignIn, submitQuizController);
router.get("/get-all-results", requireSignIn, getAllResults);
router.get("/get-results/:id", requireSignIn, getResultsById);
router.get("/get-question-text/:id", requireSignIn, getQuestionById);
router.get("/get-username/:id", requireSignIn, getUsername);

export default router;
