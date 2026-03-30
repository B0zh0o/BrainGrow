import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey";

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Достъпът е забранен. Изискват се админ права!" });
    }
};