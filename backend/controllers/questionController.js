import Question from "../models/questionModel.js";

export const addQuestionController = async (req, res) => {
  try {
    const { quizId, questionText, options, correctAnswer } = req.body;
    const question = await Question.create({
      quizId,
      questionText,
      options,
      correctAnswer,
    });
    res.status(200).send({ message: "Question Added Successfully", question });
  } catch (error) {
    console.log(error);
    res.status(500).send({ messsage: "Error in adding question" });
  }
};

export const updateQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { quizId, questionText, options, correctAnswer } = req.body;
    const question = await Question.findByIdAndUpdate(
      id,
      {
        quizId,
        questionText,
        options,
        correctAnswer,
      },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "Question Updated Successfully", question });
  } catch (error) {
    console.log(error);
    res.status(500).send({ messsage: "Error in updating question" });
  }
};

export const getAllQuestionsController = async (req, res) => {
  try {
    const questions = await Question.find({});
    res
      .status(200)
      .send({ message: "Questions Fetched Successfully", questions });
  } catch (error) {
    console.log(error);
    res.status(500).send({ messsage: "Error in adding question" });
  }
};

export const getQuestionByQuizController = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.id });
    res.status(200).send({
      message: "Questions Fetched Successfully",
      questions,
      count: questions.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ messsage: "Error in fetching question" });
  }
};

export const deleteQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    res
      .status(200)
      .send({ message: "Question Deleted Successfully", question });
  } catch (error) {
    console.log(error);
    res.status(500).send({ messsage: "Error in deleting question" });
  }
};
