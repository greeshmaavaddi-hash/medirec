import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      {user ? (
        <>
          <Link to="/">Symptom Checker</Link>
          <Link to="/profile">My Profile</Link>
          {/* Person 3 adds the Library and History links here */}
          <span className="muted">{user.email}</span>
          <button className="linkbtn" onClick={logout}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
