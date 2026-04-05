const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);