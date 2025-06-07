import React, { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TRAVEL_COMPANY");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to register");
      }

      alert("Registration successful. Please log in.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Register</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" />
      <br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
      <br />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="TRAVEL_COMPANY">Travel Company</option>
        <option value="USER">User</option>
      </select>
      <br />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
