import ResultCard from "../components/ResultCard.jsx";

export default function Results({ result }) {
  if (!result) return null;

  if (result.urgent) {
    return (
      <div className="card urgent">
        These symptoms can be serious. Please seek medical care now instead of self-medicating.
      </div>
    );
  }

  return (
    <>
      {result.recommendations.length === 0 && (
        <p>No safe match found. Please consult a doctor or pharmacist.</p>
      )}
      {result.recommendations.map((m) => <ResultCard key={m.id} med={m} />)}

      {result.excluded?.length > 0 && (
        <details className="card">
          <summary>Medicines we left out for you ({result.excluded.length})</summary>
          <ul>
            {result.excluded.map((e) => (
              <li key={e.name}><strong>{e.name}</strong>: {e.reason}</li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
