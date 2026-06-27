import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !type || !name) {
      setMessage("Please fill all fields");
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('name', name);

    try {
      const res = await axios.post('/api/ai/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(`✅ Success! ${res.data.chunksIngested} chunks ingested from ${file.name}`);
      setFile(null);
      setName('');
      // Optionally reset file input
      e.target.reset();
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    }

    setUploading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Upload Campus Document</h2>
      <p>Upload PDFs (Placement brochures, Mess menu, Bus schedule, Notices, etc.)</p>

      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: "15px" }}>
          <label><strong>Document Type:</strong></label><br />
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          >
            <option value="">Select Type</option>
            <option value="placement">Placement Brochure / Eligibility</option>
            <option value="mess">Mess Menu</option>
            <option value="bus">Bus Schedule</option>
            <option value="notice">General Notice</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label><strong>Document Name / Title:</strong></label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Google Placement Drive 2026"
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label><strong>Upload PDF:</strong></label><br />
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            style={{ marginTop: "5px" }}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          style={{
            padding: "12px 24px",
            background: uploading ? "#666" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: uploading ? "not-allowed" : "pointer"
          }}
        >
          {uploading ? "Uploading & Processing..." : "Upload & Ingest"}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: "20px",
          padding: "12px",
          background: message.includes("✅") ? "#d4edda" : "#f8d7da",
          color: message.includes("✅") ? "#155724" : "#721c24",
          borderRadius: "4px"
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;