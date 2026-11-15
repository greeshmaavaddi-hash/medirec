import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";                    // Person 1
import Register from "./pages/Register.jsx";              // Person 1
import Profile from "./pages/Profile.jsx";                // Person 1
import SymptomChecker from "./pages/SymptomChecker.jsx";  // Person 2

export default function App() {
  return (
    <main className="wrap">
      <h1>MediRec</h1>
      <p className="sub">Personalised over-the-counter medicine suggestions</p>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
        {/* Person 3 adds the /library and /history routes here */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <p className="disclaimer">Demo project. Not medical advice; always consult a doctor or pharmacist.</p>
    </main>
  );
}
