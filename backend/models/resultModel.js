import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: String,
      isCorrect: Boolean,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const Result = mongoose.model("result", resultSchema);
export default Result;
