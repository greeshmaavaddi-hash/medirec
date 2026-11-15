import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const split = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
const join = (a) => (Array.isArray(a) ? a.join(", ") : "");

export default function Profile() {
  const { logout } = useAuth();
  const [form, setForm] = useState({ age: "", allergies: "", conditions: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    fetch("/api/profile")
      .then(async (r) => {
        if (r.status === 401) return logout();   // token expired
        const p = await r.json();
        setForm({ age: p.age ?? "", allergies: join(p.allergies), conditions: join(p.conditions) });
      })
      .catch(() => setError("Could not load your profile"));
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true); setMsg(""); setError("");
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: form.age, allergies: split(form.allergies), conditions: split(form.conditions),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not save");
      setForm({ age: data.age ?? "", allergies: join(data.allergies), conditions: join(data.conditions) });
      setMsg("Saved. Allergies are stored with standard medicine names.");
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return (
    <form className="card" onSubmit={save}>
      <h2>My health profile</h2>
      <p className="muted">The Symptom Checker uses this automatically to keep suggestions safe for you.</p>
      <label>Age
        <input type="number" min="0" max="120" value={form.age} onChange={set("age")} /></label>
      <label>Allergies (comma separated)
        <input value={form.allergies} onChange={set("allergies")} placeholder="acetaminophen" /></label>
      <label>Existing conditions (comma separated)
        <input value={form.conditions} onChange={set("conditions")} placeholder="ulcer, asthma" /></label>
      {error && <p className="error">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
    </form>
  );
}
