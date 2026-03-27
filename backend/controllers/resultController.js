import mongoose from "mongoose";
import Result from "../models/resultModel.js";
import Question from "../models/questionModel.js";
import User from "../models/userModel.js";

export const getRandomQuestionsFromAllQuizesController = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const questions = await Question.aggregate([
      { $sample: { size: parseInt(limit) } },
    ]);
    res.status(200).send({
      success: true,
      message: "Questions Fetched Successfully",
      questions,
      count: questions.length,
    });
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------------------------------
export const getRandomQuestionControllers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const quizId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Quiz ID",
      });
    }

    console.log("Fetching questions for quizId:", quizId);

    const questions = await Question.aggregate([
      {
        $match: {
          quizId: new mongoose.Types.ObjectId(quizId),
        },
      },
      {
        $sample: { size: parseInt(limit) },
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
    ]);
    console.log("Fetched questions:", questions);

    res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching questions",
      error: error.message,
    });
  }
};
// --------------------------------------------------------------------------------

export const submitQuizController = async (req, res) => {
  try {
    const { userId, score, answers } = req.body;
    const result = await Result.create({ userId, score, answers });
    res.status(200).send({ message: "Quiz result saved successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error saving results", error });
  }
};

export const getResultsById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Result.find({ userId: id });
    res.status(200).send({
      success: true,
      message: "Results Fetched Successfully",
      results,
      count: results.length,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find({});
    res.status(200).send({
      success: true,
      message: "Results Fetched Successfully",
      results,
      count: results.length,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    const qText = question?.questionText;
    res
      .status(200)
      .send({ success: true, message: "Question Fetched Successfully", qText });
  } catch (error) {
    console.log(error);
  }
};

export const getUsername = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const userName = user.name;
    res.status(200).send({
      success: true,
      message: "User Name Fetched Successfully",
      userName,
    });
  } catch (error) {
    console.log(error);
  }
};
