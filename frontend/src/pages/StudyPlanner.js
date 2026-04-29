import { useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

function StudyPlanner() {
  const [subjects, setSubjects] = useState("");
  const [hours, setHours] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    const userId = localStorage.getItem("userId"); // ✅ FIX: move inside

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
      setPlan("");

      console.log("Sending payload:", {
        userId,
        subjects,
        hours,
      }); 

      const res = await API.post("/ai/study-plan", {
        userId,
        subjects,
        hours: Number(hours),
      });

      console.log("PLAN RESPONSE:", res.data); 

      setPlan(res.data.plan || "No plan generated");

    } catch (err) {
      console.error("PLANNER ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.error ||
        "Failed to generate plan ❌"
      );
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
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        AI Study Planner 📅
      </h2>

      {/* SUBJECT INPUT */}
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

      {/* HOURS INPUT */}
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
        }}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {/* EMPTY */}
      {!plan && !loading && (
        <p style={{ marginTop: "20px", color: "#777", textAlign: "center" }}>
          Enter subjects and hours to generate your study plan 📚
        </p>
      )}

      {/* RESULT */}
      {plan && (
        <div
          style={{
            marginTop: "25px",
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            lineHeight: "1.8",
          }}
        >
          <h3>📌 Your Personalized Plan</h3>
          <hr />

          <ReactMarkdown
            components={{
              h1: ({ children }) => <h3>{children}</h3>,
              h2: ({ children }) => <h4>{children}</h4>,
              p: ({ children }) => <p>{children}</p>,
              li: ({ children }) => <li>{children}</li>,
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
      )}
    </div>
  );
}

export default StudyPlanner;