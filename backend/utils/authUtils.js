import bcrypt from "bcrypt";
export const hashPassword = (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};
export const hashAnswer = (answer) => {
  try {
    const saltRounds = 10;
    const hashedAnswer = bcrypt.hash(answer, saltRounds);
    return hashedAnswer;
  } catch (error) {
    console.log(error);
  }
};
export const comparePassword = (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};
export const compareAnswer = (answer, hashedAnswer) => {
  try {
    return bcrypt.compare(answer, hashedAnswer);
  } catch (error) {
    console.log(error);
  }
};
