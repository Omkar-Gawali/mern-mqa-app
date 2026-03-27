import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    //check if admin or not
    if (user.role !== 1) {
      return res.status(500).send({
        success: "false",
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({ success: "false", error: error.message });
  }
};
