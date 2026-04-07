const mongoose = require("mongoose");

// LESSON SCHEMA
const lessonSchema = new mongoose.Schema({
  title: String,
  content: String
});

// MODULE SCHEMA
const moduleSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema]
});

// COURSE SCHEMA
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  modules: [moduleSchema],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);