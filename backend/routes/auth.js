const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");


// ================= REGISTER =================
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Min 6 chars password"),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      // ✅ Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "student",
      });

      // 🔐 REMOVE PASSWORD FROM RESPONSE
      const { password: pwd, ...userData } = user._doc;

      res.status(201).json(userData);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // include role 👑
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔐 REMOVE PASSWORD FROM RESPONSE
    const { password: pwd, ...userData } = user._doc;

    res.json({
      token,
      user: userData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;