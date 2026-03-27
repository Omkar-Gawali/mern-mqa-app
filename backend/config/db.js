import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Successfully Connected to ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
