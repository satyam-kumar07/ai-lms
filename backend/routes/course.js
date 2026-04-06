const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// CREATE COURSE
router.post("/create", auth, admin, async (req, res) => {
  const { title, description, instructor } = req.body;

  const course = await Course.create({
    title,
    description,
    instructor,
  });

  res.json(course);
});

// GET ALL COURSES
router.get("/", async (req, res) => {
  const courses = await Course.find().populate("students", "-password");
  res.json(courses);
});

// ENROLL IN COURSE (UPDATED)
router.post("/enroll/:courseId/:userId", async (req, res) => {
  const { courseId, userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid Course ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (!course.students.includes(userId)) {
      course.students.push(userId);
      await course.save();
    }

    res.json({ message: "Enrolled successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ KEEP THIS LINE
module.exports = router;