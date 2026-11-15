import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true); setError("");
    try {
      await register(form.email, form.password);
      navigate("/profile");   // next step: fill in the health profile
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Create account</h2>
      <label>Email
        <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" /></label>
      <label>Password (at least 8 characters)
        <input type="password" value={form.password} onChange={set("password")} /></label>
      <label>Confirm password
        <input type="password" value={form.confirm} onChange={set("confirm")} /></label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading || !form.email || !form.password}>
        {loading ? "Creating..." : "Register"}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
