import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import userRouter from "./Router/user.router.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
//const PORT = 4000;
const port = process.env.PORT;
connectDB();

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log("App is running on the port -", port);
});
