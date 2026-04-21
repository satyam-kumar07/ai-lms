const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const mongoose = require("mongoose");
const Progress = require("../models/Progress");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ================= AI TEACHER =================
router.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful teacher who explains concepts simply.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
});


// ================= NOTES GENERATOR =================
router.post("/notes", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful teacher. Create clear, structured notes with headings, bullet points, and examples.",
        },
        {
          role: "user",
          content: `Generate study notes for: ${topic}`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({
      notes: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});


// ================= QUIZ GENERATOR =================
router.post("/quiz", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Generate 5 MCQs in STRICT JSON format like: [{\"question\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"answer\":\"\"}]",
        },
        {
          role: "user",
          content: `Create quiz for: ${topic}`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({
      quiz: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});


// ================= STUDY PLANNER =================
router.post("/study-plan", async (req, res) => {
  const { userId, subjects, hours } = req.body;

  // ✅ VALIDATION
  if (!userId || !subjects || !hours) {
    return res.status(400).json({ error: "All fields required" });
  }

  // ✅ VALID OBJECT ID CHECK
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const progressData = await Progress.find({ user: userId }).populate("course");

    // ✅ HANDLE EMPTY OR BROKEN DATA
    let summary = "No progress data available";

    if (progressData.length > 0) {
      summary = progressData
        .filter(p => p.course) // remove broken references
        .map((p) => {
          const title = p.course?.title || "Unknown Course";
          return `${title}: ${p.progress}% completed`;
        })
        .join(", ");
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI study planner. Analyze user progress and create a personalized study plan with priorities, weak areas, and time allocation.",
        },
        {
          role: "user",
          content: `Subjects: ${subjects}, Hours: ${hours}, Progress: ${summary}`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({
      plan: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error("STUDY PLAN ERROR:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;