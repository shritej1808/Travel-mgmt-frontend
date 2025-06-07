import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Packages from "./components/Packages";
import GroupChat from "./components/GroupChat";

function App() {
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    try {
      const res = await fetch("http://localhost:8080/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/packages" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages" element={<Packages user={user} />} />
        <Route
          path="/chat"
          element={
            user?.roles?.some((r) => r.authority === "USER") ? (
              <GroupChat user={user} />
            ) : (
              <Navigate to="/packages" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
