const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// UPDATE PROGRESS
router.post("/update", async (req, res) => {
  const { userId, courseId, progress } = req.body;

  let record = await Progress.findOne({ user: userId, course: courseId });

  if (!record) {
    record = await Progress.create({
      user: userId,
      course: courseId,
      progress
    });
  } else {
    record.progress = progress;
    if (progress >= 100) record.completed = true;
    await record.save();
  }

  res.json(record);
});

// GET USER PROGRESS
router.get("/:userId", async (req, res) => {
  const data = await Progress.find({ user: req.params.userId })
    .populate("course");
    
  res.json(data);
});

module.exports = router;