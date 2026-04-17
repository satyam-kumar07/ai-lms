import { useState, useRef, useEffect } from "react";
import API from "../services/api";

function AITeacher() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askAI = async () => {
    if (!question) return;

    try {
      const res = await API.post("/ai/ask", { question });

      setMessages((prev) => [
        ...prev,
        { type: "user", text: question },
        { type: "ai", text: res.data.reply },
      ]);

      setQuestion("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>AI Teacher 🤖</h2>

      {/* CHAT AREA */}
      <div style={{ maxWidth: "800px", margin: "auto", paddingBottom: "80px" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                margin: "10px",
                padding: "10px",
                background: msg.type === "user" ? "#4CAF50" : "#eee",
                color: msg.type === "user" ? "white" : "black",
                borderRadius: "10px",
                maxWidth: "60%",
                wordBreak: "break-word",
              }}
            >
              <b>{msg.type === "user" ? "You" : "AI"}</b>

              <div
                style={{
                  marginTop: "5px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* ✅ AUTO SCROLL TARGET */}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT AREA (FIXED BOTTOM) */}
      <div
style={{
    position: "fixed",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "900px",
    display: "flex",
  }}
>
        <input
          value={question}
          placeholder="Ask something..."
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />

        <button
          onClick={askAI}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}

export default AITeacher;