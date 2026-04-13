const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");

//  CREATE COURSE (ADMIN ONLY) 
router.post(
  "/create",
  auth,
  admin,

  //  VALIDATION RULES
  [
    body("title").notEmpty().withMessage("Title required"),
    body("description").notEmpty().withMessage("Description required"),
  ],

  async (req, res) => {

    //  CHECK ERRORS
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

    res.json(course);
  }
);

//  ADD MODULE (ADMIN ONLY) 
router.post("/add-module/:courseId", auth, admin, async (req, res) => {
  const { title } = req.body;

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  course.modules.push({ title, lessons: [] });

  await course.save();

  res.json(course);
});

//  ADD LESSON (ADMIN ONLY) 
router.post("/add-lesson/:courseId/:moduleIndex", auth, admin, async (req, res) => {
  const { title, content } = req.body;

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const module = course.modules[req.params.moduleIndex];

  if (!module) {
    return res.status(404).json({ error: "Module not found" });
  }

  module.lessons.push({
    title,
    content,
  });

  await course.save();

  res.json(course);
});

//  GET ALL COURSES 
router.get("/", async (req, res) => {
  try {
const courses = await Course.find().populate("students", "-password");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

//  ENROLL IN COURSE 
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
// GET USER ENROLLED COURSES
router.get("/my-courses/:userId", async (req, res) => {
  const courses = await Course.find({
    students: req.params.userId
  });

  res.json(courses);
});

// EXPORT 
module.exports = router;