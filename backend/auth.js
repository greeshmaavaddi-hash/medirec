import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });

// Runs on every request. If a valid token is sent, sets req.user. Never blocks.
export function attachUser(req, _res, next) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(header.slice(7), SECRET);
    } catch {
      // invalid or expired token: treat as logged out
    }
  }
  next();
}

// Use on routes that need a logged-in user.
export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Please log in" });
  next();
}
