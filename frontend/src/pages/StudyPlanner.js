import { useState } from "react";
import API from "../services/api";

function StudyPlanner() {
  const [subjects, setSubjects] = useState("");
  const [hours, setHours] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
  try {
    setLoading(true); // START loading

    const res = await API.post("/ai/study-plan", {
      subjects,
      hours,
    });

    setPlan(res.data.plan);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // STOP loading
  }
};

  return (
    <div
  style={{
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  }}
>
      <h2 style={{ marginBottom: "15px" }}>
  AI Study Planner 🤖
</h2>

      <input
  placeholder="Subjects"
  onChange={(e) => setSubjects(e.target.value)}
  style={{ padding: "10px", marginRight: "10px", width: "60%" }}
/>

<input
  placeholder="Hours"
  onChange={(e) => setHours(e.target.value)}
  style={{ padding: "10px", marginRight: "10px", width: "20%" }}
/>

      <button onClick={generatePlan} disabled={loading}>
  {loading ? "Generating..." : "Generate Plan"}
</button>

      <div
  style={{
    marginTop: "20px",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "700px",
  }}
>
  <h3>📅 Your Study Plan</h3>

  {plan.split("\n").map((line, index) => (
    <p key={index} style={{ margin: "6px 0" }}>
      {line}
    </p>
  ))}
</div>
    </div>
  );
}

export default StudyPlanner;