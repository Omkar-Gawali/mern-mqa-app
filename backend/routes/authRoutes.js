import express from "express";
import {
  forgotPasswordController,
  getAllUsers,
  loginController,
  registerController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//REGISTER USER - POST
router.post("/register", registerController);

//LOGIN USER - POST
router.post("/login", loginController);

//FORGOT PASSWORD - PUT
router.put("/forgot-password", forgotPasswordController);

//Protected Routes
router.get("/verify-user", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/verify-admin", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//GET ALL USERS
router.get("/get-all-users", requireSignIn, isAdmin, getAllUsers);

export default router;
