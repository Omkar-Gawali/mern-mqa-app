import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    unqiue: true,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
});
const Quiz = mongoose.model("quiz", quizSchema);

export default Quiz;
