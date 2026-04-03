const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🔹 Return response (without password)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔹 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // optional but recommended
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;