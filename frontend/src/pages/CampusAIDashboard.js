import React, { useState } from 'react';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload'; // Adjust path if needed

const CampusAIDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "upload"

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post('/api/ai/chat', {
        question: input,
        type: filter || undefined
      });

      setMessages(prev => [...prev, { type: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: "Sorry, I couldn't process your request. Please try again." 
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        🎓 Campus AI Assistant
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        Upload campus documents (Placement PDFs, Mess Menu, Bus Schedule, etc.) and ask anything in natural language
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", borderBottom: "2px solid #ddd" }}>
        <button
          onClick={() => setActiveTab("chat")}
          style={{
            padding: "12px 24px",
            fontWeight: activeTab === "chat" ? "bold" : "normal",
            borderBottom: activeTab === "chat" ? "4px solid #007bff" : "none",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          💬 Ask Campus AI
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          style={{
            padding: "12px 24px",
            fontWeight: activeTab === "upload" ? "bold" : "normal",
            borderBottom: activeTab === "upload" ? "4px solid #007bff" : "none",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          📤 Upload New Document
        </button>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>

        {/* Chat Section */}
        {activeTab === "chat" && (
          <div style={{ flex: "1", minWidth: "500px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label><strong>Filter by Document Type:</strong></label><br />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ padding: "8px", width: "100%", maxWidth: "300px" }}
              >
                <option value="">All Documents</option>
                <option value="placement">Placement Documents</option>
                <option value="mess">Mess Menu</option>
                <option value="bus">Bus Schedule</option>
                <option value="notice">Notices</option>
              </select>
            </div>

            <div 
              className="chat-window"
              style={{
                height: "520px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                background: "#f9f9f9",
                marginBottom: "15px"
              }}
            >
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#888", marginTop: "100px" }}>
                  Ask me anything about campus!<br />
                  Example: "What is the eligibility for Google placement?"<br />
                  "Show mess menu for this week"
                </p>
              )}

              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  style={{ 
                    margin: "15px 0", 
                    padding: "12px 16px",
                    borderRadius: "12px",
                    maxWidth: "85%",
                    background: msg.type === 'user' ? "#007bff" : "#e9ecef",
                    color: msg.type === 'user' ? "white" : "black",
                    alignSelf: msg.type === 'user' ? "flex-end" : "flex-start",
                    marginLeft: msg.type === 'user' ? "auto" : "0"
                  }}
                >
                  <strong>{msg.type === 'user' ? 'You' : 'Campus AI'}:</strong><br />
                  {msg.text}
                </div>
              ))}

              {loading && <p style={{ fontStyle: "italic", color: "#666" }}>Campus AI is thinking...</p>}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question here..."
                style={{ flex: 1, padding: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()}
                style={{
                  padding: "14px 28px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {activeTab === "upload" && (
          <div style={{ flex: "1", minWidth: "500px" }}>
            <DocumentUpload />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusAIDashboard;