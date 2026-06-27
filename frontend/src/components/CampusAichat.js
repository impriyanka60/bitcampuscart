import React, { useState } from 'react';
import axios from 'axios';

const CampusAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(""); // "placement", "mess", etc.

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        question: input,
        type: filter || undefined
      });

      setMessages(prev => [...prev, { type: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'ai', text: "Sorry, something went wrong." }]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="chat-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2>Campus AI Assistant</h2>
      
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All Documents</option>
        <option value="placement">Placement Only</option>
        <option value="mess">Mess Menu</option>
        <option value="bus">Bus Schedule</option>
        <option value="notice">Notices</option>
      </select>

      <div className="messages" style={{ height: "500px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0", textAlign: msg.type === 'user' ? 'right' : 'left' }}>
            <strong>{msg.type === 'user' ? 'You' : 'Campus AI'}:</strong> {msg.text}
          </div>
        ))}
        {loading && <p>Thinking...</p>}
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything... e.g. eligibility for Google placement"
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
};

export default CampusAIChat;