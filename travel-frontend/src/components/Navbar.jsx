import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav>
      <div className="container">
        {user ? (
          <>
            Welcome, <b>{user.username}</b>! Roles:{" "}
            {user.roles?.map((r) => r.authority).join(", ")} |{" "}
            <Link to="/packages">Packages</Link>
            {user.roles?.some((r) => r.authority === "USER") && (
              <>
                {" | "}
                <Link to="/chat">Group Chat</Link>
              </>
            )}
            <button onClick={onLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;