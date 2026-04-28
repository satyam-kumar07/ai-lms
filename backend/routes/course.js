const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");


// ================= CREATE COURSE =================
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title required"),
    body("description").notEmpty().withMessage("Description required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, instructor } = req.body;

      const course = await Course.create({
        title,
        description,
        instructor,
      });

      res.status(201).json({
        message: "Course created successfully",
        course,
      });

    } catch (err) {
      console.error("CREATE COURSE ERROR:", err);
      res.status(500).json({ error: "Failed to create course" });
    }
  }
);


// ================= ADD MODULE =================
router.post("/add-module/:courseId", auth, async (req, res) => {
  try {
    const { title } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.modules.push({ title, lessons: [] });

    await course.save();

    res.json({
      message: "Module added",
      course,
    });

  } catch (err) {
    console.error("ADD MODULE ERROR:", err);
    res.status(500).json({ error: "Failed to add module" });
  }
});


// ================= ADD LESSON =================
router.post("/add-lesson/:courseId/:moduleIndex", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const module = course.modules[req.params.moduleIndex];

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    module.lessons.push({ title, content });

    await course.save();

    res.json({
      message: "Lesson added",
      course,
    });

  } catch (err) {
    console.error("ADD LESSON ERROR:", err);
    res.status(500).json({ error: "Failed to add lesson" });
  }
});


// ================= GET ALL COURSES =================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("students", "-password");

    res.json(courses);

  } catch (err) {
    console.error("GET COURSES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});


// ================= ENROLL =================
router.post("/enroll/:courseId/:userId", async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ✅ FIX: Proper ObjectId comparison
    const alreadyEnrolled = course.students.some(
      (student) => student.toString() === userId
    );

    if (!alreadyEnrolled) {
      course.students.push(userObjectId);
      await course.save();
    }

    res.json({ message: "Enrolled successfully" });

  } catch (err) {
    console.error("ENROLL ERROR:", err);
    res.status(500).json({ error: "Enroll failed" });
  }
});


// ================= USER COURSES =================
router.get("/my-courses/:userId", async (req, res) => {
  try {
    const courses = await Course.find({
      students: req.params.userId,
    });

    res.json(courses);

  } catch (err) {
    console.error("MY COURSES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch user courses" });
  }
});

module.exports = router;