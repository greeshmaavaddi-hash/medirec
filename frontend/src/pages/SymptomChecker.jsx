import { useEffect, useState } from "react";
import Results from "./Results.jsx";

const split = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
const join = (a) => (Array.isArray(a) ? a.join(", ") : "");

export default function SymptomChecker() {
  const [form, setForm] = useState({ symptoms: "", age: "", allergies: "", conditions: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill from Person 1's profile API. Silently skipped until that exists.
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => p && setForm((f) => ({
        ...f, age: p.age ?? "", allergies: join(p.allergies), conditions: join(p.conditions),
      })))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setLoading(true); setError(""); setResult(null);
    try {
      const r = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: split(form.symptoms), age: form.age,
          allergies: split(form.allergies), conditions: split(form.conditions),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <>
      <section className="card">
        <label>Symptoms (comma separated)
          <input value={form.symptoms} onChange={set("symptoms")} placeholder="fever, headache" /></label>
        <label>Age
          <input type="number" min="0" max="120" value={form.age} onChange={set("age")} placeholder="30" /></label>
        <label>Allergies
          <input value={form.allergies} onChange={set("allergies")} placeholder="ibuprofen" /></label>
        <label>Existing conditions
          <input value={form.conditions} onChange={set("conditions")} placeholder="ulcer, asthma" /></label>
        <button onClick={submit} disabled={loading || !form.symptoms.trim()}>
          {loading ? "Finding..." : "Get recommendations"}</button>
      </section>

      {error && <p className="error">{error}</p>}

      <Results result={result} />
    </>
  );
}
