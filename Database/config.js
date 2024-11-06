import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDBConnectionString = process.env.MONGODBCONNECTIONSTRING;
const connectDB = async () => {
  try {
    console.log("connection string", mongoDBConnectionString);
    const connection = await mongoose.connect(mongoDBConnectionString);
    console.log("connected to the mongoDB");
    return connection;
    //in real time we may use connection.on or some thing else for that reason we here use return.
  } catch (error) {
    console.log("error", error);
  }
};

export default connectDB;
