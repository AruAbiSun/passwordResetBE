import express from "express";
// import {
//   forgotPassword,
//   getUser,
//   loginUser,
//   registerUser,
//   resetPassword,
// } from "../Controllers/user.controller.js";
//import authMiddleware from "..auth.middleware.js";
import {
  forgotPassword,
  getUser,
  loginUser,
  registerUser,
  resetPassword,
} from "../Controllers/user.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/getuser", authMiddleware, getUser);

export default router;
