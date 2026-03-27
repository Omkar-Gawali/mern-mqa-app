import slugify from "slugify";
import Quiz from "../models/quizModel.js";

export const createQuizController = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res
        .status(401)
        .send({ success: false, message: "Category Name is Required" });
    }
    const quiz = await Quiz.create({ title, slug: slugify(title) });
    res.status(200).send({
      success: true,
      message: "Quiz Created Successfully",
      quiz,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed To Create Quiz",
      error: error.message,
    });
  }
};

export const getAllQuizes = async (req, res) => {
  try {
    const quizes = await Quiz.find({});
    res.status(200).send({
      success: true,
      message: "Successfully Fetched All Quizes",
      quizes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed To Fetch All Quizes",
      error: error.message,
    });
  }
};

export const getSingleQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    res.status(200).send({
      success: true,
      message: "Successfully Fetched Single Quiz",
      quiz,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed To Fetch Single Quiz",
      error: error.message,
    });
  }
};
export const updateQuizController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title: title,
        slug: slugify(title),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Quiz Updated Successfully",
      quiz,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed To Update Quiz",
      error: error.message,
    });
  }
};

export const deleteQuizController = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Quiz Deleted Successfully",
      quiz,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed To Delete Quiz",
      error: error.message,
    });
  }
};
