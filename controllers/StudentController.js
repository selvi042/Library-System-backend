const express = require("express");
const router = express.Router();
const Students = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//add student ../models/StudentModel
const addStudent = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new Students(req.body);
    const student = await newuser.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Students.findOne({ email: email });
    if (!student) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }
    const token = jwt.sign({ userUd: student._id }, JWT_SECRET, {
      expiresIn: "1hr",
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error signing, error: ", error });
  }
};

module.exports = {
  addStudent,
  loginUser,
};
