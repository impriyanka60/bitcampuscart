import React, { useState } from "react";
import axios from "axios";

function NetworkSetup() {
  const [hostel, setHostel] = useState("Girls Hostel");
  const [room, setRoom] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!room) {
      setError("Please enter room number");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/network`,
        {
          params: { hostel, room }
        }
      );
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div style={{ maxWidth: "520px", margin: "auto" }}>
      <h2>Hostel LAN Configuration Helper</h2>

      <label>Hostel</label>
      <select value={hostel} onChange={(e) => setHostel(e.target.value)}>
        <option>Girls Hostel</option>
      </select>

      <br /><br />

      <label>Room Number</label>
      <input
        type="text"
        placeholder="e.g. 224"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSearch}>Get Network Settings</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}>
          <h4>LAN Settings</h4>

          <p><strong>IP Address(es):</strong></p>
          {result.ipAddresses.map((ip, i) => (
            <div key={i}>
              {ip} <button onClick={() => copy(ip)}>Copy</button>
            </div>
          ))}

          <p>
            <strong>Subnet Mask:</strong> {result.subnetMask}
            <button onClick={() => copy(result.subnetMask)}>Copy</button>
          </p>

          <p>
            <strong>Gateway:</strong> {result.gateway}
            <button onClick={() => copy(result.gateway)}>Copy</button>
          </p>

          <p>
            <strong>DNS:</strong> {result.dns}
            <button onClick={() => copy(result.dns)}>Copy</button>
          </p>

          <small style={{ color: "gray" }}>
            * Use any one IP address if multiple are shown.
          </small>
        </div>
      )}
    </div>
  );
}

export default NetworkSetup;
