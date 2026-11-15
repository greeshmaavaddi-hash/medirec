import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Log in</h2>
      <label>Email
        <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" /></label>
      <label>Password
        <input type="password" value={form.password} onChange={set("password")} /></label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading || !form.email || !form.password}>
        {loading ? "Logging in..." : "Log in"}</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
