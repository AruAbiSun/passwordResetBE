import User from "../Models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    const resetUrl = `https://zippy-stardust-9c7ccb.netlify.app/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "password reset request",
      html: `<p>click <a href="${resetUrl}">here</a> to reset your password. This link is expires in 1 hour</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "password reset link sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500), json({ message: "error sending reset link" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "token and password are required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({ message: "password has been reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "invalid or expired token" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    const newUser = new User({ userName, email, password: hashPassword, role });
    //console.log(newUser);

    await newUser.save();

    res.status(200).json({ message: "Register Successful", data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Register Failed, Internal Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // if we need to store the token in db we follow the following two steps
    user.token = token;
    await user.save();

    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login Failed, Internal Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json({ message: "authorized user", data: [user] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};
