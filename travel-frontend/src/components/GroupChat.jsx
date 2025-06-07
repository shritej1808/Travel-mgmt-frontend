import React, { useEffect, useState } from "react";

function GroupChat({ user }) {
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!groupId) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/chat/${groupId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);

      const data = await res.json();
      console.log("Messages from backend:", data);
      setMessages(data);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !groupId) return;

    setError("");
    try {
      const res = await fetch(`http://localhost:8080/chat/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);

      setMessage("");
      await fetchMessages();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Group Chat</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchMessages();
        }}
      >
        <input
          type="text"
          placeholder="Enter Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading messages...</p>}

      {groupId && !loading && (
        <>
          <div
            style={{
              marginTop: "1rem",
              maxHeight: 300,
              overflowY: "scroll",
              border: "1px solid gray",
              padding: "1rem",
            }}
          >
            {messages.length === 0 && <p>No messages in this group.</p>}
            {messages.map((msg) => (
              <div key={msg.id}>
                <b>{msg.sender}</b>: {msg.message}{" "}
                <small style={{ color: "#666", fontSize: "0.8rem" }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ marginTop: "1rem" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              required
              style={{ width: "80%" }}
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default GroupChat;
