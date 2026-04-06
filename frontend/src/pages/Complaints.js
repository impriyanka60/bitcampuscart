import React, { useEffect, useState } from "react";
import axios from "axios";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "Internet",
    description: "",
    location: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints")
      .then(res => setComplaints(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:5000/api/complaints",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.reload();
  };

  return (
    <div>
      <h2>🛠️ Campus Complaints</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <select onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option>Internet</option>
          <option>Electricity</option>
          <option>Water</option>
          <option>Cleanliness</option>
          <option>Other</option>
        </select>

        <input
          placeholder="Location (Hostel/Block)"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          placeholder="Describe the issue"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <button type="submit">Submit Complaint</button>
      </form>

      <hr />

      {complaints.map(c => (
        <div key={c._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h4>{c.title}</h4>
          <p>{c.description}</p>
          <p><strong>Category:</strong> {c.category}</p>
          <p><strong>Location:</strong> {c.location}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: c.status === "Resolved" ? "green" : "orange" }}>
              {c.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default Complaints;
