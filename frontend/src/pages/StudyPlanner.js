import { useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

function StudyPlanner() {
  const [subjects, setSubjects] = useState("");
  const [hours, setHours] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const generatePlan = async () => {
    if (!subjects || !hours) {
      alert("Please fill all fields ⚠️");
      return;
    }

    if (!userId) {
      alert("Please login first ❌");
      return;
    }

    try {
      setLoading(true);
      setPlan(""); // clear previous plan

      const res = await API.post("/ai/study-plan", {
        userId,
        subjects,
        hours: Number(hours), // ✅ FIX: ensure number
      });

      setPlan(res.data.plan);
    } catch (err) {
      console.error(err);
      alert("Failed to generate plan ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* TITLE */}
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        AI Study Planner 📅
      </h2>

      {/* INPUTS */}
      <input
        placeholder="Enter subjects (e.g. AI, DSA)"
        value={subjects}
        onChange={(e) => {
          setSubjects(e.target.value);
          setPlan("");
        }}
        style={{
          padding: "12px",
          width: "100%",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="number"
        placeholder="Hours per day"
        value={hours}
        onChange={(e) => {
          setHours(e.target.value);
          setPlan("");
        }}
        style={{
          padding: "12px",
          width: "100%",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      {/* BUTTON */}
      <button
        onClick={generatePlan}
        disabled={loading}
        style={{
          padding: "12px 20px",
          background: loading ? "#888" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          width: "100%",
          transition: "0.2s ease",
        }}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {/* EMPTY STATE */}
      {!plan && !loading && (
        <p style={{ marginTop: "20px", color: "#777", textAlign: "center" }}>
          Enter subjects and hours to generate your personalized study plan 📚
        </p>
      )}

      {/* OUTPUT */}
      {plan && (
        <div
          style={{
            marginTop: "25px",
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            lineHeight: "1.8",
            transition: "all 0.3s ease",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            📌 Your Personalized Plan
          </h3>

          <hr style={{ margin: "10px 0", borderColor: "#eee" }} />

          <div style={{ color: "#444", fontSize: "15px" }}>
            <ReactMarkdown
  components={{
    h1: ({ children }) => (
      <h3 style={{ marginTop: "20px", color: "#2c3e50" }}>
        {children}
      </h3>
    ),

    h2: ({ children }) => (
      <h4
        style={{
          marginTop: "20px",
          background: "#f1f5f9",
          padding: "8px 12px",
          borderRadius: "6px",
          color: "#1e293b",
        }}
      >
        {children}
      </h4>
    ),

    p: ({ children }) => (
      <p style={{ marginBottom: "12px" }}>
        {children}
      </p>
    ),

    li: ({ children }) => (
      <li style={{ marginBottom: "8px" }}>
        {children}
      </li>
    ),

    strong: ({ children }) => (
      <strong style={{ color: "#16a34a" }}>
        {children}
      </strong>
    ),
  }}
>
  {plan}
</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyPlanner;