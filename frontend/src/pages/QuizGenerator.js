import { useState } from "react";
import API from "../services/api";

function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const generateQuiz = async () => {
    if (!topic) return;

    try {
      const res = await API.post("/ai/quiz", { topic });

      const cleanText = res.data.quiz
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^[^[]*/, ""); // ✅ FIXED HERE

      const parsed = JSON.parse(cleanText);

      setQuiz(parsed);
      setAnswers({});
      setScore(null);
    } catch (err) {
      console.error(err);
      alert("Error generating quiz");
    }
  };

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const submitQuiz = () => {
    let s = 0;

    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) s++;
    });

    setScore(s);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>AI Quiz Generator 🎯</h2>

      <input
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          padding: "10px",
          width: "60%",
          marginRight: "10px",
        }}
      />

      <button onClick={generateQuiz}>Generate Quiz</button>

      {/* QUIZ */}
      {quiz.map((q, i) => (
        <div key={i} style={{ marginTop: "20px" }}>
          <p><b>Q{i + 1}:</b> {q.question}</p>

          {q.options.map((opt, j) => {
            const isSelected = answers[i] === opt;
            const isCorrect = q.answer === opt;

            return (
              <div key={j}>
                <input
                  type="radio"
                  name={`q-${i}`}
                  onChange={() => handleSelect(i, opt)}
                />

                <span
                  style={{
                    color:
                      score !== null
                        ? isCorrect
                          ? "green"
                          : isSelected
                          ? "red"
                          : "black"
                        : "black",
                    fontWeight: isCorrect ? "bold" : "normal",
                  }}
                >
                  {opt}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {/* SUBMIT */}
      {quiz.length > 0 && (
        <button
          onClick={submitQuiz}
          style={{ marginTop: "20px" }}
        >
          Submit
        </button>
      )}

      {/* SCORE */}
      {score !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Score: {score} / {quiz.length}</h3>

          <p>
            {score === quiz.length
              ? "🔥 Perfect!"
              : score > quiz.length / 2
              ? "👍 Good job!"
              : "📚 Keep practicing!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizGenerator;