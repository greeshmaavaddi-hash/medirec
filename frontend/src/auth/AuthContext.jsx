import { createContext, useContext, useState } from "react";

const TOKEN_KEY = "medirec_token";
const USER_KEY = "medirec_user";

// Makes every /api request from every page send the login token automatically,
// so teammates' pages need no changes.
if (!window.__medirecFetchPatched) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const url = typeof input === "string" ? input : input.url;
    if (token && url.startsWith("/api")) {
      init = { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` } };
    }
    return originalFetch(input, init);
  };
  window.__medirecFetchPatched = true;
}

async function post(path, body) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });

  function save(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }
  const login = async (email, password) => save(await post("/api/auth/login", { email, password }));
  const register = async (email, password) => save(await post("/api/auth/register", { email, password }));
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
