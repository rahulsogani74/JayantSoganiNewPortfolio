const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match." });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists." });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashed });
  await newUser.save();

  res.status(201).json({ message: "Registration successful" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid Email and Password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({
    userId: user._id,
    name: user.name,
    token,
    message: "Login successful",
  });
});

// Logout (in-memory demo)
let activeSessions = {};

router.post("/logout", (req, res) => {
  const token = req.headers["token"];
  if (!token) return res.status(400).json({ error: "Token not provided" });

  if (activeSessions[token]) {
    delete activeSessions[token];
    return res.json({ message: "Successfully logged out" });
  }
  res.status(401).json({ error: "Invalid session" });
});

// Search
router.get("/search", async (req, res) => {
  const { term, view } = req.query;
  let results = [];

  if (view === "people") {
    results = await User.find({ name: { $regex: term, $options: "i" } });
  }

  res.json({ results });
});

module.exports = router;
