import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey"; // move to .env later

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { id: decoded.id }; // <-- THIS gives access in controllers: req.user.id

    next(); // Continue to the next handler (controller)
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
