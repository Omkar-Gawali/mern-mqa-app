import validator from "validator";
import User from "../models/userModel.js";
import JWT from "jsonwebtoken";
import {
  compareAnswer,
  comparePassword,
  hashAnswer,
  hashPassword,
} from "../utils/authUtils.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, answer } = req.body;

    // Input Validations
    if (!name || !email || !password || !phone || !answer) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email format." });
    }

    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).send({
        success: false,
        message: "Phone number must be 10 digits long.",
      });
    }

    // Check for Existing User
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .send({ success: false, message: "User  already exists." });
    }

    // Hash Password and Answer
    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashAnswer(answer);

    // Create User

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      answer: hashedAnswer,
    });

    res
      .status(202)
      .send({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "User  registration failed",
      error: error.message || "Internal Server Error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check for Existing User
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(501)
        .send({ success: false, message: "User Not Found" });
    }
    //Comapre Password
    const compare = await comparePassword(password, user.password);

    if (!compare) {
      return res
        .status(501)
        .send({ success: false, message: "Incorrect Username or Password" });
    }
    //Generate Token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "User Logged In Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User Login Failed",
      error: error.message,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res
        .status(401)
        .send({ success: false, message: "Email is Required" });
    }
    if (!answer) {
      return res
        .status(401)
        .send({ success: false, message: "Answer is Required" });
    }
    if (!newPassword) {
      return res
        .status(401)
        .send({ success: false, message: "New Password is Required" });
    }
    //Check for existing user
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User Doesn't Exists" });
    }
    //compare passwords
    const match = await compareAnswer(answer, user.answer);
    if (!match) {
      return res
        .status(401)
        .send({ success: false, message: "Please Enter Valid Answer" });
    }
    //Hash New Password
    const newHashedPassword = await hashPassword(newPassword);
    user = await User.findByIdAndUpdate(user._id, {
      password: newHashedPassword,
    });
    res
      .status(200)
      .send({ success: true, message: "Password Reset Successfully", user });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to Reset Password",
      error: error.message,
    });
  }
};

//Admin Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "Successfully Fetched All Users",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed To Fetch All Users",
      error: error.messages,
    });
  }
};
