const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI TEACHER CHAT
router.post("/ask", async (req, res) => {
  const { question } = req.body;

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
      model: "llama-3.1-8b-instant" 
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
});
// AI NOTES GENERATOR
router.post("/notes", async (req, res) => {
  const { topic } = req.body;

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

module.exports = router;