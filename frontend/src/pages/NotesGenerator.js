import { useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

function NotesGenerator() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");

  const generateNotes = async () => {
    if (!topic) return;

    try {
      const res = await API.post("/ai/notes", { topic });
      setNotes(res.data.notes);
    } catch (err) {
      console.error(err);
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
        AI Notes Generator 📝
      </h2>

      {/* INPUT + BUTTON */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "10px",
            width: "70%",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={generateNotes}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Generate Notes
        </button>
      </div>

      {/* NOTES OUTPUT */}
      {notes && (
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <ReactMarkdown>{notes}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default NotesGenerator;