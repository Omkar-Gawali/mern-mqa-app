import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true, // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Basic email format validation
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [8, "Password must be at least 8 characters long"], // Minimum length for password
    },
    phone: {
      type: String,
      required: [true, "Phone is Required"],
      unique: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits long"], // Regex for 10-digit phone number
    },
    answer: {
      type: String,
      required: true,
      minlength: [4, "Answer must be at least 3 characters long"], // Minimum length for answer
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User ", userSchema);

export default User;
