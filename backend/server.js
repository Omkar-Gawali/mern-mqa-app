import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import dbConnect from "./config/db.js";

//Config
dotenv.config();

//REST OBJECT
const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//REST API
app.get("/", (req, res) => {
  res.status(200).send("MQA-2025 Developed By Omkar Gawali");
});

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/result", resultRoutes);

//PORT
const PORT = process.env.PORT;
//LISTEN
app.listen(PORT, () => {
  console.log(`MQA-2025 Application Running On Port ${PORT}`.bgYellow);
});

dbConnect();
