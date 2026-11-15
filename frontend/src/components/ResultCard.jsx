export default function ResultCard({ med }) {
  return (
    <div className="card rec">
      <div><strong>{med.name}</strong> <span className="muted">({med.generic})</span></div>
      <div className="muted">Treats: {med.matched_symptoms.join(", ")}</div>
      {!med.otc && <div className="warn">Prescription medicine: consult a doctor first.</div>}
      <div className="score">Match {Math.round(med.score * 100)}%</div>
    </div>
  );
}
