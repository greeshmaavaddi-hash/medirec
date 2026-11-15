import SymptomChecker from "./pages/SymptomChecker.jsx";

export default function App() {
  return (
    <main className="wrap">
      <h1>MediRec</h1>
      <p className="sub">Personalised over-the-counter medicine suggestions</p>
      <SymptomChecker />
      <p className="disclaimer">Demo project. Not medical advice; always consult a doctor or pharmacist.</p>
    </main>
  );
}
